from django.http import HttpResponse
from django.utils import timezone
from django.db.models import Q
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import SwapSession, SessionFeedback
from .serializers import (
    SwapSessionSerializer,
    ProposeScheduleSerializer,
    CancelSessionSerializer,
    SessionFeedbackSubmitSerializer
)
from .ics_utils import generate_ics_content
from apps.notifications.models import InAppNotification

class SessionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        qs = SwapSession.objects.filter(
            Q(user_a=user) | Q(user_b=user)
        ).select_related('user_a', 'user_b', 'swap_request', 'proposed_by').prefetch_related('feedbacks__user')

        status_filter = request.query_params.get('status', '').strip().lower()
        if status_filter == 'scheduled':
            qs = qs.filter(status__in=['Pending Confirmation', 'Scheduled'])
        elif status_filter == 'past':
            qs = qs.filter(status__in=['Completed', 'No-Show Reported', 'Cancelled'])

        serializer = SwapSessionSerializer(qs, many=True)
        return Response(serializer.data)


class SessionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            session = SwapSession.objects.select_related(
                'user_a', 'user_b', 'swap_request', 'proposed_by'
            ).prefetch_related('feedbacks__user').get(pk=pk)
        except SwapSession.DoesNotExist:
            return Response({'error': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not session.is_participant(request.user):
            return Response({'error': 'You do not have permission to view this session.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = SwapSessionSerializer(session)
        return Response(serializer.data)


class ProposeScheduleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            session = SwapSession.objects.select_related('user_a', 'user_b').get(pk=pk)
        except SwapSession.DoesNotExist:
            return Response({'error': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not session.is_participant(request.user):
            return Response({'error': 'Only participants can propose meeting times.'}, status=status.HTTP_403_FORBIDDEN)

        if session.status in ['Completed', 'Cancelled']:
            return Response({'error': f'Cannot reschedule a {session.status.lower()} session.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ProposeScheduleSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            session.session_date = data['sessionDate']
            session.session_time = data['sessionTime']
            session.duration_minutes = data['durationMinutes']
            session.meeting_url = data['meetingUrl']
            session.status = 'Pending Confirmation'
            session.proposed_by = request.user
            session.proposed_at = timezone.now()
            session.save()

            partner = session.get_partner(request.user)
            InAppNotification.objects.create(
                user=partner,
                title="Session Time Proposed",
                message=f"{request.user.display_name} proposed a meeting on {session.session_date} at {session.session_time}.",
                notification_type="schedule",
                target_type="session",
                target_id=str(session.id)
            )

            return Response(SwapSessionSerializer(session).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ConfirmScheduleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            session = SwapSession.objects.select_related('user_a', 'user_b', 'proposed_by').get(pk=pk)
        except SwapSession.DoesNotExist:
            return Response({'error': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not session.is_participant(request.user):
            return Response({'error': 'Only participants can confirm sessions.'}, status=status.HTTP_403_FORBIDDEN)

        if session.status != 'Pending Confirmation':
            return Response({'error': 'Session is not pending confirmation.'}, status=status.HTTP_400_BAD_REQUEST)

        if session.proposed_by == request.user:
            return Response({'error': 'You cannot confirm your own proposed time. Waiting for peer.'}, status=status.HTTP_400_BAD_REQUEST)

        session.status = 'Scheduled'
        session.save()

        partner = session.get_partner(request.user)
        InAppNotification.objects.create(
            user=partner,
            title="Session Schedule Confirmed!",
            message=f"{request.user.display_name} confirmed the meeting for {session.session_date} at {session.session_time}.",
            notification_type="schedule",
            target_type="session",
            target_id=str(session.id)
        )

        return Response(SwapSessionSerializer(session).data, status=status.HTTP_200_OK)


class CancelSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            session = SwapSession.objects.select_related('user_a', 'user_b').get(pk=pk)
        except SwapSession.DoesNotExist:
            return Response({'error': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not session.is_participant(request.user):
            return Response({'error': 'Only session participants can cancel.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = CancelSessionSerializer(data=request.data, context={'session': session})
        if serializer.is_valid():
            reason = serializer.validated_data['reason']
            session.status = 'Cancelled'
            session.cancel_reason = reason
            session.cancelled_at = timezone.now()
            session.cancelled_by = request.user
            session.save()

            partner = session.get_partner(request.user)
            InAppNotification.objects.create(
                user=partner,
                title="Session Cancelled",
                message=f"{request.user.display_name} cancelled the scheduled session. Reason: {reason}",
                notification_type="cancelled",
                target_type="session",
                target_id=str(session.id)
            )

            return Response(SwapSessionSerializer(session).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubmitFeedbackView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            session = SwapSession.objects.select_related('user_a', 'user_b').get(pk=pk)
        except SwapSession.DoesNotExist:
            return Response({'error': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not session.is_participant(request.user):
            return Response({'error': 'Only session participants can submit feedback.'}, status=status.HTTP_403_FORBIDDEN)

        # Check if already submitted
        if SessionFeedback.objects.filter(session=session, user=request.user).exists():
            return Response({'error': 'You have already submitted feedback for this session.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SessionFeedbackSubmitSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            partner = session.get_partner(request.user)

            feedback = SessionFeedback.objects.create(
                session=session,
                user=request.user,
                partner=partner,
                session_took_place=data['sessionTookPlace'],
                punctuality_rating=data.get('punctualityRating'),
                knowledge_sharing_rating=data.get('knowledgeSharingRating'),
                overall_rating=data.get('overallRating'),
                review_text=data.get('reviewText', ''),
                no_show_details=data.get('noShowDetails', '')
            )

            # Update session status
            if not data['sessionTookPlace']:
                session.status = 'No-Show Reported'
                session.save()
            else:
                session.status = 'Completed'
                session.save()

            # Recalculate peer's ratings and completed sessions count
            partner.update_rating_stats()

            # Notify partner
            InAppNotification.objects.create(
                user=partner,
                title="Post-Session Feedback Received",
                message=f"{request.user.display_name} submitted feedback for your swap session.",
                notification_type="feedback",
                target_type="session",
                target_id=str(session.id)
            )

            return Response({
                'success': True,
                'message': 'Feedback recorded successfully.',
                'session': SwapSessionSerializer(session).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExportCalendarIcsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            session = SwapSession.objects.select_related('user_a', 'user_b').get(pk=pk)
        except SwapSession.DoesNotExist:
            return Response({'error': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not session.is_participant(request.user):
            return Response({'error': 'You do not have permission to export this session.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            ics_data = generate_ics_content(session)
            response = HttpResponse(ics_data, content_type='text/calendar; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="skillswap-session-{session.id}.ics"'
            return response
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
