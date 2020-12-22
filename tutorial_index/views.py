from django.contrib.auth import authenticate, login, logout
import json
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from .models import *


# Create your views here.
def index(request):
  return render(
      request, "tutorial_index/index.html", {
          "tutorials": Tutorial.objects.all()}
  )


# API[GET]
def get_tutorials(request, tutorial_id):
  tutorial = Tutorial.objects.get(id=tutorial_id)
  return JsonResponse({
      "tutorial_id": tutorial.id,
      "title": tutorial.title,
      "video_id": tutorial.video_id,
      "description": tutorial.description,
      "categories": [name["name"] for name in tutorial.category.all().values()],
      "likes": [user["username"] for user in tutorial.likes.all().values()],
      "dislikes": [user["username"] for user in tutorial.dislikes.all().values()],
      "comments": [comment for comment in tutorial.comments.all().values()],
  })


@csrf_exempt
# API[PUT] -> (like, dislike, update_body, update_title, update_categories)
def update_tutorial(request, tutorial_id, action):
  tutorial = Tutorial.objects.get(id=tutorial_id)
  # Only allow put requests
  if request.method == "PUT":
    # Get the user that prompted request
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
