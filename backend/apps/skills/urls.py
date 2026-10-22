from django.urls import path
from .views import SkillListView, SkillCategoryListView

urlpatterns = [
    path('', SkillListView.as_view(), name='skill-list'),
    path('categories/', SkillCategoryListView.as_view(), name='skill-categories'),
]
