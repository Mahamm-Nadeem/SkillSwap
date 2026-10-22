from django.db import models
from django.conf import settings

class Skill(models.Model):
    """
    Catalog of distinct exchangeable topics/skills.
    """
    name = models.CharField(max_length=80, unique=True, db_index=True)
    category = models.CharField(max_length=60, default="General", db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.category})"


class UserSkill(models.Model):
    """
    Associates a user with an offered or requested skill and a proficiency level.
    """
    SKILL_TYPE_CHOICES = [
        ('offered', 'Offered'),
        ('requested', 'Requested'),
    ]

    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_skills'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='user_associations'
    )
    skill_type = models.CharField(max_length=16, choices=SKILL_TYPE_CHOICES)
    level = models.CharField(max_length=16, choices=LEVEL_CHOICES, default='Intermediate')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'skill', 'skill_type')
        indexes = [
            models.Index(fields=['user', 'skill_type']),
        ]

    def __str__(self):
        return f"{self.user.display_name} - {self.skill.name} ({self.skill_type}, {self.level})"
