# Generated by Django 5.1.6 on 2025-03-13 18:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_productsize_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='size',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
