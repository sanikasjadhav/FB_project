from django.contrib import admin
from django.urls import path


from .views import (
    AdminListCreateView,
    AdminDetailView,
    AdminLoginView,
    AdminForgotPasswordView,
    AdminVerifyOTPView,
    AdminResetPasswordView,

    StudentListCreateView,
    StudentDetailView,
    StudentRegisterView,
    StudentLoginView,
    ForgotPasswordView,
    ResetPasswordView,
    VerifyOTPView,
    StudentPaymentsView,

    CategoryListCreateView,
    CategoryDetailView,

    CourseListCreateView,
    CourseDetailView,

    BatchListCreateView,
    BatchDetailView,

    EnrollmentListCreateView,
    EnrollmentDetailView,

    PaymentListCreateView,
    PaymentDetailView,

    CreateRazorpayOrderView,
    VerifyRazorpayPaymentView,

    CourseVideoListCreateView,
    CourseVideoDetailView,

    StudyMaterialListCreateView,
    StudyMaterialDetailView,

    CertificateListCreateView,
    CertificateDetailView,

    FeedbackListCreateView,
    FeedbackDetailView,

    GalleryListCreateView,
    GalleryDetailView,

    ContactUsListCreateView,
    ContactUsDetailView,
)
urlpatterns = [
    # Admin
    # Admin
    path(
        "admins/",
        AdminListCreateView.as_view(),
        name="admin-list"
    ),

    path(
        "admins/<int:pk>/",
        AdminDetailView.as_view(),
        name="admin-detail"
    ),

    path(
        "admin-login/",
        AdminLoginView.as_view(),
        name="admin-login"
    ),
    path("admin-forgot-password/", AdminForgotPasswordView.as_view()),
    path("admin-verify-otp/", AdminVerifyOTPView.as_view()),
    path("admin-reset-password/", AdminResetPasswordView.as_view()),
    # Student
    path("register/",StudentRegisterView.as_view(),name="student-register"),
    path("login/", StudentLoginView.as_view(), name="student-login"),
    path("forgot-password/",ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/",ResetPasswordView.as_view(),name="reset-password"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
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
        path(
            "student-payments/",
            StudentPaymentsView.as_view(),
            name="student-payments"
        ),     path(
        "create-razorpay-order/",
        CreateRazorpayOrderView.as_view(),
        name="create-razorpay-order"
    ),

    path(
        "verify-razorpay-payment/",
        VerifyRazorpayPaymentView.as_view(),
        name="verify-razorpay-payment"
    ),
    
    # Payment
    path("payments/", PaymentListCreateView.as_view(), name="payment-list"),
    path("payments/<int:pk>/", PaymentDetailView.as_view(), name="payment-detail"),

    # Course Video
    path(
        "course-videos/",
        CourseVideoListCreateView.as_view(),
        name="course-videos"
    ),

    path(
        "course-videos/<int:pk>/",
        CourseVideoDetailView.as_view(),
        name="course-video-detail"
    ),

    # Study Material
    path(
    "study-materials/",
    StudyMaterialListCreateView.as_view(),
    ),

    path(
        "study-materials/<int:pk>/",
        StudyMaterialDetailView.as_view(),
    ),
    # Certificate
    path("certificates/", CertificateListCreateView.as_view(), name="certificate-list"),
    path("certificates/<int:pk>/", CertificateDetailView.as_view(), name="certificate-detail"),

    # Feedback
    path("feedback/", FeedbackListCreateView.as_view(), name="feedback-list"),
    path("feedback/<int:pk>/", FeedbackDetailView.as_view(), name="feedback-detail"),

    # Gallery
    path("gallery/", GalleryListCreateView.as_view(), name="gallery-list"),
    path("gallery/<int:pk>/", GalleryDetailView.as_view(), name="gallery-detail"),

    # Contact Us
    path("contacts/", ContactUsListCreateView.as_view(), name="contact-list"),
    path("contacts/<int:pk>/", ContactUsDetailView.as_view(), name="contact-detail"),
]

# =========================================================
# MEDIA FILES
# =========================================================

