from django.contrib import admin

# Register your models here.
from .models import *

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