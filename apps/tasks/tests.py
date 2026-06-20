from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from apps.tasks.models import Task, Comment
from apps.workspaces.models import WorkSpace, WorkSpaceMember
from rest_framework import status

User = get_user_model()

class TestTasksCase(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username='men', email='meni@gmail.com', password='mens_pass'
        )


        self.member = User.objects.create_user(
            username='sen', email='seni@gmail.com', password='sens_pass'
        )
        
        self.client.force_authenticate(user=self.owner)
        response = self.client.post('/api/workspaces/', data={'name':'space of owner'}, format='json')
        self.workspace_id = response.data['id']

        response = self.client.post(
            f'/api/workspaces/{self.workspace_id}/projects/',
            data={'name':'mens project'},
            format='json'
        )

        self.project_id = response.data['id']

        WorkSpaceMember.objects.create(
            user=self.member,
            workspace_id=self.workspace_id,
            role=WorkSpaceMember.Role.MEMBER
        )

    def test_create_task(self):    
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(f'/api/workspaces/{self.workspace_id}/projects/{self.project_id}/tasks/', data={'title':'Running'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Task.objects.filter(title='Running').exists())

    def test_member_cannot_create_task(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.post(f'/api/workspaces/{self.workspace_id}/projects/{self.project_id}/tasks/', data={'title':'Swimming'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(Task.objects.filter(title='Swimming').exists())

    def test_get_tasks(self):
        self.client.force_authenticate(user=self.owner)

        Task.objects.create(
            title='Sleeping',
            owner=self.owner,
            project_id=self.project_id
        )

        response = self.client.get(f'/api/workspaces/{self.workspace_id}/projects/{self.project_id}/tasks/', format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)    

    def test_assign_task(self):
        self.client.force_authenticate(user=self.owner)
        task = Task.objects.create(
            title='Reading',
            owner=self.owner,
            project_id=self.project_id
        
        )    
        task_id = task.id

        response = self.client.patch(
            f'/api/workspaces/{self.workspace_id}/projects/{self.project_id}/tasks/{task_id}/assign/',
            data={'assigned_to':self.member.id},
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task.refresh_from_db()
        self.assertEqual(task.assigned_to, self.member)


    def test_comment(self):
        self.client.force_authenticate(user=self.member)
        task = Task.objects.create(
            title='Eating',
            owner=self.owner,
            project_id=self.project_id
        )
        task_id = task.id

        data = {
            'text':'i will not fall, i will stand tall, feels like no one can beat me',
        }

        response = self.client.post(f'/api/workspaces/{self.workspace_id}/projects/{self.project_id}/tasks/{task_id}/comments/', data=data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Comment.objects.filter(text='i will not fall, i will stand tall, feels like no one can beat me').exists())
