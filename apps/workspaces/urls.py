from django.urls import path
from .views import WorkSpaceView, WorkSpaceMemberView, WorkSpaceDetailView, WorkSpaceMemberDetaiView, StatView

urlpatterns = [
    path('', WorkSpaceView.as_view(), name='workspace-list'),
    path('<int:workspace_id>/', WorkSpaceDetailView.as_view(), name='workspace-detail'),
    path('<int:workspace_id>/members/', WorkSpaceMemberView.as_view(), name='workspace-members'),
    path('<int:workspace_id>/members/<int:user_id>/', WorkSpaceMemberDetaiView.as_view(), name='workspace-member-detail'),
    path('<int:workspace_id>/stats/', StatView.as_view(), name='statistics'),
]