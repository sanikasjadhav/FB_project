
# Create your models here.
from django.db import models
from django.contrib.auth.models import User
 #----------------------
# Admin
# ----------------------

class Admin(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return self.name


# ----------------------
# Student
# ----------------------

class Student(models.Model):

    GENDER_CHOICES = (
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    )

    # Django User for secure login
    user = models.OneToOneField(
    User,
    on_delete=models.CASCADE,
    related_name="student_profile",
    null=True,
    blank=True
    )

    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100
    )

    email = models.EmailField(
        unique=True
    )

    phone = models.CharField(
        max_length=12,
        unique=True
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    address = models.TextField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
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
# ----------------------
# Course
# ----------------------

class Course(models.Model):

    STATUS_CHOICES = (
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="courses"
    )

    course_name = models.CharField(
        max_length=200
    )

    description = models.TextField()

    duration = models.CharField(
        max_length=100
    )

    fees = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

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
# ----------------------
# Enrollment
# ----------------------

class Enrollment(models.Model):

    MODE_CHOICES = (
        ("Online", "Online"),
        ("Offline", "Offline"),
    )

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

    # Student chooses Online or Offline during enrollment
    mode = models.CharField(
        max_length=20,
        choices=MODE_CHOICES,
        null=True,
        blank=True
    )

    enrollment_date = models.DateField(
        auto_now_add=True
    )

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

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="payments"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="payments"
    )

    enrollment = models.ForeignKey(
        Enrollment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="payments"
    )

    course_name = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    razorpay_order_id = models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True
    )

    razorpay_payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    razorpay_signature = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=50,
        default="created"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.course_name} - {self.amount}"
# ----------------------
# Study Material
# ----------------------
from django.core.validators import MaxValueValidator, MinValueValidator

class StudyMaterial(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="study_materials"
    )
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to="study_material")

    def __str__(self):
        return self.title

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
# Course Video
# ----------------------

class CourseVideo(models.Model):

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="videos"
    )

    title = models.CharField(
        max_length=200
    )

    youtube_url = models.URLField()

    description = models.TextField(
        blank=True,
        null=True
    )

    video_order = models.PositiveIntegerField(
        default=1
    )

    def __str__(self):
        return f"{self.course.course_name} - {self.title}"

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