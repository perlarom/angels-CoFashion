# Generated by Django 5.1.6 on 2025-03-10 23:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_category_subcategory'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('images', models.ImageField(upload_to='products/')),
                ('sku', models.CharField(editable=False, max_length=100, unique=True)),
                ('stock', models.IntegerField(default=0)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_modified', models.DateTimeField(auto_now=True)),
                ('subcategories', models.ManyToManyField(related_name='products', to='api.subcategory')),
            ],
        ),
        migrations.CreateModel(
            name='ProductStock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('size', models.CharField(max_length=10)),
                ('stock', models.IntegerField()),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stock_entries', to='api.product')),
            ],
        ),
    ]
