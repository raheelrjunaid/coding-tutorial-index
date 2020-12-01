from django.db import models
from django.contrib.auth.models import AbstractUser
from django.forms import ModelForm

# Create your models here.
class User(AbstractUser):
  pass

class Comment(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  content = models.CharField(max_length=200)

  def __str__(self):
    return f"Comment by {self.user}: {self.content}"

class Category(models.Model):
  name = models.CharField(max_length=50)
  
  def __str__(self):
    return self.name

class Tutorial(models.Model):
  title = models.CharField(max_length=500, null=True)
  description = models.CharField(max_length=500, null=True)
  url = models.URLField(null=True)
  category = models.ManyToManyField(Category)
  likes = models.ForeignKey(User, on_delete=models.CASCADE)
  comments = models.ManyToManyField(Comment)