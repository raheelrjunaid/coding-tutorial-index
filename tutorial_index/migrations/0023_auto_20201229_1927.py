# Generated by Django 3.1.2 on 2020-12-29 19:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_index', '0022_auto_20201227_2358'),
    ]

    operations = [
        migrations.AlterOrderWithRespectTo(
            name='tutorial',
            order_with_respect_to='likes',
        ),
    ]
