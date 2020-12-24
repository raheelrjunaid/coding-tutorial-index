from django.contrib.auth import authenticate, login, logout
import json
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.core import serializers
from .models import *


# Create your views here.
def index(request):
  return render(
      request, "tutorial_index/index.html", {
          "tutorials": Tutorial.objects.all()}
  )

# API[GET]


def get_tutorials(request, tutorial_id=''):
  # Get replies from comment
  def get_replies(replies):
    replies_list = []
    for reply in replies:
      replies_list.append({
        "id": reply.id, "author": User.objects.get(id=reply.author_id).username, "content": reply.content
      })
    return replies_list
  if tutorial_id != '':
    tutorial = Tutorial.objects.get(id=tutorial_id)
    comments = []
    for comment in tutorial.comments.all():
      if (comment.reply == False):
        comments.append({
          "id": comment.id, "author": User.objects.get(id=comment.author_id).username, "content": comment.content, "replies": get_replies(comment.replies.all())
        })
    return JsonResponse({
        "tutorial_id": tutorial.id,
        "title": tutorial.title,
        "video_id": tutorial.video_id,
        "description": tutorial.description,
        "categories": [name["name"] for name in tutorial.category.all().values()],
        "likes": [user["username"] for user in tutorial.likes.all().values()],
        "dislikes": [user["username"] for user in tutorial.dislikes.all().values()],
        "comments": comments
    }, json_dumps_params={'indent': 4})
  # Shpw all tutorials
  else:
    results = []
    for tutorial in Tutorial.objects.all().values():
      results.append(tutorial)
    return JsonResponse({
        "tutorials": results
    }, json_dumps_params={'indent': 4})


@csrf_exempt
# API[PUT] -> (like, dislike, comments)
def update_tutorial(request, tutorial_id, action):
  # Only allow put requests
  if request.method == "PUT":
    # Get the user that prompted request
    tutorial = Tutorial.objects.get(id=tutorial_id)
    user = User.objects.get(username=json.loads(request.body)["username"])
    # Liking a Post
    if action == "like":
      if user in tutorial.likes.all():
        tutorial.likes.remove(user)
      else:
        tutorial.likes.add(user)
      # Remove dislike
      if user in tutorial.dislikes.all():
        tutorial.dislikes.remove(user)
      tutorial.save()
    # Disliking a Post
    elif action == "dislike":
      if user in tutorial.dislikes.all():
        tutorial.dislikes.remove(user)
      else:
        tutorial.dislikes.add(user)
      # Remove dislike
      if user in tutorial.likes.all():
        tutorial.likes.remove(user)
      tutorial.save()
    elif action == "comment":
      data = json.loads(request.body)
      if data['content'] != '':
        new_comment = Comment(author=user, content=data['content'])
        new_comment.save()
        tutorial.comments.add(new_comment)
        tutorial.save()
    elif action == 'reply':
      data = json.loads(request.body)
      if data['content'] != '':
        new_reply = Comment(author=user, content=data['content'])
        new_reply.save()
        comment_replied_to = Comment.objects.get(id=data['comment_reply_id'])
        comment_replied_to.replies.add(new_reply)
        comment_replied_to.save()
    return HttpResponse('Success', status=201)
  else:
    return HttpResponse("Error: must be a PUT request", status=400)


def category(request, category):
  return render(request, "tutorial_index/category.html", {
      "tutorials": Tutorial.objects.filter(category=Category.objects.get(name=category)),
      "category": category
  })


@login_required(login_url="/login")
def dashboard(request, dashboard):
  pass

# Adding a new Video


def add_video(request):
  # Post Request
  if request.method == "POST":
    # Variables/Values
    title = request.POST["title"]
    description = request.POST["description"]
    category = request.POST.get("category", "")
    create_category = request.POST["created-category"].split(", ")
    video_id = request.POST["id"]

    # Creating the tutorial Object
    if video_id != '':
      tutorial = Tutorial(
          title=title, description=description, video_id=video_id)
      tutorial.save()

      # Checking to see if a category has been specified
      if category != "":
        category = Category.objects.get(name=category)
        tutorial.category.add(category)
        tutorial.save()

      # Checking for created categories
      if create_category[0] != "":
        for category in create_category:
          # Adding that category to the model
          created_category = Category(name=category)
          created_category.save()
          # Associating that category with the tutorial
          tutorial.category.add(created_category)
      tutorial.save()
      return HttpResponseRedirect(reverse("index"))
    else:
      return HttpResponseRedirect(reverse('add-video'))
  # Get the add video page
  else:
    return render(
        request,
        "tutorial_index/add-video.html",
        {"categories": Category.objects.all()},
    )


def login_view(request):
  # Process the login data
  if request.method == "POST":
    # Login data Variables
    username = request.POST["username"]
    password = request.POST["password"]
    # Login that user
    user = authenticate(request, username=username, password=password)

    # If that user exists
    if user is not None:
      login(request, user)
      return HttpResponseRedirect(reverse("index"))
    # If that user doesn't exist
    else:
      return render(
          request,
          "tutorial_view/login.html",
          {"message": "Invalid username and/or password."},
      )
  # Return Login page
  else:
    return render(request, "tutorial_index/login.html")


@login_required(login_url="/login")
def logout_view(request):
  logout(request)
  return HttpResponseRedirect(reverse("index"))


def register(request):
  # Process the register data
  if request.method == "POST":
    # Register data variables
    username = request.POST["username"]
    email = request.POST["email"]
    password = request.POST["password"]
    # Create and save the new user
    user = User.objects.create_user(username, email, password)
    user.save()

    # Log them in automatically and bring them to their dashboard
    login(request, user)
    return HttpResponseRedirect(reverse("dashboard"))
  # Return the register page
  else:
    return render(request, "tutorial_index/register.html")
