from rest_framework import serializers
from .models import Task
from apps.users.serializers import UserSerializer


class TaskSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description',
            'owner', 'project', 'assigned_to', 'status'
        ]
        read_only_fields = ['id', 'owner', 'project', 'created_at']