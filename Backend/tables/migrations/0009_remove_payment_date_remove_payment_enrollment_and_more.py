# Generated manually to synchronize Django migration state
# with the existing MySQL database.

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tables', '0008_remove_course_mode_enrollment_mode'),
    ]

    operations = [
        # These fields already do NOT exist in the database,
        # so we only update Django's migration state.
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.RemoveField(
                    model_name='payment',
                    name='date',
                ),
                migrations.RemoveField(
                    model_name='payment',
                    name='enrollment',
                ),
                migrations.RemoveField(
                    model_name='payment',
                    name='method',
                ),
                migrations.RemoveField(
                    model_name='payment',
                    name='transaction_id',
                ),
            ],
        ),

        # course_name already exists in the database.
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AddField(
                    model_name='payment',
                    name='course_name',
                    field=models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                    ),
                ),
            ],
        ),

        # created_at already exists in the database.
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AddField(
                    model_name='payment',
                    name='created_at',
                    field=models.DateTimeField(
                        auto_now_add=True,
                    ),
                ),
            ],
        ),

        # These fields do NOT currently exist in the database,
        # so Django should actually create them.
        migrations.AddField(
            model_name='payment',
            name='razorpay_order_id',
            field=models.CharField(
                blank=True,
                max_length=255,
                null=True,
                unique=True,
            ),
        ),

        migrations.AddField(
            model_name='payment',
            name='razorpay_payment_id',
            field=models.CharField(
                blank=True,
                max_length=255,
                null=True,
            ),
        ),

        migrations.AddField(
            model_name='payment',
            name='razorpay_signature',
            field=models.CharField(
                blank=True,
                max_length=500,
                null=True,
            ),
        ),

        migrations.AddField(
            model_name='payment',
            name='student',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='payments',
                to='tables.student',
            ),
        ),

        migrations.AlterField(
            model_name='coursevideo',
            name='description',
            field=models.TextField(
                blank=True,
                null=True,
            ),
        ),

        migrations.AlterField(
            model_name='coursevideo',
            name='video_order',
            field=models.PositiveIntegerField(
                default=1,
            ),
        ),

        migrations.AlterField(
            model_name='payment',
            name='status',
            field=models.CharField(
                default='created',
                max_length=50,
            ),
        ),
    ]