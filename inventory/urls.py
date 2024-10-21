
from django.urls import path
from .views import add_product
from .import views

urlpatterns = [
     path('', views.product_list, name='inventory-list'),
    path('inventory/add/', add_product, name='add-product'),
]
