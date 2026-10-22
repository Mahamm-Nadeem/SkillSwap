from rest_framework import serializers
from .models import Skill, UserSkill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category']


class UserSkillSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='skill.name', read_only=True)
    category = serializers.CharField(source='skill.category', read_only=True)

    class Meta:
        model = UserSkill
        fields = ['id', 'name', 'level', 'category', 'skill_type']


class SkillItemInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=80)
    level = serializers.ChoiceField(choices=['Beginner', 'Intermediate', 'Advanced'], default='Intermediate')
    category = serializers.CharField(max_length=60, required=False, default='General')
