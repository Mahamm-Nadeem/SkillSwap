from django.urls import path
from .views import RegisterView, LoginView, MeView

urlpatterns = [
    path('register', RegisterView.as_view(), name='auth-register'),
    path('register/', RegisterView.as_view(), name='auth-register-slash'),
    path('login', LoginView.as_view(), name='auth-login'),
    path('login/', LoginView.as_view(), name='auth-login-slash'),
    path('me', MeView.as_view(), name='auth-me'),
    path('me/', MeView.as_view(), name='auth-me-slash'),
]
