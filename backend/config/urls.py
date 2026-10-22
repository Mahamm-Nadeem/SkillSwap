"""
Root URL Configuration for SkillSwap Backend.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for monitoring."""
    return Response({
        'status': 'healthy',
        'service': 'SkillSwap API',
        'version': '1.0.0'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),
    
    # API v1 endpoints
    path('api/v1/auth/', include('apps.users.urls_auth')),
    path('api/v1/profiles/', include('apps.users.urls_profiles')),
    path('api/v1/skills/', include('apps.skills.urls')),
    path('api/v1/swaps/', include('apps.swaps.urls')),
    path('api/v1/sessions/', include('apps.sessions_app.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
]
