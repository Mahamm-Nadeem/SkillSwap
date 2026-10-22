from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import SwapRequest
from .serializers import (
    SwapRequestCreateSerializer,
    SwapRequestReadSerializer,
    SwapRequestDeclineSerializer
)
from apps.notifications.models import InAppNotification

class SwapRequestListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        tab = request.query_params.get('tab', '').strip().lower()

        if tab == 'incoming':
            qs = SwapRequest.objects.filter(recipient=user)
        elif tab == 'outgoing':
            qs = SwapRequest.objects.filter(sender=user)
        else:
            qs = SwapRequest.objects.filter(Q(sender=user) | Q(recipient=user))

        serializer = SwapRequestReadSerializer(qs.select_related('sender', 'recipient', 'session'), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SwapRequestCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            swap_request = serializer.save()

            # Create notification for recipient
            InAppNotification.objects.create(
                user=swap_request.recipient,
                title="New Swap Proposal",
                message=f"{request.user.display_name} proposed a skill exchange ({swap_request.sender_skill} for {swap_request.recipient_skill}).",
                notification_type="request",
                target_type="request",
                target_id=str(swap_request.id)
            )

            read_serializer = SwapRequestReadSerializer(swap_request)
            return Response(read_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SwapRequestDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            swap_request = SwapRequest.objects.select_related('sender', 'recipient', 'session').get(pk=pk)
        except SwapRequest.DoesNotExist:
            return Response({'error': 'Swap request not found.'}, status=status.HTTP_404_NOT_FOUND)

        if swap_request.sender != request.user and swap_request.recipient != request.user:
            return Response({'error': 'You do not have permission to view this request.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = SwapRequestReadSerializer(swap_request)
        return Response(serializer.data)


class SwapRequestAcceptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            swap_request = SwapRequest.objects.select_related('sender', 'recipient').get(pk=pk)
        except SwapRequest.DoesNotExist:
            return Response({'error': 'Swap request not found.'}, status=status.HTTP_404_NOT_FOUND)

        if swap_request.recipient != request.user:
            return Response({'error': 'Only the recipient can accept this swap request.'}, status=status.HTTP_403_FORBIDDEN)

        if swap_request.status != 'Pending':
            return Response({'error': f'Request cannot be accepted because it is already {swap_request.status}.'}, status=status.HTTP_400_BAD_REQUEST)

        swap_request.status = 'Accepted'
        swap_request.save()

        # Automatically create or get corresponding SwapSession
        from apps.sessions_app.models import SwapSession
        session, created = SwapSession.objects.get_or_create(
            swap_request=swap_request,
            defaults={
                'user_a': swap_request.sender,
                'user_b': swap_request.recipient,
                'skill_taught_by_a': swap_request.sender_skill,
                'skill_taught_by_b': swap_request.recipient_skill,
                'status': 'Pending Confirmation',
            }
        )

        # Create in-app notification for the sender
        InAppNotification.objects.create(
            user=swap_request.sender,
            title="Swap Request Accepted!",
            message=f"{request.user.display_name} accepted your swap request! You can now propose a meeting time.",
            notification_type="acceptance",
            target_type="session",
            target_id=str(session.id)
        )

        return Response({
            'id': swap_request.id,
            'status': swap_request.status,
            'sessionId': session.id,
            'message': 'Swap request accepted successfully.'
        }, status=status.HTTP_200_OK)


class SwapRequestDeclineView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            swap_request = SwapRequest.objects.select_related('sender', 'recipient').get(pk=pk)
        except SwapRequest.DoesNotExist:
            return Response({'error': 'Swap request not found.'}, status=status.HTTP_404_NOT_FOUND)

        if swap_request.recipient != request.user:
            return Response({'error': 'Only the recipient can decline this swap request.'}, status=status.HTTP_403_FORBIDDEN)

        if swap_request.status != 'Pending':
            return Response({'error': f'Request cannot be declined because it is already {swap_request.status}.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SwapRequestDeclineSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reason = serializer.validated_data.get('reason', '')

        swap_request.status = 'Declined'
        swap_request.decline_reason = reason
        swap_request.save()

        # Notify sender
        msg = f"{request.user.display_name} declined your swap proposal."
        if reason:
            msg += f" Reason: {reason}"

        InAppNotification.objects.create(
            user=swap_request.sender,
            title="Swap Proposal Declined",
            message=msg,
            notification_type="request",
            target_type="request",
            target_id=str(swap_request.id)
        )

        return Response({
            'id': swap_request.id,
            'status': swap_request.status,
            'declineReason': swap_request.decline_reason
        }, status=status.HTTP_200_OK)
