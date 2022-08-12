# Generated by Django 3.1.2 on 2020-12-27 23:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_index', '0021_auto_20201227_2225'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tutorial',
            name='comments',
        ),
        migrations.AddField(
            model_name='comment',
            name='tutorial',
            field=models.ForeignKey(default=13, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='tutorial_index.tutorial'),
            preserve_default=False,
        ),
    ]
