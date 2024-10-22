from django.shortcuts import render, get_object_or_404
from .models import Order, OrderItem
from django.contrib.auth.decorators import login_required
from django.db.models import Sum, Count
from datetime import datetime, timedelta
from inventory.models import Product
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@login_required
def sales_list(request):
    sales = Order.objects.all()
    return render(request, 'sales/sales_list.html', {'sales': sales})

@login_required
def sales_dashboard(request):
    # Total sales and number of orders
    total_sales = Order.objects.aggregate(Sum('total_price'))['total_price__sum'] or 0
    order_count = Order.objects.count()

    # Daily/Monthly Sales trends (last 30 days)
    last_30_days = datetime.now() - timedelta(days=30)
    sales_trend = (
        Order.objects.filter(date__gte=last_30_days)
        .extra({'day': "date(date)"})
        .values('day')
        .annotate(total_sales=Sum('total_price'))
        .order_by('day')
    )

    # Top-selling products
    top_products = (
        OrderItem.objects.values('product__name')
        .annotate(total_quantity=Sum('quantity'))
        .order_by('-total_quantity')[:5]
    )

    # Top customers by total revenue
    top_customers = (
        Order.objects.values('customer__first_name', 'customer__last_name')
        .annotate(total_spent=Sum('total_price'))
        .order_by('-total_spent')[:5]
    )

    # Low stock products (threshold 10)
    low_stock_products = Product.objects.filter(quantity__lte=10)

    # Compile context for template
    context = {
        'total_sales': total_sales,
        'order_count': order_count,
        'sales_trend': sales_trend,
        'top_products': top_products,
        'top_customers': top_customers,
        'low_stock_products': low_stock_products,
    }

    return render(request, 'sales/dashboard.html', context)

@csrf_exempt
def add_sale(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Fetch product and customer, handle product stock
            product = get_object_or_404(Product, id=data['productId'])

            if product.quantity < int(data['quantity']):
                return JsonResponse({'error': 'Insufficient stock'}, status=400)

            # Reduce stock in the inventory
            product.quantity -= int(data['quantity'])
            product.save()

            # Create new order (Sale)
            new_order = Order.objects.create(
                product_id=product.id,
                quantity=data['quantity'],
                customer_id=data['customerId'],
                total_price=product.price * int(data['quantity']),  # Assuming you store price in Product
                # Add other necessary fields
            )

            return JsonResponse({'id': new_order.id}, status=201)

        except Product.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except KeyError:
            return JsonResponse({'error': 'Invalid data'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def update_sale(request, sale_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            order = get_object_or_404(Order, id=sale_id)

            # Update the quantity and product stock
            product = get_object_or_404(Product, id=order.product_id)

            # Adjust stock quantity: Add back previous quantity, subtract new one
            product.quantity += order.quantity  # Add back previous quantity
            if product.quantity < int(data['quantity']):
                return JsonResponse({'error': 'Insufficient stock'}, status=400)

            product.quantity -= int(data['quantity'])  # Subtract new quantity
            product.save()

            # Update order details
            order.quantity = data['quantity']
            order.total_price = product.price * int(data['quantity'])
            order.save()

            return JsonResponse({'id': order.id}, status=200)

        except Order.DoesNotExist:
            return JsonResponse({'error': 'Sale not found'}, status=404)
        except Product.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except KeyError:
            return JsonResponse({'error': 'Invalid data'}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def remove_sale(request, sale_id):
    if request.method == 'DELETE':
        try:
            order = get_object_or_404(Order, id=sale_id)

            # Fetch the associated OrderItem(s) for the order
            order_items = OrderItem.objects.filter(order_id=order.id)

            # Loop through each OrderItem to restore product quantities
            for item in order_items:
                product = get_object_or_404(Product, id=item.product_id)
                product.quantity += item.quantity  # Restore stock quantity
                product.save()

            # Delete the order and its items
            order.delete()

            return JsonResponse({'status': 'success'}, status=204)

        except Order.DoesNotExist:
            return JsonResponse({'error': 'Sale not found'}, status=404)
        except Product.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
