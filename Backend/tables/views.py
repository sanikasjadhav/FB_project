from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api.serializers import StudentRegisterSerializer


class StudentRegisterView(APIView):

    def post(self, request):

        serializer = StudentRegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():

            student = serializer.save()

            return Response(
                {
                    "message": "Student registered successfully",

                    "student": {
                        "id": student.id,
                        "first_name": student.first_name,
                        "last_name": student.last_name,
                        "email": student.email
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )