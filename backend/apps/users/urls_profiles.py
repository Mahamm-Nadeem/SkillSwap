from django.urls import path
from .views import ProfilePublishView, ProfileUpdateView, DirectoryListView, ProfileDetailView

urlpatterns = [
    path('publish', ProfilePublishView.as_view(), name='profile-publish'),
    path('publish/', ProfilePublishView.as_view(), name='profile-publish-slash'),
    path('me', ProfileUpdateView.as_view(), name='profile-me'),
    path('me/', ProfileUpdateView.as_view(), name='profile-me-slash'),
    path('directory', DirectoryListView.as_view(), name='profile-directory'),
    path('directory/', DirectoryListView.as_view(), name='profile-directory-slash'),
    path('<int:pk>', ProfileDetailView.as_view(), name='profile-detail'),
    path('<int:pk>/', ProfileDetailView.as_view(), name='profile-detail-slash'),
]
