from django.urls import path
from .views import (
    AdminListCreateView, AdminDetailView,
    StudentListCreateView, StudentDetailView,
    CategoryListCreateView, CategoryDetailView,
    CourseListCreateView, CourseDetailView,
    BatchListCreateView, BatchDetailView,
    EnrollmentListCreateView, EnrollmentDetailView,
    PaymentListCreateView, PaymentDetailView,
    CourseVideoListCreateView, CourseVideoDetailView,
    StudyMaterialListCreateView, StudyMaterialDetailView,
    CertificateListCreateView, CertificateDetailView,
    FeedbackListCreateView, FeedbackDetailView,
    GalleryListCreateView, GalleryDetailView,
    ContactUsListCreateView, ContactUsDetailView,
)
from .views import StudentLoginView

urlpatterns = [
    # Admin
    path("admins/", AdminListCreateView.as_view(), name="admin-list"),
    path("admins/<int:pk>/", AdminDetailView.as_view(), name="admin-detail"),

    # Student
    path("login/", StudentLoginView.as_view(), name="student-login"),
    path("students/", StudentListCreateView.as_view(), name="student-list"),
    path("students/<int:pk>/", StudentDetailView.as_view(), name="student-detail"),

    # Category
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),

    # Course
    path("courses/", CourseListCreateView.as_view(), name="course-list"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),

    # Batch
    path("batches/", BatchListCreateView.as_view(), name="batch-list"),
    path("batches/<int:pk>/", BatchDetailView.as_view(), name="batch-detail"),

    # Enrollment
    path("enrollments/", EnrollmentListCreateView.as_view(), name="enrollment-list"),
    path("enrollments/<int:pk>/", EnrollmentDetailView.as_view(), name="enrollment-detail"),

    # Payment
    path("payments/", PaymentListCreateView.as_view(), name="payment-list"),
    path("payments/<int:pk>/", PaymentDetailView.as_view(), name="payment-detail"),

    # Course Video
    path("videos/", CourseVideoListCreateView.as_view(), name="video-list"),
    path("videos/<int:pk>/", CourseVideoDetailView.as_view(), name="video-detail"),

    # Study Material
    path("materials/", StudyMaterialListCreateView.as_view(), name="material-list"),
    path("materials/<int:pk>/", StudyMaterialDetailView.as_view(), name="material-detail"),

    # Certificate
    path("certificates/", CertificateListCreateView.as_view(), name="certificate-list"),
    path("certificates/<int:pk>/", CertificateDetailView.as_view(), name="certificate-detail"),

    # Feedback
    path("feedbacks/", FeedbackListCreateView.as_view(), name="feedback-list"),
    path("feedbacks/<int:pk>/", FeedbackDetailView.as_view(), name="feedback-detail"),

    # Gallery
    path("gallery/", GalleryListCreateView.as_view(), name="gallery-list"),
    path("gallery/<int:pk>/", GalleryDetailView.as_view(), name="gallery-detail"),

    # Contact Us
    path("contacts/", ContactUsListCreateView.as_view(), name="contact-list"),
    path("contacts/<int:pk>/", ContactUsDetailView.as_view(), name="contact-detail"),
]