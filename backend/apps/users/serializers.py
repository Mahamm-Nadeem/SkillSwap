from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import User
from apps.skills.models import Skill, UserSkill
from apps.skills.serializers import UserSkillSerializer, SkillItemInputSerializer

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    displayName = serializers.CharField(source='display_name', required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'displayName']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        display_name = validated_data.pop('display_name', '')
        password = validated_data.pop('password')
        username = validated_data.get('username') or validated_data['email'].split('@')[0]
        
        # Ensure username uniqueness
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        user = User(
            username=username,
            email=validated_data['email'],
            display_name=display_name or username,
        )
        user.set_password(password)
        user.save()
        Token.objects.create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username_or_email = attrs.get('username')
        password = attrs.get('password')

        # Allow login via username or email
        user = None
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email__iexact=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            user = authenticate(username=username_or_email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email/username or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account has been disabled.")

        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    displayName = serializers.CharField(source='display_name')
    avatarColor = serializers.CharField(source='avatar_color')
    avatarInitials = serializers.CharField(source='avatar_initials')
    averageRating = serializers.FloatField(source='average_rating')
    totalCompletedSessions = serializers.IntegerField(source='total_completed_sessions')
    memberSince = serializers.DateTimeField(source='created_at', format="%b %Y")
    skillsOffered = serializers.SerializerMethodField()
    skillsRequested = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'displayName', 'headline', 'bio',
            'timezone', 'published', 'averageRating', 'totalCompletedSessions',
            'avatarColor', 'avatarInitials', 'memberSince',
            'skillsOffered', 'skillsRequested'
        ]

    def get_skillsOffered(self, obj):
        skills = obj.user_skills.filter(skill_type='offered').select_related('skill')
        return UserSkillSerializer(skills, many=True).data

    def get_skillsRequested(self, obj):
        skills = obj.user_skills.filter(skill_type='requested').select_related('skill')
        return UserSkillSerializer(skills, many=True).data


class DirectoryUserSerializer(serializers.ModelSerializer):
    """
    Public safe profile serializer for the explore directory.
    Hides direct contact information (email).
    """
    displayName = serializers.CharField(source='display_name')
    avatarColor = serializers.CharField(source='avatar_color')
    avatarInitials = serializers.CharField(source='avatar_initials')
    averageRating = serializers.FloatField(source='average_rating')
    totalCompletedSessions = serializers.IntegerField(source='total_completed_sessions')
    skillsOffered = serializers.SerializerMethodField()
    skillsRequested = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'displayName', 'headline', 'bio', 'timezone',
            'averageRating', 'totalCompletedSessions', 'avatarColor',
            'avatarInitials', 'skillsOffered', 'skillsRequested'
        ]

    def get_skillsOffered(self, obj):
        skills = obj.user_skills.filter(skill_type='offered').select_related('skill')
        return UserSkillSerializer(skills, many=True).data

    def get_skillsRequested(self, obj):
        skills = obj.user_skills.filter(skill_type='requested').select_related('skill')
        return UserSkillSerializer(skills, many=True).data


class ProfilePublishSerializer(serializers.Serializer):
    displayName = serializers.CharField(max_length=100, required=False)
    headline = serializers.CharField(max_length=120, required=False, allow_blank=True)
    bio = serializers.CharField(max_length=300, required=False, allow_blank=True)
    timezone = serializers.CharField(max_length=64, default="UTC")
    skillsOffered = SkillItemInputSerializer(many=True)
    skillsRequested = SkillItemInputSerializer(many=True)

    def validate_bio(self, value):
        if len(value) > 300:
            raise serializers.ValidationError("Bio cannot exceed 300 characters.")
        return value

    def validate(self, attrs):
        offered = attrs.get('skillsOffered', [])
        requested = attrs.get('skillsRequested', [])

        if len(offered) < 1 or len(offered) > 5:
            raise serializers.ValidationError(
                {"skillsOffered": "You must provide between 1 and 5 skills offered."}
            )
        if len(requested) < 1 or len(requested) > 5:
            raise serializers.ValidationError(
                {"skillsRequested": "You must provide between 1 and 5 skills requested."}
            )
        return attrs

    def save_for_user(self, user):
        data = self.validated_data
        if 'displayName' in data and data['displayName']:
            user.display_name = data['displayName']
        if 'headline' in data:
            user.headline = data['headline']
        if 'bio' in data:
            user.bio = data['bio']
        if 'timezone' in data:
            user.timezone = data['timezone']

        user.published = True
        user.save()

        # Update offered skills
        user.user_skills.filter(skill_type='offered').delete()
        for item in data['skillsOffered']:
            skill_name = item['name'].strip()
            skill_obj = Skill.objects.filter(name__iexact=skill_name).first()
            if not skill_obj:
                skill_obj = Skill.objects.create(name=skill_name, category=item.get('category', 'General'))
            UserSkill.objects.create(
                user=user,
                skill=skill_obj,
                skill_type='offered',
                level=item.get('level', 'Intermediate')
            )

        # Update requested skills
        user.user_skills.filter(skill_type='requested').delete()
        for item in data['skillsRequested']:
            skill_name = item['name'].strip()
            skill_obj = Skill.objects.filter(name__iexact=skill_name).first()
            if not skill_obj:
                skill_obj = Skill.objects.create(name=skill_name, category=item.get('category', 'General'))
            UserSkill.objects.create(
                user=user,
                skill=skill_obj,
                skill_type='requested',
                level=item.get('level', 'Intermediate')
            )

        return user
