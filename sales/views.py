from django.shortcuts import render
from .models import Order
from django.contrib.auth.decorators import login_required

@login_required
def sales_list(request):
    sales = Order.objects.all()
    return render(request, 'sales/sales_list.html', {'sales': sales})
