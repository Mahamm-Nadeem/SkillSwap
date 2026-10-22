from rest_framework import serializers
from .models import SwapRequest
from apps.users.models import User

class SwapRequestCreateSerializer(serializers.Serializer):
    recipientId = serializers.IntegerField(required=True)
    senderSkill = serializers.CharField(max_length=80, required=True)
    recipientSkill = serializers.CharField(max_length=80, required=True)
    introNote = serializers.CharField(min_length=20, max_length=500, required=True)

    def validate_introNote(self, value):
        stripped = value.strip()
        if len(stripped) < 20 or len(stripped) > 500:
            raise serializers.ValidationError("Introductory note must be between 20 and 500 characters.")
        return stripped

    def validate(self, attrs):
        request = self.context.get('request')
        sender = request.user if request else None
        recipient_id = attrs.get('recipientId')

        if sender and sender.id == recipient_id:
            raise serializers.ValidationError("You cannot send a swap request to yourself.")

        try:
            recipient = User.objects.get(id=recipient_id)
            attrs['recipient_obj'] = recipient
        except User.DoesNotExist:
            raise serializers.ValidationError({"recipientId": "Recipient user not found."})

        return attrs

    def create(self, validated_data):
        sender = self.context['request'].user
        recipient = validated_data['recipient_obj']
        swap_request = SwapRequest.objects.create(
            sender=sender,
            recipient=recipient,
            sender_skill=validated_data['senderSkill'],
            recipient_skill=validated_data['recipientSkill'],
            intro_note=validated_data['introNote'],
            status='Pending'
        )
        return swap_request


class SwapRequestReadSerializer(serializers.ModelSerializer):
    senderId = serializers.IntegerField(source='sender.id', read_only=True)
    recipientId = serializers.IntegerField(source='recipient.id', read_only=True)
    senderName = serializers.CharField(source='sender.display_name', read_only=True)
    recipientName = serializers.CharField(source='recipient.display_name', read_only=True)
    senderSkill = serializers.CharField(source='sender_skill')
    recipientSkill = serializers.CharField(source='recipient_skill')
    introNote = serializers.CharField(source='intro_note')
    declineReason = serializers.CharField(source='decline_reason', allow_null=True)
    createdAt = serializers.DateTimeField(source='created_at', format="%Y-%m-%dT%H:%M:%SZ")
    sessionId = serializers.SerializerMethodField()

    class Meta:
        model = SwapRequest
        fields = [
            'id', 'senderId', 'recipientId', 'senderName', 'recipientName',
            'senderSkill', 'recipientSkill', 'introNote', 'status',
            'declineReason', 'createdAt', 'sessionId'
        ]

    def get_sessionId(self, obj):
        if hasattr(obj, 'session'):
            return obj.session.id
        return None


class SwapRequestDeclineSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=300, required=False, allow_blank=True, default="")
