from django.urls import path
from soil_fertility.views import predict_soil_view, SoilFertilityPredictAPI

urlpatterns = [
    path('soil/', predict_soil_view, name='soil_predict_form'),
    path('api/soil-fertility/', SoilFertilityPredictAPI.as_view(), name='predict_soil_fertility'),
]
