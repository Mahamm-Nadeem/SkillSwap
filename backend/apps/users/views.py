from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db.models import Q
from .models import User
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    DirectoryUserSerializer,
    ProfilePublishSerializer
)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'displayName': user.display_name,
                    'published': user.published,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'displayName': user.display_name,
                    'published': user.published,
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


class ProfilePublishView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ProfilePublishSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save_for_user(request.user)
            return Response({
                'success': True,
                'message': 'Profile published successfully.',
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data
        if 'displayName' in data:
            user.display_name = data['displayName']
        if 'headline' in data:
            user.headline = data['headline']
        if 'bio' in data:
            if len(data['bio']) > 300:
                return Response({'bio': 'Bio cannot exceed 300 characters.'}, status=status.HTTP_400_BAD_REQUEST)
            user.bio = data['bio']
        if 'timezone' in data:
            user.timezone = data['timezone']
        if 'avatarColor' in data:
            user.avatar_color = data['avatarColor']

        from apps.skills.models import Skill, UserSkill

        # Handle updating offered skills if provided
        if 'skillsOffered' in data:
            offered = data['skillsOffered']
            if user.published and (len(offered) < 1 or len(offered) > 5):
                return Response({'skillsOffered': 'Must contain between 1 and 5 skills.'}, status=status.HTTP_400_BAD_REQUEST)
            user.user_skills.filter(skill_type='offered').delete()
            for item in offered:
                s_name = item.get('name', '').strip()
                if s_name:
                    s_obj = Skill.objects.filter(name__iexact=s_name).first()
                    if not s_obj:
                        s_obj = Skill.objects.create(name=s_name, category=item.get('category', 'General'))
                    UserSkill.objects.create(
                        user=user,
                        skill=s_obj,
                        skill_type='offered',
                        level=item.get('level', 'Intermediate')
                    )

        # Handle updating requested skills if provided
        if 'skillsRequested' in data:
            requested = data['skillsRequested']
            if user.published and (len(requested) < 1 or len(requested) > 5):
                return Response({'skillsRequested': 'Must contain between 1 and 5 skills.'}, status=status.HTTP_400_BAD_REQUEST)
            user.user_skills.filter(skill_type='requested').delete()
            for item in requested:
                s_name = item.get('name', '').strip()
                if s_name:
                    s_obj = Skill.objects.filter(name__iexact=s_name).first()
                    if not s_obj:
                        s_obj = Skill.objects.create(name=s_name, category=item.get('category', 'General'))
                    UserSkill.objects.create(
                        user=user,
                        skill=s_obj,
                        skill_type='requested',
                        level=item.get('level', 'Intermediate')
                    )

        user.save()
        return Response(UserProfileSerializer(user).data)


class DirectoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = User.objects.filter(published=True).prefetch_related(
            'user_skills__skill'
        ).distinct()

        # Exclude currently authenticated user from directory search
        if request.user.is_authenticated:
            queryset = queryset.exclude(id=request.user.id)

        search_query = request.query_params.get('search', '').strip()
        offered_filter = request.query_params.get('offered', '').strip()
        requested_filter = request.query_params.get('requested', '').strip()
        level_filter = request.query_params.get('level', '').strip()

        if search_query:
            queryset = queryset.filter(
                Q(display_name__icontains=search_query) |
                Q(headline__icontains=search_query) |
                Q(bio__icontains=search_query) |
                Q(user_skills__skill__name__icontains=search_query)
            ).distinct()

        if offered_filter:
            queryset = queryset.filter(
                user_skills__skill__name__icontains=offered_filter,
                user_skills__skill_type='offered'
            ).distinct()

        if requested_filter:
            queryset = queryset.filter(
                user_skills__skill__name__icontains=requested_filter,
                user_skills__skill_type='requested'
            ).distinct()

        if level_filter:
            queryset = queryset.filter(
                user_skills__level__iexact=level_filter
            ).distinct()

        serializer = DirectoryUserSerializer(queryset, many=True)
        return Response({
            'count': len(serializer.data),
            'results': serializer.data
        })


class ProfileDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            target_user = User.objects.prefetch_related('user_skills__skill').get(pk=pk)
            serializer = DirectoryUserSerializer(target_user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
