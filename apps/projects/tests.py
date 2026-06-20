from rest_framework.test import APITestCase
from apps.projects.models import Project
from apps.workspaces.models import WorkSpace, WorkSpaceMember
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class ProjectCreateCase(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username='joe', email='joe@email.com', password='joe_pass'
        )

        self.member = User.objects.create_user(
            username='member', email='member@gmail.com', password='member_pass'
        )

        self.outsider = User.objects.create_user(
            username='outsider', email='outsider@gmail.com', password='outsider_pass'
        )

        self.client.force_authenticate(user=self.owner)
        response = self.client.post('/api/workspaces/', data={"name":"owners ws"}, format='json')
        self.workspace_id = response.data['id']

        WorkSpaceMember.objects.create(
            user=self.member,
            workspace_id=self.workspace_id,
            role=WorkSpaceMember.Role.MEMBER
        )
        
    def test_create_project(self):
        self.client.force_authenticate(user=self.owner)
        data = {
            "name":"Project 1",
            "description":"Pr1 desc",
        }    

        response = self.client.post(f'/api/workspaces/{self.workspace_id}/projects/', data=data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Project.objects.filter(name='Project 1').exists())

    def test_get_project(self):
        self.client.force_authenticate(user=self.owner)

        Project.objects.create(
            name='Projec 51',
            workspace_id=self.workspace_id,
            owner=self.owner
        )


        response = self.client.get(f'/api/workspaces/{self.workspace_id}/projects/', format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_member_cannot_create_project(self):
        self.client.force_authenticate(user=self.member)

        data = {
            "name" : "Zone 51",
            "description" : "Zone 51 desc"
        }

        response = self.client.post(f'/api/workspaces/{self.workspace_id}/projects/', data=data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            Project.objects.filter(name='Zone 51').exists()
        )

    def test_non_member_cannot_create_project(self):
        self.client.force_authenticate(user=self.outsider)

        data = {
            "name":"D12",
            "description":"8 mile 313"
        }

        response = self.client.post(f'/api/workspaces/{self.workspace_id}/projects/', data=data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(
            Project.objects.filter(name='D12').exists()
        )            