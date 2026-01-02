from django.urls import path
from .views import predict_crop

from .views import CropPredictionAPIView, PestPredictionAPIView
urlpatterns = [
    path('predictor/', predict_crop),
    path('api/prediction/', CropPredictionAPIView.as_view(), name='predict-crop'),
    path('api/prediction/pest-predict/', PestPredictionAPIView.as_view(), name='predict-pest'),
]
