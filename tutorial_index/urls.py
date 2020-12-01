from django.urls import path
from . import views

urlpatterns = [
  path('', views.index, name='index'),
  path('category/<str:category>', views.category, name='category'),
  path('login', views.login_view, name='login'),
  path('dashboard', views.dashboard, name='dashboard'),
  path('logout', views.logout_view, name='logout'),
  path('register', views.register, name='register'),
  path('add-video', views.add_video, name='add-video'),
]