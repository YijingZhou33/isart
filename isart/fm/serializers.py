from rest_framework import serializers
from .models import FailureMode

class FailureModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FailureMode
        fields = '__all__'