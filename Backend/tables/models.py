
# Create your models here.
from django.db import models


# ----------------------
# Admin (Optional)
# ----------------------
class Admin(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.name


# ----------------------
# Student
# ----------------------
from django.db import models

class Student(models.Model):
    GENDER_CHOICES = (
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    )

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    username = models.CharField(max_length=100, unique=True)

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address = models.TextField()
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username
# ----------------------
# Category
# ----------------------
class Category(models.Model):
    category_name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.category_name


# ----------------------
# Course
# ----------------------
class Course(models.Model):

    MODE_CHOICES = (
        ("Online", "Online"),
        ("Offline", "Offline"),
    )

    STATUS_CHOICES = (
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="courses"
    )

    course_name = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.CharField(max_length=100)
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES)
    # thumbnail = models.ImageField(upload_to="course_thumbnail/")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Active"
    )

    def __str__(self):
        return self.course_name


# ----------------------
# Batch
# ----------------------
class Batch(models.Model):

    STATUS_CHOICES = (
        ("Upcoming", "Upcoming"),
        ("Ongoing", "Ongoing"),
        ("Completed", "Completed"),
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="batches"
    )

    batch_name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    timing = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES
    )

    def __str__(self):
        return self.batch_name


# ----------------------
# Enrollment
# ----------------------
class Enrollment(models.Model):

    STATUS_CHOICES = (
        ("Pending", "Pending"),
        ("Enrolled", "Enrolled"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    batch = models.ForeignKey(
        Batch,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="enrollments"
    )

    enrollment_date = models.DateField(auto_now_add=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    def __str__(self):
        return f"{self.student} - {self.course}"


# ----------------------
# Payment
# ----------------------
class Payment(models.Model):

    PAYMENT_STATUS = (
        ("Pending", "Pending"),
        ("Successful", "Successful"),
        ("Failed", "Failed"),
    )

    enrollment = models.OneToOneField(
        Enrollment,
        on_delete=models.CASCADE,
        related_name="payment"
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    payment_method = models.CharField(max_length=50)

    transaction_id = models.CharField(
        max_length=100,
        unique=True
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS
    )

    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.transaction_id


# ----------------------
# Course Video
# ----------------------
class CourseVideo(models.Model):

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="videos"
    )

    title = models.CharField(max_length=200)

    youtube_url = models.URLField()

    description = models.TextField()

    video_order = models.PositiveIntegerField()

    def __str__(self):
        return self.title


# ----------------------
# Study Material
# ----------------------
from django.core.validators import MaxValueValidator, MinValueValidator
class StudyMaterial(models.Model):

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="materials"
    )

    title = models.CharField(max_length=200)

    file = models.FileField(upload_to="study_material/")

    def __str__(self):
        return self.title


    from django.core.validators import MaxValueValidator, MinValueValidator

# ----------------------
# Certificate
# ----------------------
class Certificate(models.Model):

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="certificates"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="certificates"
    )

    certificate_number = models.CharField(
        max_length=100,
        unique=True
    )

    issue_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.certificate_number


# ----------------------
# Feedback
# ----------------------
class Feedback(models.Model):
    RATING_CHOICES = (
            ("Excellent", "Exellent"),
            ("Good", "Good"),
            ("Average", "Average"),
            ("Poor", "Poor"),
        )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="feedbacks"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="feedbacks"
    )

    rating = models.CharField(max_length=10, choices = RATING_CHOICES )


    feedback = models.TextField()

    def __str__(self):
        return f"{self.student} - {self.course}"


# ----------------------
# Gallery
# ----------------------
class Gallery(models.Model):

    image = models.ImageField(
    upload_to='Gallery/',
    null=True,
    blank=True
    )
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title


# ----------------------
# Contact Us
# ----------------------
class ContactUs(models.Model):

    name = models.CharField(max_length=100)

    email = models.EmailField()

    phone = models.CharField(max_length=15)

    message = models.TextField()

    def __str__(self):
        return self.name