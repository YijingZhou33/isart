from rest_framework import serializers
from .models import UserFailureMode

class UserFailureModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFailureMode
        fields = '__all__'
        
    read_only_fields = ['author']