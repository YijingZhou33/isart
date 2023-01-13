from rest_framework.viewsets import ModelViewSet
from .serializers import FailureModeSerializer
from .models import FailureMode
from rest_framework.permissions import IsAuthenticated
from isart.paginations import MyCustomPagination
from django_filters.rest_framework import FilterSet, CharFilter, DateTimeFromToRangeFilter
from .permissions import IsAdminOrReadOnly

"""
    Filter
"""
class MyCustomFilter(FilterSet):
    # http://localhost:8080/api/fm/?severity=1,2
    severity = CharFilter(method='multiple_choice_filter')
    process_type = CharFilter(method='multiple_choice_filter')
    process_id = CharFilter(method='multiple_choice_filter')
    updated = DateTimeFromToRangeFilter()
    
    class Meta:
        model = FailureMode
        fields = ['id', 'step_id', 'subprocess_id', 'process_type', 'severity', 'process_id', 'updated']
        
    def multiple_choice_filter(self, queryset, name, value):
            value_list = value.split(u',') #split the values by ,
            return queryset.filter(**{
            name+"__in": value_list, #add __in to get each value of the list
            })
            
    
class FailureModeViewSet(ModelViewSet): 
    queryset = FailureMode.objects.exclude(step_id=0).exclude(subprocess_id=0).exclude(subprocess_id=-1).exclude(severity=0).exclude(severity=None)
    serializer_class = FailureModeSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    filterset_class = MyCustomFilter
    pagination_class = MyCustomPagination
    ordering_fields = ('severity', 'rpn', 'updated') # ?ordering=severity ascending / ?ordering=-severity descending 
