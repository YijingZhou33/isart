# Generated by Django 4.1.3 on 2023-01-18 22:30

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="FailureMode",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("subprocess_id", models.IntegerField()),
                ("step_id", models.IntegerField()),
                ("failure_mode", models.TextField()),
                ("found_in_other_steps", models.CharField(max_length=256, null=True)),
                ("potential_effect", models.TextField(null=True)),
                ("potential_causes", models.TextField(null=True)),
                ("severity", models.IntegerField(default=0, null=True)),
                ("rpn", models.FloatField(default=0, null=True)),
                ("current_mitigation", models.TextField(null=True)),
                ("mitigation_strategy", models.TextField(null=True)),
                ("process_type", models.CharField(max_length=256, null=True)),
                ("software", models.CharField(max_length=256, null=True)),
                ("abr", models.CharField(max_length=256, null=True)),
                ("process_id", models.CharField(max_length=20, null=True)),
                ("created", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "fm",
                "ordering": ["subprocess_id", "step_id", "severity"],
            },
        ),
    ]
