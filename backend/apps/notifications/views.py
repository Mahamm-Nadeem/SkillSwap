from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import InAppNotification
from .serializers import InAppNotificationSerializer

class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = InAppNotification.objects.filter(user=request.user)
        serializer = InAppNotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            notif = InAppNotification.objects.get(pk=pk, user=request.user)
            notif.read = True
            notif.save()
            return Response({'success': True, 'id': notif.id})
        except InAppNotification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)


class MarkAllNotificationsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        InAppNotification.objects.filter(user=request.user, read=False).update(read=True)
        return Response({'success': True, 'message': 'All notifications marked as read.'})
