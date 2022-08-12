from django.urls import path
from . import views

urlpatterns = [
  path('', views.index, name='index'),
  path('category/<str:category>', views.category, name='category'),
  path('login', views.login_view, name='login'),
  path('logout', views.logout_view, name='logout'),
  path('register', views.register, name='register'),
  path('add-video', views.add_video, name='add-video'),
  path('tutorials/', views.get_tutorials, name='tutorial_json'),
  path('tutorials/<int:tutorial_id>', views.get_tutorials, name='tutorial_json'),
  path('tutorials/<int:tutorial_id>/<str:action>', views.update_tutorial, name='tutorial_json_put')
]