from rest_framework.permissions import BasePermission
from apps.workspaces.models import WorkSpaceMember

class IsWorkSpaceMember(BasePermission):
    def has_permission(self, request, view):
        workspace_id = view.kwargs.get('workspace_id')
        return WorkSpaceMember.objects.filter(
            user=request.user,
            workspace_id=workspace_id
        ).exists()
    
    
    