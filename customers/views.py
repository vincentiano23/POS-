from django.shortcuts import render
from .models import Customer
from django.contrib.auth.decorators import login_required

@login_required
def customer_list(request):
    customers = Customer.objects.all()
    return render(request, 'customers/customer_list.html', {'customers': customers})
