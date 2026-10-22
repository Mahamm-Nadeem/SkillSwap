from django.db import models
from django.conf import settings

class InAppNotification(models.Model):
    TYPE_CHOICES = [
        ('request', 'Request'),
        ('acceptance', 'Acceptance'),
        ('schedule', 'Schedule'),
        ('feedback', 'Feedback'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=120)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='request')
    read = models.BooleanField(default=False)
    target_type = models.CharField(max_length=20, blank=True, default="")
    target_id = models.CharField(max_length=40, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.display_name}: {self.title}"
