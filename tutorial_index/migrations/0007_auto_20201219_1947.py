# Generated by Django 3.1.2 on 2020-12-19 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_index', '0006_auto_20201219_1823'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tutorial',
            name='url',
        ),
        migrations.AddField(
            model_name='tutorial',
            name='video_id',
            field=models.CharField(max_length=200, null=True),
        ),
    ]