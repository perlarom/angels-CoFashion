# Generated by Django 5.1.6 on 2025-03-13 17:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_remove_product_stock_product_image_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='productsize',
            unique_together=set(),
        ),
        migrations.RemoveField(
            model_name='product',
            name='image',
        ),
        migrations.RemoveField(
            model_name='product',
            name='sku',
        ),
        migrations.RemoveField(
            model_name='product',
            name='subcategories',
        ),
        migrations.RemoveField(
            model_name='size',
            name='description',
        ),
        migrations.AddField(
            model_name='product',
            name='subcategory',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='api.subcategory'),
        ),
        migrations.AddField(
            model_name='product',
            name='total_stock',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='product',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='productsize',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sizes', to='api.product'),
        ),
        migrations.AlterField(
            model_name='productsize',
            name='size',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.size'),
        ),
        migrations.AlterField(
            model_name='productsize',
            name='stock',
            field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name='size',
            name='name',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_url', models.URLField()),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='api.product')),
            ],
        ),
        migrations.DeleteModel(
            name='Image',
        ),
    ]
