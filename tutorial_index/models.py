from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
  def natural_key(self):
    return (self.username)


class Comment(models.Model):
  author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commented")
  content = models.CharField(max_length=200)

  def __str__(self):
    return f"Comment by {self.author}: {self.content}"


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