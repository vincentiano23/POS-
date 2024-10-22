from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order, Receipt

@receiver(post_save, sender=Order)
def create_receipt(sender, instance, created, **kwargs):
    if created:
        Receipt.objects.create(order=instance)
