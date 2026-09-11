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

# ---------------- Course ----------------

class CourseSerializer(serializers.ModelSerializer):

    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )

    class Meta:
        model = Course
        fields = "__all__"


# ---------------- Batch ----------------

class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = "__all__"


class EnrollmentSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()
    batch_name = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "student_name",
            "course",
            "course_name",
            "batch",
            "batch_name",
            "mode",
            "enrollment_date",
            "status",
        ]

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

    def get_course_name(self, obj):
        return obj.course.course_name

    def get_batch_name(self, obj):
        if obj.batch:
            return obj.batch.batch_name
        return "No Batch"

class PaymentSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()
    course_name_display = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            "id",
            "student",
            "student_name",
            "course",
            "enrollment",
            "course_name",
            "course_name_display",
            "amount",
            "razorpay_order_id",
            "razorpay_payment_id",
            "razorpay_signature",
            "status",
            "created_at",
        ]

    def get_student_name(self, obj):

        if obj.student:
            return (
                f"{obj.student.first_name} "
                f"{obj.student.last_name}"
            )

        return "-"

    def get_course_name_display(self, obj):

        if obj.course:
            return obj.course.course_name

        return obj.course_name or "-"
# ---------------- Course Video ----------------

class CourseVideoSerializer(serializers.ModelSerializer):

    course_name = serializers.CharField(
        source="course.course_name",
        read_only=True
    )

    class Meta:
        model = CourseVideo
        fields = [
            "id",
            "course",
            "course_name",
            "title",
            "youtube_url",
            "description",
            "video_order",
        ]
# ---------------- Study Material ----------------

# ---------------- Study Material ----------------

# ---------------- Study Material ----------------

class StudyMaterialSerializer(serializers.ModelSerializer):

    course_name = serializers.CharField(
        source="course.course_name",
        read_only=True
    )

    file = serializers.FileField(required=True)

    class Meta:
        model = StudyMaterial

        fields = [
            "id",
            "course",
            "course_name",
            "title",
            "file",
        ]

    def to_representation(self, instance):

        data = super().to_representation(instance)

        if instance.file:

            request = self.context.get("request")

            if request:
                data["file"] = request.build_absolute_uri(
                    instance.file.url
                )
            else:
                data["file"] = instance.file.url

        else:
            data["file"] = None

        return data
# ---------------- Certificate ----------------

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = "__all__"


# ---------------- Feedback ----------------

# ---------------- Feedback ----------------

class FeedbackSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = [
            "id",
            "student",
            "student_name",
            "course",
            "course_name",
            "rating",
            "feedback",
        ]

    def get_student_name(self, obj):
        if obj.student:
            return f"{obj.student.first_name} {obj.student.last_name}"
        return "-"

    def get_course_name(self, obj):
        if obj.course:
            return obj.course.course_name
        return "-"

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