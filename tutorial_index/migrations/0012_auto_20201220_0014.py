# Generated by Django 3.1.2 on 2020-12-20 00:14

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_index', '0011_auto_20201220_0011'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tutorial',
            name='likes',
        ),
        migrations.AddField(
            model_name='tutorial',
            name='likes',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]