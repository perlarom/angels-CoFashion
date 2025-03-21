# Generated by Django 5.1.6 on 2025-03-14 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_size_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='products/'),
        ),
        migrations.AlterField(
            model_name='productimage',
            name='image_url',
            field=models.ImageField(upload_to='products/'),
        ),
    ]
