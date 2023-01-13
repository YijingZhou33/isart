from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .serializers import UserSignupSerializer, UserResetPasswordSerializer, MyTokenObtainPairSerializer
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django_filters.rest_framework import FilterSet

User = get_user_model()

class MyCustomFilter(FilterSet):
    class Meta:
        model = User
        fields = ['id', 'is_admin']

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    lookup_field = 'username'
    filterset_class = MyCustomFilter

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]

        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            self.serializer_class = UserSignupSerializer
        else:
            self.serializer_class = UserResetPasswordSerializer
        return super().get_serializer_class()

    
    """
        Sign up
    """
    def post(self, request, *args, **kwargs):
        serializer = UserSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    
    """
        Reset password
    """
    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = UserResetPasswordSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


