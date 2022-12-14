# Generated by Django 3.1.2 on 2020-11-29 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutorial_index', '0002_comment_tutorial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.AddField(
            model_name='tutorial',
            name='comments',
            field=models.ManyToManyField(to='tutorial_index.Comment'),
        ),
    ]
