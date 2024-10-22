from django.db import models
from inventory.models import Product
from customers.models import Customer

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.id} - {self.customer}"
    
   
    def save(self, *args, **kwargs):
        # Make sure to save the order before accessing related objects
        super(Order, self).save(*args, **kwargs)
        # Now you can safely access related fields, like OrderItem, etc.


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item {self.product.name} for Order {self.order.id}"
    
    def save(self, *args, **kwargs):
        # Reduce product stock when an item is ordered
        if self.product.quantity >= self.quantity:
            self.product.quantity -= self.quantity
            self.product.save()
        else:
            raise ValueError("Not enough stock for product")
        super(OrderItem, self).save(*args, **kwargs)

    class Receipt(models.Model):
        order = models.OneToOneField(Order, on_delete=models.CASCADE)
        date_generated = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return f"Receipt for Order {self.order.id}"
    
   
        
