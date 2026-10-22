from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.users.models import User
from apps.swaps.models import SwapRequest
from apps.sessions_app.models import SwapSession

class PermissionsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username='user1', email='user1@example.com', password='Password123!'
        )
        self.user2 = User.objects.create_user(
            username='user2', email='user2@example.com', password='Password123!'
        )
        self.outsider = User.objects.create_user(
            username='outsider', email='outsider@example.com', password='Password123!'
        )
        self.req = SwapRequest.objects.create(
            sender=self.user1,
            recipient=self.user2,
            sender_skill='Design',
            recipient_skill='Code',
            intro_note='Let us swap skills mutually.',
            status='Accepted'
        )
        self.session = SwapSession.objects.create(
            swap_request=self.req,
            user_a=self.user1,
            user_b=self.user2,
            skill_taught_by_a='Design',
            skill_taught_by_b='Code'
        )

    def test_unauthenticated_request_rejected(self):
        url = reverse('auth-me')
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_outsider_cannot_view_or_modify_session(self):
        self.client.force_authenticate(user=self.outsider)
        url = reverse('session-detail', kwargs={'pk': self.session.id})
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
