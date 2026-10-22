from django.urls import path
from .views import (
    SessionListView,
    SessionDetailView,
    ProposeScheduleView,
    ConfirmScheduleView,
    CancelSessionView,
    SubmitFeedbackView,
    ExportCalendarIcsView
)

urlpatterns = [
    path('', SessionListView.as_view(), name='session-list'),
    path('<int:pk>', SessionDetailView.as_view(), name='session-detail'),
    path('<int:pk>/', SessionDetailView.as_view(), name='session-detail-slash'),
    path('<int:pk>/propose-schedule', ProposeScheduleView.as_view(), name='session-propose-schedule'),
    path('<int:pk>/propose-schedule/', ProposeScheduleView.as_view(), name='session-propose-schedule-slash'),
    path('<int:pk>/confirm-schedule', ConfirmScheduleView.as_view(), name='session-confirm-schedule'),
    path('<int:pk>/confirm-schedule/', ConfirmScheduleView.as_view(), name='session-confirm-schedule-slash'),
    path('<int:pk>/cancel', CancelSessionView.as_view(), name='session-cancel'),
    path('<int:pk>/cancel/', CancelSessionView.as_view(), name='session-cancel-slash'),
    path('<int:pk>/feedback', SubmitFeedbackView.as_view(), name='session-feedback'),
    path('<int:pk>/feedback/', SubmitFeedbackView.as_view(), name='session-feedback-slash'),
    path('<int:pk>/export-ics', ExportCalendarIcsView.as_view(), name='session-export-ics'),
    path('<int:pk>/export-ics/', ExportCalendarIcsView.as_view(), name='session-export-ics-slash'),
]
