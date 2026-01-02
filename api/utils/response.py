from rest_framework.response import Response
from rest_framework import status

class ApiResponse:
    @staticmethod
    def success(data=None, message="Success", status_code=status.HTTP_200_OK):
        return Response({
            "status": 1,
            "message": message,
            "data": data,
            "error": None
        }, status=status_code)

    @staticmethod
    def error(message="An error occurred", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        return Response({
            "status": 0,
            "message": message,
            "data": None,
            "error": errors or message
        }, status=status_code)
