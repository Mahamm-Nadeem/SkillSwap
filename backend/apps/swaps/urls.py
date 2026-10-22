from django.urls import path
from .views import (
    SwapRequestListCreateView,
    SwapRequestDetailView,
    SwapRequestAcceptView,
    SwapRequestDeclineView
)

urlpatterns = [
    path('requests', SwapRequestListCreateView.as_view(), name='swap-requests-list-create'),
    path('requests/', SwapRequestListCreateView.as_view(), name='swap-requests-list-create-slash'),
    path('requests/<int:pk>', SwapRequestDetailView.as_view(), name='swap-request-detail'),
    path('requests/<int:pk>/', SwapRequestDetailView.as_view(), name='swap-request-detail-slash'),
    path('requests/<int:pk>/accept', SwapRequestAcceptView.as_view(), name='swap-request-accept'),
    path('requests/<int:pk>/accept/', SwapRequestAcceptView.as_view(), name='swap-request-accept-slash'),
    path('requests/<int:pk>/decline', SwapRequestDeclineView.as_view(), name='swap-request-decline'),
    path('requests/<int:pk>/decline/', SwapRequestDeclineView.as_view(), name='swap-request-decline-slash'),
]
