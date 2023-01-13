from django.contrib import admin

from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import FailureMode

@admin.register(FailureMode)
class FailureModeAdmin(ImportExportModelAdmin):
    list_display = ('subprocess_id', 'step_id', 'failure_mode',   
                    'found_in_other_steps', 'potential_effect',
                    'potential_causes', 'severity', 'rpn',
                    'current_mitigation', 'mitigation_strategy',
                    'process_type', 'software', 'abr', 'process_id')