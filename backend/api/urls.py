from django.urls import path
from . import views

urlpatterns = [
    path('popular/',             views.popular),
    path('search/',              views.search),
    path('movie/<int:tmdb_id>/', views.movie_detail),
    path('recommend/',           views.recommend),
]