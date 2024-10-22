from django.urls import path
from . import views
from .views import add_sale, update_sale, remove_sale

urlpatterns = [
    path('', views.sales_list, name='sales-list'),
    path('sales/dashboard ', views.sales_dashboard, name='sales-dashboard'),
     path('sales/add/', add_sale, name='add_sale'),
    path('sales/update/<int:sale_id>/', update_sale, name='update_sale'),
    path('sales/remove/<int:sale_id>/', remove_sale, name='remove_sale'),
]
