from django.urls import path
from crop_rf import views

urlpatterns = [
    path('crop-rf/', views.index, name='crop_fertilizer_index'),
    path('api/crop-rf/', views.CropFertilizerPredictAPI.as_view(), name='predict_crop_fertilizer'),
]
# Compare this snippet from CropRF/views.py:    