from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from auditlog.registry import auditlog
from auditlog.models import AuditlogHistoryField
from auditlog.registry import auditlog

User = get_user_model()

"""
    User-entered Failure Mode
"""
class UserFailureMode(models.Model):  
    history = AuditlogHistoryField()  
    
    author = models.ForeignKey(
        User,
        null=True,
        on_delete=models.CASCADE,
        related_name='fms'
    )

    subprocess_id = models.IntegerField() # unknown: 0, A: -1
    step_id = models.IntegerField() # unknown: 0, A: -1
    failure_mode = models.TextField()
    found_in_other_steps = models.CharField(max_length=256, null=True)
    potential_effect = models.TextField(null=True)
    potential_causes = models.TextField(null=True)
    severity = models.IntegerField(default=0, null=True)
    rpn = models.FloatField(default=0, null=True)
    current_mitigation = models.TextField(null=True)
    mitigation_strategy = models.TextField(null=True)
    process_type = models.CharField(max_length=256, null=True)
    software = models.CharField(max_length=256, null=True)
    abr = models.CharField(max_length=256, null=True)
    process_id = models.CharField(max_length=20, null=True)
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(auto_now=True)
    comments = models.TextField(null=True)
    software_solution = models.TextField(null=True)
    published = models.BooleanField(default=False)
    technology = models.CharField(max_length=256, null=True)
    
   
    def __str__(self):
        return '%s____%s____%s'%(self.process_id, self.failure_mode, self.severity)
    
    class Meta:
        db_table = 'user_fm' # change database name 
        ordering = ['subprocess_id', 'step_id', 'severity']
        
auditlog.register(UserFailureMode, serialize_data=True)
        

