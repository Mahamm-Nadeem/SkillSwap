from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, time, timedelta, datetime
from django.utils import timezone
from apps.users.models import User
from apps.swaps.models import SwapRequest
from apps.sessions_app.models import SwapSession, SessionFeedback

class SessionsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.alice = User.objects.create_user(
            username='alice_session',
            email='alice_session@example.com',
            password='Password123!',
            display_name='Alice Session',
            published=True
        )
        self.bob = User.objects.create_user(
            username='bob_session',
            email='bob_session@example.com',
            password='Password123!',
            display_name='Bob Session',
            published=True
        )
        self.req = SwapRequest.objects.create(
            sender=self.alice,
            recipient=self.bob,
            sender_skill='English',
            recipient_skill='Python',
            intro_note='Looking forward to mutual peer skill exchange!',
            status='Accepted'
        )
        self.session = SwapSession.objects.create(
            swap_request=self.req,
            user_a=self.alice,
            user_b=self.bob,
            skill_taught_by_a='English',
            skill_taught_by_b='Python',
            status='Pending Confirmation'
        )

    def test_propose_and_confirm_schedule(self):
        # Alice proposes schedule
        self.client.force_authenticate(user=self.alice)
        url = reverse('session-propose-schedule', kwargs={'pk': self.session.id})
        proposal = {
            'sessionDate': str(date.today() + timedelta(days=3)),
            'sessionTime': '14:00:00',
            'durationMinutes': 45,
            'meetingUrl': 'https://meet.google.com/abc-defg-hij'
        }
        res = self.client.post(url, proposal, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.session.refresh_from_db()
        self.assertEqual(self.session.proposed_by, self.alice)

        # Alice cannot confirm her own proposal
        url_confirm = reverse('session-confirm-schedule', kwargs={'pk': self.session.id})
        res_self_confirm = self.client.post(url_confirm, {}, format='json')
        self.assertEqual(res_self_confirm.status_code, status.HTTP_400_BAD_REQUEST)

        # Bob (counterpart) confirms schedule
        self.client.force_authenticate(user=self.bob)
        res_confirm = self.client.post(url_confirm, {}, format='json')
        self.assertEqual(res_confirm.status_code, status.HTTP_200_OK)
        self.session.refresh_from_db()
        self.assertEqual(self.session.status, 'Scheduled')

    def test_cancellation_inside_two_hour_cutoff_blocked(self):
        # Schedule session 30 minutes from now
        now = timezone.now()
        upcoming_dt = now + timedelta(minutes=30)
        self.session.session_date = upcoming_dt.date()
        self.session.session_time = upcoming_dt.time()
        self.session.status = 'Scheduled'
        self.session.save()

        self.client.force_authenticate(user=self.alice)
        url = reverse('session-cancel', kwargs={'pk': self.session.id})
        res = self.client.post(url, {'reason': 'Cannot make it!'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.session.refresh_from_db()
        self.assertEqual(self.session.status, 'Scheduled')

    def test_cancellation_with_proper_notice_succeeds(self):
        # Schedule session 48 hours from now
        now = timezone.now()
        future_dt = now + timedelta(hours=48)
        self.session.session_date = future_dt.date()
        self.session.session_time = future_dt.time()
        self.session.status = 'Scheduled'
        self.session.save()

        self.client.force_authenticate(user=self.alice)
        url = reverse('session-cancel', kwargs={'pk': self.session.id})
        res = self.client.post(url, {'reason': 'Doctor appointment came up.'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.session.refresh_from_db()
        self.assertEqual(self.session.status, 'Cancelled')
        self.assertEqual(self.session.cancel_reason, 'Doctor appointment came up.')

    def test_post_session_feedback_and_rating_update(self):
        self.session.status = 'Scheduled'
        self.session.save()

        self.client.force_authenticate(user=self.alice)
        url = reverse('session-feedback', kwargs={'pk': self.session.id})
        feedback_data = {
            'sessionTookPlace': True,
            'punctualityRating': 5,
            'knowledgeSharingRating': 5,
            'overallRating': 5,
            'reviewText': 'Bob was a great tutor!'
        }
        res = self.client.post(url, feedback_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        self.session.refresh_from_db()
        self.assertEqual(self.session.status, 'Completed')

        # Verify Bob's stats updated
        self.bob.refresh_from_db()
        self.assertEqual(self.bob.total_completed_sessions, 1)
        self.assertEqual(float(self.bob.average_rating), 5.0)

    def test_export_ics_calendar(self):
        future_dt = date.today() + timedelta(days=2)
        self.session.session_date = future_dt
        self.session.session_time = time(14, 0)
        self.session.meeting_url = 'https://meet.google.com/test-room'
        self.session.save()

        self.client.force_authenticate(user=self.alice)
        url = reverse('session-export-ics', kwargs={'pk': self.session.id})
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('text/calendar', res['Content-Type'])
        self.assertIn('BEGIN:VCALENDAR', res.content.decode('utf-8'))
