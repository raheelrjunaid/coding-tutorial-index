# Generated by Django 3.1.2 on 2020-12-21 03:33

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_index', '0012_auto_20201220_0014'),
    ]

    operations = [
        migrations.AddField(
            model_name='tutorial',
            name='dislikes',
            field=models.ManyToManyField(blank=True, related_name='disliked_tutorials', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='tutorial',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='liked_tutorials', to=settings.AUTH_USER_MODEL),
        ),
    ]