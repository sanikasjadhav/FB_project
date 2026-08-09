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



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from FB_project.models import Student


class StudentLoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {
                    "success": False,
                    "message": "Email and Password are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            student = Student.objects.get(email=email)

            if student.password == password:
                return Response(
                    {
                        "success": True,
                        "message": "Login Successful",
                        "student": {
                            "id": student.id,
                            "first_name": student.first_name,
                            "last_name": student.last_name,
                            "email": student.email,
                        },
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {
                    "success": False,
                    "message": "Invalid Password"
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        except Student.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "Email not found"
                },
                status=status.HTTP_404_NOT_FOUND,
            )