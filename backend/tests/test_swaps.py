from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.users.models import User
from apps.swaps.models import SwapRequest
from apps.sessions_app.models import SwapSession

class SwapsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.alice = User.objects.create_user(
            username='alice',
            email='alice@example.com',
            password='Password123!',
            display_name='Alice Smith',
            published=True
        )
        self.bob = User.objects.create_user(
            username='bob',
            email='bob@example.com',
            password='Password123!',
            display_name='Bob Jones',
            published=True
        )

    def test_create_swap_proposal_success(self):
        self.client.force_authenticate(user=self.alice)
        url = reverse('swap-requests-list-create')
        payload = {
            'recipientId': self.bob.id,
            'senderSkill': 'Conversational English',
            'recipientSkill': 'Python',
            'introNote': 'Hi Bob, I would love to exchange English practice for Python coding help.'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], 'Pending')
        self.assertEqual(SwapRequest.objects.count(), 1)

    def test_create_swap_proposal_short_note_fails(self):
        self.client.force_authenticate(user=self.alice)
        url = reverse('swap-requests-list-create')
        payload = {
            'recipientId': self.bob.id,
            'senderSkill': 'English',
            'recipientSkill': 'Python',
            'introNote': 'Too short'  # Less than 20 chars
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(SwapRequest.objects.count(), 0)

    def test_create_swap_proposal_to_self_fails(self):
        self.client.force_authenticate(user=self.alice)
        url = reverse('swap-requests-list-create')
        payload = {
            'recipientId': self.alice.id,
            'senderSkill': 'English',
            'recipientSkill': 'Python',
            'introNote': 'Attempting to send a swap request to myself.'
        }
        res = self.client.post(url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_accept_swap_request_creates_session(self):
        req = SwapRequest.objects.create(
            sender=self.alice,
            recipient=self.bob,
            sender_skill='English',
            recipient_skill='Python',
            intro_note='Let us learn together through peer barter!',
            status='Pending'
        )
        self.client.force_authenticate(user=self.bob)
        url = reverse('swap-request-accept', kwargs={'pk': req.id})
        res = self.client.post(url, {}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        req.refresh_from_db()
        self.assertEqual(req.status, 'Accepted')
        self.assertTrue(hasattr(req, 'session'))
        self.assertEqual(req.session.status, 'Pending Confirmation')

    def test_non_recipient_cannot_accept(self):
        req = SwapRequest.objects.create(
            sender=self.alice,
            recipient=self.bob,
            sender_skill='English',
            recipient_skill='Python',
            intro_note='Let us learn together through peer barter!',
            status='Pending'
        )
        # Alice (sender) tries to accept her own proposal
        self.client.force_authenticate(user=self.alice)
        url = reverse('swap-request-accept', kwargs={'pk': req.id})
        res = self.client.post(url, {}, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
