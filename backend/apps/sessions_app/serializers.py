from rest_framework import serializers
from datetime import datetime, date, time, timedelta
from django.utils import timezone
from .models import SwapSession, SessionFeedback

class SessionFeedbackReadSerializer(serializers.ModelSerializer):
    userId = serializers.IntegerField(source='user.id', read_only=True)
    userName = serializers.CharField(source='user.display_name', read_only=True)
    sessionTookPlace = serializers.BooleanField(source='session_took_place')
    punctualityRating = serializers.IntegerField(source='punctuality_rating', allow_null=True)
    knowledgeSharingRating = serializers.IntegerField(source='knowledge_sharing_rating', allow_null=True)
    overallRating = serializers.IntegerField(source='overall_rating', allow_null=True)
    reviewText = serializers.CharField(source='review_text', allow_blank=True)
    noShowDetails = serializers.CharField(source='no_show_details', allow_blank=True)
    submittedAt = serializers.DateTimeField(source='submitted_at', format="%Y-%m-%dT%H:%M:%SZ")

    class Meta:
        model = SessionFeedback
        fields = [
            'id', 'userId', 'userName', 'sessionTookPlace',
            'punctualityRating', 'knowledgeSharingRating', 'overallRating',
            'reviewText', 'noShowDetails', 'submittedAt'
        ]


class SwapSessionSerializer(serializers.ModelSerializer):
    swapRequestId = serializers.IntegerField(source='swap_request.id', read_only=True)
    userA = serializers.SerializerMethodField()
    userB = serializers.SerializerMethodField()
    skillTaughtByA = serializers.CharField(source='skill_taught_by_a')
    skillTaughtByB = serializers.CharField(source='skill_taught_by_b')
    sessionDate = serializers.DateField(source='session_date', allow_null=True)
    sessionTime = serializers.TimeField(source='session_time', allow_null=True)
    durationMinutes = serializers.IntegerField(source='duration_minutes')
    meetingUrl = serializers.CharField(source='meeting_url', allow_blank=True)
    proposedById = serializers.IntegerField(source='proposed_by.id', read_only=True, allow_null=True)
    proposedByName = serializers.CharField(source='proposed_by.display_name', read_only=True, allow_null=True)
    proposedAt = serializers.DateTimeField(source='proposed_at', format="%Y-%m-%dT%H:%M:%SZ", allow_null=True)
    cancelReason = serializers.CharField(source='cancel_reason', allow_null=True)
    feedbacks = serializers.SerializerMethodField()

    class Meta:
        model = SwapSession
        fields = [
            'id', 'swapRequestId', 'userA', 'userB',
            'skillTaughtByA', 'skillTaughtByB',
            'sessionDate', 'sessionTime', 'durationMinutes', 'meetingUrl',
            'status', 'proposedById', 'proposedByName', 'proposedAt',
            'cancelReason', 'feedbacks'
        ]

    def get_userA(self, obj):
        return {
            'id': obj.user_a.id,
            'displayName': obj.user_a.display_name,
            'timezone': obj.user_a.timezone,
            'avatarColor': obj.user_a.avatar_color,
            'avatarInitials': obj.user_a.avatar_initials,
        }

    def get_userB(self, obj):
        return {
            'id': obj.user_b.id,
            'displayName': obj.user_b.display_name,
            'timezone': obj.user_b.timezone,
            'avatarColor': obj.user_b.avatar_color,
            'avatarInitials': obj.user_b.avatar_initials,
        }

    def get_feedbacks(self, obj):
        feedbacks = obj.feedbacks.all()
        # Return map of userId -> feedback object to match frontend expectations
        result = {}
        for fb in feedbacks:
            result[str(fb.user.id)] = SessionFeedbackReadSerializer(fb).data
        return result


class ProposeScheduleSerializer(serializers.Serializer):
    sessionDate = serializers.DateField(required=True)
    sessionTime = serializers.TimeField(required=True)
    durationMinutes = serializers.ChoiceField(choices=[30, 45, 60], default=45)
    meetingUrl = serializers.URLField(required=True)

    def validate_meetingUrl(self, value):
        val = value.strip()
        if not val.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Please provide a valid meeting URL (e.g., https://meet.google.com/xyz).")
        return val


class CancelSessionSerializer(serializers.Serializer):
    reason = serializers.CharField(min_length=3, max_length=300, required=True)

    def validate(self, attrs):
        session = self.context.get('session')
        if not session:
            return attrs

        if session.status in ['Cancelled', 'Completed', 'No-Show Reported']:
            raise serializers.ValidationError(f"A {session.status.lower()} session cannot be cancelled.")

        # Enforce 2-hour cutoff rule if session date and time are set
        if session.session_date and session.session_time:
            now = timezone.now()
            session_naive = datetime.combine(session.session_date, session.session_time)
            session_aware = timezone.make_aware(session_naive, timezone.get_current_timezone())
            time_until_session = session_aware - now
            if time_until_session < timedelta(hours=2):
                raise serializers.ValidationError(
                    "Sessions cannot be cancelled less than 2 hours before the scheduled start time."
                )

        return attrs


class SessionFeedbackSubmitSerializer(serializers.Serializer):
    sessionTookPlace = serializers.BooleanField(default=True)
    punctualityRating = serializers.IntegerField(min_value=1, max_value=5, required=False, allow_null=True)
    knowledgeSharingRating = serializers.IntegerField(min_value=1, max_value=5, required=False, allow_null=True)
    overallRating = serializers.IntegerField(min_value=1, max_value=5, required=False, allow_null=True)
    reviewText = serializers.CharField(max_length=400, required=False, allow_blank=True, default="")
    noShowDetails = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")

    def validate(self, attrs):
        took_place = attrs.get('sessionTookPlace', True)
        if took_place:
            for rating_field in ['punctualityRating', 'knowledgeSharingRating', 'overallRating']:
                val = attrs.get(rating_field)
                if val is None or val < 1 or val > 5:
                    raise serializers.ValidationError(
                        {rating_field: "Rating must be an integer between 1 and 5 when session took place."}
                    )
        else:
            if not attrs.get('noShowDetails'):
                raise serializers.ValidationError(
                    {"noShowDetails": "Please provide details regarding the reported no-show."}
                )
        return attrs
