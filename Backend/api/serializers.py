from rest_framework import serializers
from django.contrib.auth.models import User

from tables.models import (
    Admin,
    Student,
    Category,
    Course,
    Batch,
    Enrollment,
    Payment,
    CourseVideo,
    StudyMaterial,
    Certificate,
    Feedback,
    Gallery,
    ContactUs,
)


# ---------------- Admin ----------------

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = "__all__"


# ---------------- Student ----------------

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


# ---------------- Student Registration ----------------

class StudentRegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = Student
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "gender",
            "address",
            "password",
        ]

    def validate_email(self, value):

        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "This email is already registered."
            )

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "This email is already registered."
            )

        return value

    def create(self, validated_data):

        password = validated_data.pop("password")
        email = validated_data["email"]

        # Create Django User with hashed password
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        # Create Student profile
        student = Student.objects.create(
            user=user,
            **validated_data
        )

        return student


# ---------------- Category ----------------

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


# ---------------- Course ----------------

class CourseSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)

    class Meta:
        model = Course
        fields = "__all__"


# ---------------- Batch ----------------

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = "__all__"


# ---------------- Enrollment ----------------

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"


# ---------------- Payment ----------------

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


# ---------------- Course Video ----------------

class CourseVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseVideo
        fields = "__all__"


# ---------------- Study Material ----------------

class StudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMaterial
        fields = "__all__"


# ---------------- Certificate ----------------

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = "__all__"


# ---------------- Feedback ----------------

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = "__all__"


# ---------------- Gallery ----------------

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = "__all__"


# ---------------- Contact Us ----------------

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = "__all__"