from rest_framework import serializers
from .models import Project
from apps.users.serializers import UserSerializer



class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description',
            'workspace', 'owner', 'created_at'
        ]
        read_only_fields = [
            'id', 'workspace',
            'owner', 'created_at'
        ]