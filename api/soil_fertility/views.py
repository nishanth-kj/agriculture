import requests
from django.conf import settings
from django.shortcuts import render

FIELDS = ["N", "P", "K", "pH", "EC", "OC", "S", "Zn", "Fe", "Cu", "Mn", "B"]

def predict_soil_view(request):
    result = None
    if request.method == "POST":
        form_data = {field: float(request.POST.get(field)) for field in FIELDS}
        try:
            soil_api_url = settings.BASE_API_URL + "/api/soil/"
            response = requests.post(soil_api_url, json=form_data)
            if response.status_code == 200:
                result = response.json()
            else:
                result = {"fertility_class": "Error", "confidence": 0}
        except Exception as e:
            result = {"fertility_class": str(e), "confidence": 0}

    return render(request, "SoilFertility/index.html", {"fields": FIELDS, "result": result})

# === API Views ===
import os
import numpy as np
from rest_framework.views import APIView
from utils.response import ApiResponse
from rest_framework import status
from soil_fertility.serializers import SoilDataSerializer
from sklearn.preprocessing import StandardScaler
from utils.models import ModelService

# Load model
# Adjusted path: from '..' to '.' since file is moving up one level
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'static', 'Models', 'soil_fertility_dl_model.h5')
# Dummy scaler (you should load from joblib/pkl if saved)
scaler = StandardScaler()

# Simulate fitted scaler for inference (replace with joblib.load in real projects)
def fit_scaler_for_now():
    from pandas import read_csv
    # Path relative to project root, should be fine
    try:
        df = read_csv('soil_fertility/static/DataSets/Soil Fertility Data (Modified Data).csv')
        X = df.drop(columns=['fertility'])
        scaler.fit(X)
    except Exception as e:
        print(f"Warning: Could not fit scaler: {e}")

fit_scaler_for_now()

# Map prediction index to label
fertility_map = {0: "Less Fertile", 1: "Fertile", 2: "Highly Fertile"}

class SoilFertilityPredictAPI(APIView):
    def post(self, request):
        serializer = SoilDataSerializer(data=request.data)
        if serializer.is_valid():
            try:
                input_data = np.array([[serializer.validated_data[key] for key in serializer.fields]])
                scaled = scaler.transform(input_data)
                
                model = ModelService.get_model('soil_model', MODEL_PATH, loader_type='keras')
                prediction = model.predict(scaled)
                predicted_class = np.argmax(prediction, axis=1)[0]
                return ApiResponse.success({
                    "fertility_class": fertility_map.get(predicted_class, "Unknown"),
                    "confidence": float(np.max(prediction))
                })
            except Exception as e:
                return ApiResponse.error(str(e), status_code=500)
        return ApiResponse.error("Validation failed", errors=serializer.errors)
