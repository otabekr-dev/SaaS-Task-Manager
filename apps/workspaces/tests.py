from rest_framework.test import APITestCase
from apps.workspaces.models import WorkSpace, WorkSpaceMember
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class WorkspaceCreateCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='ali',
            email='ali@gmail.com',
            password='StringBool'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_workspace(self):
        data = {
            "name":"New Workspace",
            "description":"New WS's description"
        }

        response = self.client.post('/api/workspaces/', data=data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
       
        workspace = WorkSpace.objects.get(name="New Workspace")

        self.assertTrue(
            WorkSpaceMember.objects.filter(
                user=self.user,
                workspace=workspace,
                role=WorkSpaceMember.Role.OWNER
            ).exists()
        )

class WorkspaceListCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='abdugani',
            email='abdugani@gmail.com',
            password='abducode'
        )

        self.client.force_authenticate(user=self.user)
        self.client.post('/api/workspaces/', data={'name':'user1 WS'}, format='json')
        
        self.user2 = User.objects.create_user(
            username='bob',
            email='bob@gmail.com',
            password='StrongPass123'
        )

        self.client.force_authenticate(user=self.user2)
        self.client.post('/api/workspaces/', data={'name':'user2 WS'}, format='json')

    def test_list_workspace(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/workspaces/', format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data), 1)

class NonMemberAccessCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username = 'username',
            password = 'someshit',
            email = 'something@gmail.com'
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/workspaces/', data={'name':'username ws'}, format='json')
        self.workspace_id = response.data['id']

        self.user2 = User.objects.create_user(
            username='username2',
            password='username2password',
            email='username2@gmail.com'
        )
        self.client.force_authenticate(user=self.user2)
        response = self.client.post('/api/workspaces/', data={'name':'username 2 ws'}, format='json')
        self.workspace2_id = response.data['id']

    def test_non_member_access(self):
        response = self.client.get(f'/api/workspaces/{self.workspace_id}/', format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
            
