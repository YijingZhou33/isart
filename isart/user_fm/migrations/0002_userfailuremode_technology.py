# Generated by Django 4.1.3 on 2022-12-20 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_fm', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfailuremode',
            name='technology',
            field=models.CharField(max_length=256, null=True),
        ),
    ]
