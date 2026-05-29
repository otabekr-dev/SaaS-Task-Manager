from rest_framework.permissions import BasePermission
from .models import WorkSpaceMember

class IsWorkSpaceOwner(BasePermission):

    def has_permission(self, request, view):
        workspace_id = view.kwargs.get('workspace_id')
        return WorkSpaceMember.objects.filter(
            user = request.user,
            workspace_id=workspace_id,
            role=WorkSpaceMember.role.OWNER
        ).exists()


class IsWorkSpaceAdminOrOwner(BasePermission):
    def has_permission(self, request, view):
        workspace_id = view.kwargs.get('workspace_id')
        return WorkSpaceMember.objects.filter(
            user=request.user,
            workspace_id=workspace_id,
            role__in=[WorkSpaceMember.role.OWNER, WorkSpaceMember.role.ADMIN]
        ).exists()
    