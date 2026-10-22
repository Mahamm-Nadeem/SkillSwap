from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.users.models import User
from apps.skills.models import Skill, UserSkill

class AuthAndProfilesTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_registration_success(self):
        url = reverse('auth-register')
        payload = {
            'email': 'tester@example.com',
            'username': 'tester',
            'password': 'SecurePassword123!',
            'displayName': 'Test User'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', res.data)
        self.assertEqual(res.data['user']['email'], 'tester@example.com')
        self.assertEqual(res.data['user']['published'], False)

    def test_duplicate_email_registration_fails(self):
        User.objects.create_user(
            username='existing',
            email='existing@example.com',
            password='Password123!'
        )
        url = reverse('auth-register')
        payload = {
            'email': 'existing@example.com',
            'username': 'newuser',
            'password': 'Password123!'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        user = User.objects.create_user(
            username='loginuser',
            email='login@example.com',
            password='MyPassword123!'
        )
        url = reverse('auth-login')
        payload = {
            'username': 'login@example.com',
            'password': 'MyPassword123!'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('token', res.data)

    def test_publish_profile_with_valid_skills(self):
        user = User.objects.create_user(
            username='onboarding_user',
            email='onboard@example.com',
            password='Password123!'
        )
        self.client.force_authenticate(user=user)
        url = reverse('profile-publish')
        payload = {
            'displayName': 'Onboarded User',
            'headline': 'Full Stack Dev',
            'bio': 'Passionate learner',
            'timezone': 'Europe/London',
            'skillsOffered': [
                {'name': 'Python', 'level': 'Advanced', 'category': 'Programming'}
            ],
            'skillsRequested': [
                {'name': 'Spanish', 'level': 'Beginner', 'category': 'Languages'}
            ]
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.published)
        self.assertEqual(user.user_skills.filter(skill_type='offered').count(), 1)
        self.assertEqual(user.user_skills.filter(skill_type='requested').count(), 1)

    def test_publish_profile_missing_skills_fails(self):
        user = User.objects.create_user(
            username='empty_skills_user',
            email='empty@example.com',
            password='Password123!'
        )
        self.client.force_authenticate(user=user)
        url = reverse('profile-publish')
        payload = {
            'displayName': 'Incomplete User',
            'bio': 'No skills',
            'skillsOffered': [],
            'skillsRequested': [{'name': 'Design', 'level': 'Beginner'}]
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        user.refresh_from_db()
        self.assertFalse(user.published)

    def test_directory_search_and_filter(self):
        user = User.objects.create_user(
            username='figma_teacher',
            email='figma@example.com',
            password='Password123!',
            display_name='Figma Teacher',
            published=True
        )
        skill = Skill.objects.create(name='Figma', category='Design')
        UserSkill.objects.create(user=user, skill=skill, skill_type='offered', level='Advanced')

        url = reverse('profile-directory')
        res = self.client.get(url, {'search': 'Figma'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(res.data['count'], 1)
        self.assertEqual(res.data['results'][0]['displayName'], 'Figma Teacher')
