from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.workspaces.permissions import  IsWorkSpaceAdminOrOwner, IsWorkSpaceOwner
from apps.projects.permissions import IsWorkSpaceMember
from .permissions import IsCommentOwner
from .serializers import TaskSerializer, CommentSerializer
from django.shortcuts import get_object_or_404
from .models import Task, Comment


class TaskView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsWorkSpaceMember()]
        elif self.request.method == 'POST':
            return [IsWorkSpaceAdminOrOwner()]
        return [IsAuthenticated()]
    
    def get(self, request: Request, workspace_id:int, project_id:int) -> Response:
        tasks = Task.objects.filter(project_id=project_id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    def post(self, request: Request, workspace_id:int, project_id:int) -> Response:
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(project_id=project_id, owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class TaskDetailView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsWorkSpaceMember()]
        elif self.request.method == 'PATCH':
            return [IsWorkSpaceMember()]
        elif self.request.method == 'DELETE':
            return [IsWorkSpaceOwner()]
        return [IsAuthenticated()]
    
    def get_object(self, task_id:int):
        return get_object_or_404(Task, id=task_id)
    

    def get(self, request: Request, workspace_id:int, task_id:int) -> Response:
        task = self.get_object(task_id=task_id)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request: Request, workspace_id: int, task_id: int) -> Response:
        task = self.get_object(task_id=task_id)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request, workspace_id: int, task_id: int) -> Response:
        task = self.get_object(task_id=task_id)

        task.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)        
    

class CommentView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsWorkSpaceMember()]
        elif self.request.method == 'POST':
            return [IsWorkSpaceMember()]
        return [IsAuthenticated()]

    def get(self, request: Request, workspace_id: int, project_id: int, task_id: int) -> Response:
        comments = Comment.objects.filter(task_id=task_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request: Request, workspace_id: int, project_id: int, task_id: int) -> Response:
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(task_id=task_id, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class CommentDetailView(APIView):

    permission_classes = [IsCommentOwner]

    def delete(self, request: Request, comment_id:int) -> Response:
        comment = get_object_or_404(Comment, id=comment_id)

        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)        