from django.contrib import admin
from .models import Order, OrderItem

@admin.register(Order)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('customer',  'total_price', 'date')
    list_filter = ('date',)

@admin.register(OrderItem)
class saleAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    list_filter =('order',)

