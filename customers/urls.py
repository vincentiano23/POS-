from django.urls import path
from . import views

urlpatterns = [
    path('', views.customer_list, name='customer-list'),
]
