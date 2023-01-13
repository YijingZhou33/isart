from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()

"""
    Sign up (POST) 
"""
class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'username': {
                'validators': [
                    UniqueValidator(
                        queryset = User.objects.all(),
                        message = 'An account with this username already exists.'
                    )     
                ]                
            },
            'email': {
                'validators': [
                    UniqueValidator(
                        queryset = User.objects.all(),
                        message = 'An account with this email address already exists.'
                    )     
                ]
            }
        }
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


"""
    Reset password (PATCH) 
"""   
class UserResetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True,}}
        
    def validate(self, attrs):
        user = User.objects.get(username=attrs.get('username'))
        if user.check_password(attrs.get('password')):
            raise serializers.ValidationError('New password cannot be the same as current one.') 
        return attrs
        
    def update(self, instance, validated_data):
        instance.set_password(validated_data.get('password'))
        instance.save()
        return instance
    
"""
    Login
"""    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        # get extra data in response
        data['is_admin'] = self.user.is_admin
        data['username'] = self.user.username
        return data



        
        
        

