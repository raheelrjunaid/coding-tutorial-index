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
  title = models.CharField(max_length=500)
  description = models.CharField(max_length=500)
  video_id = models.CharField(max_length=200)
  category = models.ManyToManyField(Category, blank=True)
  likes = models.ManyToManyField(User, blank=True, related_name="liked_tutorials")
  dislikes = models.ManyToManyField(User, blank=True, related_name="disliked_tutorials")
  comments = models.ManyToManyField(Comment, blank=True)

  def __str__(self):
    return f"Tutorial #{self.id}: {self.title}"
