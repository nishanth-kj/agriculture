from django.urls import path
from crop_yield import views

urlpatterns = [
    # path('', views.index, name='index'),
    path("crop-yield/", views.index , name="crop_yield_form"),
    path('api/crop-yield/', views.CropYieldAPIView.as_view(), name="crop-yield-api"),
]
