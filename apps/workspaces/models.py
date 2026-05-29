from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class WorkSpace(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_workspaces')
    
    created_at = models.DateTimeField(auto_now_add=True)


class WorkSpaceMember(models.Model):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        OWNER = 'OWNER', 'Owner'
        MEMBER = 'MEMBER', 'Member'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workspace_member')
    workspace = models.ForeignKey(WorkSpace, on_delete=models.CASCADE, related_name='members')
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.MEMBER)

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'workspace']