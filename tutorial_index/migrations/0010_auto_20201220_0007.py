# Generated by Django 3.1.2 on 2020-12-20 00:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_index', '0009_auto_20201220_0006'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tutorial',
            name='likes',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
