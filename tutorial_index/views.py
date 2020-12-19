from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from .models import *

# Create your views here.
def index(request):
  return render(request, "tutorial_index/index.html")

def category(request, category):
  pass

@login_required(login_url='/login')
def dashboard(request, dashboard):
  pass

def add_video(request):
  if request.method == 'POST':
    title = request.POST['title']
    description = request.POST['description']
    category = request.POST['category']
    create_category = request.POST['created-category'].split(', ')
    video_url = request.POST['url']

    tutorial = Tutorial(title=title, description=description, url=video_url)
    tutorial.save()
    category = Category.objects.get(name=category)
    tutorial.category.add(category)
    tutorial.save()

    if create_category[0] != None:
      for category in create_category:
        created_category = Category(name=category)
        created_category.save()
        tutorial.category.add(created_category)
    tutorial.save()
    
  return render(request, 'tutorial_index/add-video.html', {
    'categories': Category.objects.all()
  })

def login_view(request):
  if request.method == 'POST':
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
      login(request, user)
      return HttpResponseRedirect(reverse("index"))
    else:
      return render(request, "tutorial_view/login.html", {
          "message": "Invalid username and/or password."
      })
  else:
    return render(request, "tutorial_index/login.html")

@login_required(login_url='/login')
def logout_view(request):
  logout(request)
  return HttpResponseRedirect(reverse('index'))

def register(request):
  if request.method == 'POST':
    username = request.POST['username']
    email = request.POST['email']
    password = request.POST['password']
    user = User.objects.create_user(username, email, password)
    user.save()
    
    login(request, user)
    return HttpResponseRedirect(reverse('dashboard'))
  else:
    return render(request, "tutorial_index/register.html")