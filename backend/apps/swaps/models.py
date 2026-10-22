from django.db import models
from django.conf import settings

class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Declined', 'Declined'),
    ]

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_swap_requests'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_swap_requests'
    )
    sender_skill = models.CharField(max_length=80, verbose_name="Sender Offered Skill")
    recipient_skill = models.CharField(max_length=80, verbose_name="Recipient Offered Skill")
    intro_note = models.CharField(max_length=500, verbose_name="Introductory Note (20-500 chars)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    decline_reason = models.CharField(max_length=300, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Swap #{self.id}: {self.sender.display_name} -> {self.recipient.display_name} ({self.status})"
