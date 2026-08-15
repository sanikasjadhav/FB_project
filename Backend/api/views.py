from rest_framework import generics
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

from .serializers import (
    AdminSerializer,
    StudentSerializer,
    StudentRegisterSerializer,
    CategorySerializer,
    CourseSerializer,
    BatchSerializer,
    EnrollmentSerializer,
    PaymentSerializer,
    CourseVideoSerializer,
    StudyMaterialSerializer,
    CertificateSerializer,
    FeedbackSerializer,
    GallerySerializer,
    ContactUsSerializer,
)


# ---------------- Admin ----------------
class AdminListCreateView(generics.ListCreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer


class AdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

    lookup_field= "pk"


# ---------------- Student ----------------
class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field= "pk"

# ---------------- Student Registration ----------------
class StudentRegisterView(generics.CreateAPIView):

    serializer_class = StudentRegisterSerializer


# ---------------- Category ----------------
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field= "pk"


# ---------------- Course ----------------
class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field= "pk"


# ---------------- Batch ----------------
class BatchListCreateView(generics.ListCreateAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer


class BatchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    lookup_field= "pk"


# ---------------- Enrollment ----------------
class EnrollmentListCreateView(generics.ListCreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer


class EnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    lookup_field= "pk"


# ---------------- Payment ----------------
class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    lookup_field= "pk"


# ---------------- Course Video ----------------
class CourseVideoListCreateView(generics.ListCreateAPIView):
    queryset = CourseVideo.objects.all()
    serializer_class = CourseVideoSerializer


class CourseVideoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CourseVideo.objects.all()
    serializer_class = CourseVideoSerializer
    lookup_field= "pk"


# ---------------- Study Material ----------------
class StudyMaterialListCreateView(generics.ListCreateAPIView):
    queryset = StudyMaterial.objects.all()
    serializer_class = StudyMaterialSerializer


class StudyMaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StudyMaterial.objects.all()
    serializer_class = StudyMaterialSerializer

    lookup_field= "pk"

# ---------------- Certificate ----------------
class CertificateListCreateView(generics.ListCreateAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer


class CertificateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer

    lookup_field= "pk"

# ---------------- Feedback ----------------
class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer


class FeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    lookup_field= "pk"


# ---------------- Gallery ----------------
class GalleryListCreateView(generics.ListCreateAPIView):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer


class GalleryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    lookup_field= "pk"


# ---------------- Contact ----------------
class ContactUsListCreateView(generics.ListCreateAPIView):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer


class ContactUsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer
    lookup_field= "pk"



from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from tables.models import Student


class StudentLoginView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        # Check required fields
        if not email or not password:
            return Response(
                {
                    "success": False,
                    "message": "Email and Password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find student by email
        try:
            student = Student.objects.get(email=email)
        except Student.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Email not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Make sure Student has a Django User
        if student.user is None:
            return Response(
                {
                    "success": False,
                    "message": "Student account is not connected to a login account."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Authenticate using Django's secure password system
        user = authenticate(
            username=student.user.username,
            password=password
        )

        # Invalid password
        if user is None:
            return Response(
                {
                    "success": False,
                    "message": "Invalid password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Create JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "success": True,
                "message": "Login Successful",

                "access": str(refresh.access_token),

                "refresh": str(refresh),

                "student": {
                    "id": student.id,
                    "first_name": student.first_name,
                    "last_name": student.last_name,
                    "email": student.email
                }
            },
            status=status.HTTP_200_OK
        )

# ---------------- Admin Login ----------------


from tables.models import Admin


class AdminLoginView(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {
                    "success": False,
                    "message": "Email and Password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            admin = Admin.objects.get(email=email)

        except Admin.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Admin email not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if admin.user is None:
            return Response(
                {
                    "success": False,
                    "message": "Admin account is not connected to a login account."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        user = authenticate(
            username=admin.user.username,
            password=password
        )

        if user is None:
            return Response(
                {
                    "success": False,
                    "message": "Invalid password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "success": True,
                "message": "Admin Login Successful",

                "access": str(refresh.access_token),
                "refresh": str(refresh),

                "admin": {
                    "id": admin.id,
                    "name": admin.name,
                    "email": admin.email,
                    "phone": admin.phone
                }
            },
            status=status.HTTP_200_OK
        )
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User


class ForgotPasswordView(APIView):

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response(
                {
                    "success": False,
                    "message": "Email is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            student = Student.objects.get(email=email)

        except Student.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "No student found with this email."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        user = student.user

        if user is None:
            return Response(
                {
                    "success": False,
                    "message": "Student account is not connected to a login account."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        token = default_token_generator.make_token(user)

        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        reset_link = (
            f"http://localhost:5173/reset-password/{uid}/{token}"
        )

        print("\n====================================")
        print("PASSWORD RESET LINK")
        print(reset_link)
        print("====================================\n")

        return Response(
            {
                "success": True,
                "message": "Password reset link generated successfully.",
                "reset_link": reset_link
            },
            status=status.HTTP_200_OK
        )


class ResetPasswordView(APIView):

    def post(self, request):

        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not uid or not token or not new_password:
            return Response(
                {
                    "success": False,
                    "message": "UID, token and new password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {
                    "success": False,
                    "message": "Password must be at least 8 characters."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {
                    "success": False,
                    "message": "Invalid reset link."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {
                    "success": False,
                    "message": "Reset link is invalid or expired."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {
                "success": True,
                "message": "Password reset successfully. You can now login."
            },
            status=status.HTTP_200_OK
        )