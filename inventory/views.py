from django.shortcuts import render, redirect
from .models import Product
from .forms import ProductForm
from django.contrib.auth.decorators import login_required

@login_required
def product_list(request):
    products = Product.objects.all()
    return render(request, 'inventory/product_list.html', {'products': products})

@login_required
def add_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            form.save()  # Save the product to the database
            return redirect('inventory-list')  # Redirect to product list after successful add
    else:
        form = ProductForm()

    return render(request, 'inventory/add_product.html', {'form': form})