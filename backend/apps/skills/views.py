from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Skill
from .serializers import SkillSerializer

class SkillListView(generics.ListCreateAPIView):
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Skill.objects.all().order_name() if hasattr(Skill.objects, 'order_name') else Skill.objects.all()
        query = self.request.query_params.get('search', '').strip()
        category = self.request.query_params.get('category', '').strip()
        if query:
            queryset = queryset.filter(Q(name__icontains=query) | Q(category__icontains=query))
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset


class SkillCategoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        categories = Skill.objects.values_list('category', flat=True).distinct()
        categories = sorted([c for c in set(categories) if c])
        return Response({'categories': categories})
