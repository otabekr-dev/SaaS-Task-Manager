from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    confirm = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'password', 'confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm']:
            raise serializers.ValidationError(detail='Passwords do not match')
        
        if len(attrs['password']) < 8:
            raise serializers.ValidationError(detail='Password should have at least 8 characters')
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    ...