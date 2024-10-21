from django.urls import path
from . import views

urlpatterns = [
    path('', views.sales_list, name='sales-list'),
]
