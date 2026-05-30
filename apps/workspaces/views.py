from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import WorkSpace, WorkSpaceMember
from django.shortcuts import get_object_or_404
from .serializers import WorkSpaceSerializer, WorkSpaceMemberSerializer
from .permissions import IsWorkSpaceOwner, IsWorkSpaceAdminOrOwner

User = get_user_model()


class WorkSpaceView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]


    def get(self, request: Request) -> Response:
        workspaces = WorkSpace.objects.filter(members__user=request.user)
        serializer = WorkSpaceSerializer(workspaces, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request: Request) -> Response:
        serializer = WorkSpaceSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            workspace = serializer.save(owner=request.user)
            WorkSpaceMember.objects.create(
                user=request.user,
                workspace=workspace,
                role=WorkSpaceMember.Role.OWNER
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        

class WorkSpaceDetailView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        elif self.request.method == 'PATCH':
            return [IsWorkSpaceAdminOrOwner()]
        elif self.request.method == 'DELETE':
            return [IsWorkSpaceOwner()]
        return [IsAuthenticated()]
    
    def get_object(self, workspace_id):
        return get_object_or_404(WorkSpace, id=workspace_id)
    
    def get(self, request: Request, workspace_id: int) -> Response:
    
        workspace = self.get_object(workspace_id)
    
        serializer = WorkSpaceSerializer(workspace)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def patch(self, request: Request, workspace_id: int):
        
        workspace = self.get_object(workspace_id)

        serializer = WorkSpaceSerializer(workspace, data=request.data, partial=True) 
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        

    def delete(self, request: Request, workspace_id: int):

        workspace = self.get_object(workspace_id)

        workspace.delete()
        return Response('Deleted', status=status.HTTP_200_OK)


class WorkSpaceMemberView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        elif self.request.method == 'POST':
            return [IsWorkSpaceAdminOrOwner()]
        return [IsAuthenticated()]


    def get(self, request: Request, workspace_id: int) -> Response:
        member = WorkSpaceMember.objects.filter(workspace_id=workspace_id)
        serializer = WorkSpaceMemberSerializer(member, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request: Request, workspace_id:int) -> Response:
        email = request.data.get('email')
        if not email:
            return Response('Email is required', status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response('User not found', status=status.HTTP_404_NOT_FOUND)
        
        already_member = WorkSpaceMember.objects.filter(
            user=user,
            workspace_id=workspace_id
        ).exists()

        if already_member:
            return Response('User is already a member', status=status.HTTP_400_BAD_REQUEST)
        
        member = WorkSpaceMember.objects.create(
            user=user,
            workspace_id=workspace_id,
            role=WorkSpaceMember.Role.MEMBER
        )
        serializer = WorkSpaceMemberSerializer(member)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class WorkSpaceMemberDetaiView(APIView):

    def get_permissions(self):
        if self.request.method == 'PATCH':
            return [IsWorkSpaceOwner()]
        elif self.request.method == 'DELETE':
            return [IsWorkSpaceAdminOrOwner()]
        return [IsAuthenticated()]


    def get_object(self, workspace_id, user_id):
        return get_object_or_404(WorkSpaceMember, user_id=user_id, workspace_id=workspace_id)


    def patch(self, request: Request, workspace_id: int, user_id: int) -> Response:
        member = self.get_object(workspace_id, user_id)

        new_role = request.data.get('role')

        if new_role == WorkSpaceMember.Role.OWNER:
            return Response('Cannot assign OWNER role', status=status.HTTP_400_BAD_REQUEST)

        if member.user == request.user:
            return Response('Cannot change your own role', status=status.HTTP_400_BAD_REQUEST)

        member.role = new_role
        member.save()
        serializer = WorkSpaceMember(member)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, workspace_id: int, user_id: int) -> Response:
        member = self.get_object(workspace_id, user_id)

        if member.role == WorkSpaceMember.Role.OWNER:
            return Response('Cannot remove OWNER', status=status.HTTP_400_BAD_REQUEST)

        if member.user == request.user:
            return Response('Cannot remove yourself', status=status.HTTP_400_BAD_REQUEST)

        member.delete()
        return Response('DELETED',status=status.HTTP_200_OK)
            