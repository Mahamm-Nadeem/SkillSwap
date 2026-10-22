from django.db import models
from django.conf import settings
from apps.swaps.models import SwapRequest

class SwapSession(models.Model):
    STATUS_CHOICES = [
        ('Pending Confirmation', 'Pending Confirmation'),
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('No-Show Reported', 'No-Show Reported'),
        ('Cancelled', 'Cancelled'),
    ]

    DURATION_CHOICES = [
        (30, '30 Minutes'),
        (45, '45 Minutes'),
        (60, '60 Minutes'),
    ]

    swap_request = models.OneToOneField(
        SwapRequest,
        on_delete=models.CASCADE,
        related_name='session'
    )
    user_a = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sessions_as_a'
    )
    user_b = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sessions_as_b'
    )
    skill_taught_by_a = models.CharField(max_length=80)
    skill_taught_by_b = models.CharField(max_length=80)
    session_date = models.DateField(null=True, blank=True)
    session_time = models.TimeField(null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(choices=DURATION_CHOICES, default=45)
    meeting_url = models.URLField(max_length=500, blank=True, default="")
    status = models.CharField(max_length=24, choices=STATUS_CHOICES, default='Pending Confirmation')
    proposed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='proposed_sessions'
    )
    proposed_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.CharField(max_length=300, blank=True, null=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancelled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cancelled_sessions'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-session_date', '-session_time', '-created_at']

    def is_participant(self, user):
        return user == self.user_a or user == self.user_b

    def get_partner(self, user):
        if user == self.user_a:
            return self.user_b
        elif user == self.user_b:
            return self.user_a
        return None

    def __str__(self):
        return f"Session #{self.id}: {self.user_a.display_name} & {self.user_b.display_name} ({self.status})"


class SessionFeedback(models.Model):
    session = models.ForeignKey(
        SwapSession,
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submitted_feedbacks'
    )
    partner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_feedbacks'
    )
    session_took_place = models.BooleanField(default=True)
    punctuality_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    knowledge_sharing_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    overall_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    review_text = models.CharField(max_length=400, blank=True, default="")
    no_show_details = models.CharField(max_length=500, blank=True, default="")
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('session', 'user')
        ordering = ['-submitted_at']

    def __str__(self):
        return f"Feedback #{self.id} by {self.user.display_name} for Session #{self.session.id}"
