from rest_framework import serializers
from .models import InAppNotification

class InAppNotificationSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='notification_type')
    timestamp = serializers.DateTimeField(source='created_at', format="%Y-%m-%dT%H:%M:%SZ")
    linkAction = serializers.SerializerMethodField()

    class Meta:
        model = InAppNotification
        fields = ['id', 'title', 'message', 'type', 'read', 'timestamp', 'linkAction']

    def get_linkAction(self, obj):
        if obj.target_type and obj.target_id:
            return {
                'type': obj.target_type,
                'targetId': obj.target_id
            }
        return None
