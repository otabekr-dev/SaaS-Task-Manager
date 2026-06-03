from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.workspaces.permissions import  IsWorkSpaceAdminOrOwner, IsWorkSpaceOwner
from .permissions import IsWorkSpaceMember
from .serializers import ProjectSerializer
from django.shortcuts import get_object_or_404
from .models import Project


class ProjectView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsWorkSpaceMember()]
        elif self.request.method == 'POST':
            return [IsWorkSpaceAdminOrOwner()]
        return [IsAuthenticated()]
    
    def get(self, request: Request, workspace_id: int) -> Response:
        projects = Project.objects.filter(workspace_id=workspace_id)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request: Request, workspace_id:int) -> Response:
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(workspace_id=workspace_id, owner=request.user)
        
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProjectDetailView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsWorkSpaceMember()]
        elif self.request.method == 'PATCH':
            return [IsWorkSpaceAdminOrOwner()]
        elif self.request.method == 'DELETE':
            return [IsWorkSpaceOwner()]
        return [IsAuthenticated()]
    
    def get_object(self, project_id:int):
        return get_object_or_404(Project, id=project_id)
    

    def get(self, request: Request, workspace_id:int, project_id:int)-> Response:
        project = self.get_object(project_id=project_id)
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def patch(self, request:Request, workspace_id:int, project_id:int) -> Response:
        project = self.get_object(project_id=project_id)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, workspace_id:int, project_id:int) -> Response:
        project = self.get_object(project_id=project_id)

        project.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)     