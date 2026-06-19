from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterTestCase(APITestCase):
    def test_register_success(self):
        data = {
            'email': 'test11@example.com',
            'username': 'testing_user',
            'password': 'Very_Strong_Pass',
            'confirm': 'Very_Strong_Pass'
        }

        response = self.client.post('/auth/register/', data=data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='test11@example.com').exists())


class LoginTestCase(APITestCase):
    def setUp(self):
        user = User.objects.create_user(
            email = 'test11@example.com',
            username = 'testing_user', 
            password = 'Very_Strong_Pass'
        )


    def test_login_success(self):
        data = {
            'username': 'testing_user',
            'password': 'Very_Strong_Pass'
        }

        response = self.client.post('/auth/login/', data=data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

class EmailDuplicateCase(APITestCase):
    def test_email_duplicate(self):
        
        user = User.objects.create_user(
            username='testing_user2',
            password='It_Is_Strong_Too',
            email='email@gmail.com'
        )


        data = {
            "email":"email@gmail.com",
            "username":"testter",
            "password":"This_One_Is_Strong_Too",
            "confirm":"This_One_Is_Strong_Too"
        }

        response = self.client.post('/auth/register/', data=data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
