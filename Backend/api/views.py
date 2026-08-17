from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache

import random

from rest_framework_simplejwt.tokens import RefreshToken
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

        # IMPORTANT:
        # Search ONLY in Admin table
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

        # Check Admin has Django User account
        if admin.user is None:
            return Response(
                {
                    "success": False,
                    "message": "Admin account is not connected to a login account."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Authenticate Admin's Django User
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

        # Check account is active
        if not user.is_active:
            return Response(
                {
                    "success": False,
                    "message": "Admin account is inactive."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate JWT
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
# ---------------- Student Forgot Password - OTP ----------------

# =========================================================
# STUDENT FORGOT PASSWORD - SEND OTP
# =========================================================

# ==============================
# FORGOT PASSWORD - SEND OTP
# ==============================

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

        # Generate 6 digit OTP
        otp = str(random.randint(100000, 999999))

        # Store OTP for 5 minutes
        cache.set(
            f"password_otp_{email}",
            otp,
            timeout=300
        )

        # Store email temporarily
        cache.set(
            f"password_reset_email_{email}",
            email,
            timeout=300
        )

        # Send OTP
        send_mail(
            "Fashion Boutique - Password Reset OTP",

            f"""Hello {user.first_name},

                Your Fashion Boutique password reset OTP is:

                {otp}

                This OTP is valid for 5 minutes.

                If you did not request a password reset, please ignore this email.

                Regards,
                Fashion Boutique
                """,

            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response(
            {
                "success": True,
                "message": "OTP sent successfully to your email."
            },
            status=status.HTTP_200_OK
        )
# =========================================================
# STUDENT FORGOT PASSWORD - VERIFY OTP
# =========================================================

# ==============================
# VERIFY OTP
# ==============================

class VerifyOTPView(APIView):

    def post(self, request):

        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response(
                {
                    "success": False,
                    "message": "Email and OTP are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        saved_otp = cache.get(f"password_otp_{email}")

        if saved_otp is None:
            return Response(
                {
                    "success": False,
                    "message": "OTP expired. Please request a new OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(otp) != str(saved_otp):
            return Response(
                {
                    "success": False,
                    "message": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # OTP is correct
        cache.set(
            f"password_otp_verified_{email}",
            True,
            timeout=300
        )

        # Remove OTP so it cannot be reused
        cache.delete(f"password_otp_{email}")

        return Response(
            {
                "success": True,
                "message": "OTP verified successfully."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# STUDENT FORGOT PASSWORD - CHANGE PASSWORD
# =========================================================

# ==============================
# RESET PASSWORD
# ==============================

class ResetPasswordView(APIView):

    def post(self, request):

        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            return Response(
                {
                    "success": False,
                    "message": "Email and new password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check whether OTP was verified
        verified = cache.get(
            f"password_otp_verified_{email}"
        )

        if not verified:
            return Response(
                {
                    "success": False,
                    "message": "Please verify OTP first."
                },
                status=status.HTTP_403_FORBIDDEN
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
            student = Student.objects.get(email=email)

        except Student.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Student not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        user = student.user

        if user is None:
            return Response(
                {
                    "success": False,
                    "message": "Student login account not found."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Change password
        user.set_password(new_password)
        user.save()

        # Delete verification status
        cache.delete(
            f"password_otp_verified_{email}"
        )

        return Response(
            {
                "success": True,
                "message": "Password changed successfully. You can now login."
            },
            status=status.HTTP_200_OK
        )




class AdminForgotPasswordView(APIView):

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
            admin = Admin.objects.get(email=email)

        except Admin.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Admin account not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if admin.user is None:
            return Response(
                {
                    "success": False,
                    "message": "Admin account is not connected to a login account."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        otp = str(random.randint(100000, 999999))

        cache.set(
            f"admin_password_otp_{email}",
            otp,
            timeout=300
        )

        send_mail(
            "Fashion Boutique - Admin Password Reset OTP",

            f"""Hello {admin.name},

Your Fashion Boutique Admin password reset OTP is:

{otp}

This OTP is valid for 5 minutes.

If you did not request a password reset, please ignore this email.

Regards,
Fashion Boutique
""",

            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response(
            {
                "success": True,
                "message": "OTP sent successfully to your admin email."
            },
            status=status.HTTP_200_OK
        )



class AdminVerifyOTPView(APIView):

    def post(self, request):

        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response(
                {
                    "success": False,
                    "message": "Email and OTP are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        saved_otp = cache.get(
            f"admin_password_otp_{email}"
        )

        if saved_otp is None:
            return Response(
                {
                    "success": False,
                    "message": "OTP expired. Please request a new OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(otp) != str(saved_otp):
            return Response(
                {
                    "success": False,
                    "message": "Invalid OTP."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        cache.set(
            f"admin_password_otp_verified_{email}",
            True,
            timeout=300
        )

        cache.delete(
            f"admin_password_otp_{email}"
        )

        return Response(
            {
                "success": True,
                "message": "OTP verified successfully."
            },
            status=status.HTTP_200_OK
        )

class AdminResetPasswordView(APIView):

    def post(self, request):

        email = request.data.get("email")
        new_password = request.data.get("new_password")

        if not email or not new_password:
            return Response(
                {
                    "success": False,
                    "message": "Email and new password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        verified = cache.get(
            f"admin_password_otp_verified_{email}"
        )

        if not verified:
            return Response(
                {
                    "success": False,
                    "message": "Please verify OTP first."
                },
                status=status.HTTP_403_FORBIDDEN
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
            admin = Admin.objects.get(email=email)

        except Admin.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Admin account not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if admin.user is None:
            return Response(
                {
                    "success": False,
                    "message": "Admin login account not found."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        admin.user.set_password(new_password)
        admin.user.save()

        cache.delete(
            f"admin_password_otp_verified_{email}"
        )

        return Response(
            {
                "success": True,
                "message": "Admin password changed successfully."
            },
            status=status.HTTP_200_OK
        )