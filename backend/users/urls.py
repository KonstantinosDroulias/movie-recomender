from django.urls import path
from . import views

urlpatterns = [
    path('register/',              views.register),
    path('login/',                 views.login),
    path('logout/',                views.logout),
    path('history/',               views.history),
    path('watchlist/',             views.watchlist),
    path('watchlist/<int:item_id>/', views.watchlist_item),
]