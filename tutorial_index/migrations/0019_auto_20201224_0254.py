# Generated by Django 3.1.2 on 2020-12-24 02:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_index', '0018_auto_20201224_0253'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='replies',
            field=models.ManyToManyField(related_name='replied_to', to='tutorial_index.Comment'),
        ),
    ]
