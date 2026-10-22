from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Avg

class User(AbstractUser):
    """
    Custom user model for SkillSwap peer exchange platform.
    """
    email = models.EmailField(unique=True, verbose_name="Email address")
    display_name = models.CharField(max_length=100, verbose_name="Display Name")
    headline = models.CharField(max_length=120, blank=True, default="", verbose_name="Headline")
    bio = models.CharField(max_length=300, blank=True, default="", verbose_name="Bio (max 300 chars)")
    timezone = models.CharField(max_length=64, default="UTC", verbose_name="Timezone")
    published = models.BooleanField(default=False, verbose_name="Profile Published")
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00, verbose_name="Average Rating")
    total_completed_sessions = models.PositiveIntegerField(default=0, verbose_name="Completed Sessions")
    avatar_color = models.CharField(max_length=32, default="emerald", verbose_name="Avatar Color")
    avatar_initials = models.CharField(max_length=4, blank=True, default="", verbose_name="Avatar Initials")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.display_name:
            self.display_name = self.username
        if not self.avatar_initials and self.display_name:
            parts = self.display_name.strip().split()
            if len(parts) >= 2:
                self.avatar_initials = (parts[0][0] + parts[-1][0]).upper()
            elif len(parts) == 1 and len(parts[0]) > 0:
                self.avatar_initials = parts[0][:2].upper()
        super().save(*args, **kwargs)

    def update_rating_stats(self):
        """
        Recalculates aggregate average rating and total completed sessions
        based on received feedback where partner=self.
        """
        from apps.sessions_app.models import SessionFeedback
        valid_feedbacks = SessionFeedback.objects.filter(
            partner=self,
            session_took_place=True,
            overall_rating__isnull=False
        )
        avg = valid_feedbacks.aggregate(avg_score=Avg('overall_rating'))['avg_score']
        self.average_rating = round(avg, 2) if avg is not None else 0.00
        self.total_completed_sessions = valid_feedbacks.count()
        self.save(update_fields=['average_rating', 'total_completed_sessions', 'updated_at'])

    def __str__(self):
        return f"{self.display_name} ({self.email})"
