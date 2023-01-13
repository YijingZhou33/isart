from rest_framework.viewsets import ModelViewSet
from .serializers import UserFailureModeSerializer
from .models import UserFailureMode
from rest_framework.permissions import IsAuthenticated
from isart.paginations import MyCustomPagination
from django_filters.rest_framework import FilterSet, CharFilter
from .permissions import IsAdminOrReadPostOnly
from rest_framework.decorators import action
from rest_framework.response import Response

"""
    Filter
"""
class MyCustomFilter(FilterSet):
    # http://localhost:8080/api/user-fm/?severity=1,2
    severity = CharFilter(method='multiple_choice_filter')
    process_type = CharFilter(method='multiple_choice_filter')
    process_id = CharFilter(method='multiple_choice_filter')
    
    class Meta:
        model = UserFailureMode
        fields = ['id', 'step_id', 'subprocess_id', 'process_type', 'severity', 'process_id', 'published', 'created', 'updated']
        
    def multiple_choice_filter(self, queryset, name, value):
            value_list = value.split(u',') #split the values by ,
            return queryset.filter(**{
            name+"__in": value_list, #add __in to get each value of the list
            })
            
    
class UserFailureModeViewSet(ModelViewSet): 
    queryset = UserFailureMode.objects.all()
    serializer_class = UserFailureModeSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadPostOnly]

    filterset_class = MyCustomFilter
    pagination_class = MyCustomPagination
    ordering_fields = ('created', 'updated',) # ?ordering=severity ascending / ?ordering=-severity descending 
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        
    @action(detail=True, methods=['get'], url_path='log_created')
    def log_created(self, request, pk):
        queryset = UserFailureMode.objects.get(id=pk).history.all().last()
        return Response(queryset.changes_dict)
    
    @action(detail=True, methods=['get'], url_path='log_updated')
    def log_updated(self, request, pk):
        queryset = UserFailureMode.objects.get(id=pk).history.latest()
        return Response(queryset.changes_dict)
    