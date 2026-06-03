from rest_framework import serializers

from apps.users.serializers import UserSerializer
from .models import WorkSpace, WorkSpaceMember




class WorkSpaceSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = WorkSpace
        fields = ['id', 'name', 'description', 'owner', 'created_at']

class WorkSpaceMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)


    class Meta:
        model = WorkSpaceMember
        fields = ['id', 'user', 'workspace', 'role', 'joined_at']