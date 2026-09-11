from django.contrib import admin

from .models import (
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


admin.site.register(Admin)
admin.site.register(Student)
admin.site.register(Category)
admin.site.register(Course)
admin.site.register(Batch)
admin.site.register(Enrollment)
admin.site.register(Payment)
admin.site.register(CourseVideo)
admin.site.register(StudyMaterial)
admin.site.register(Certificate)
admin.site.register(Feedback)
admin.site.register(Gallery)
admin.site.register(ContactUs)