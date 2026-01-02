from django.shortcuts import render

# Create your views here.
import os
import pickle
import numpy as np
from django.shortcuts import render

# Set the base path for model files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'crop_rf', 'static', 'models')

# Load the models
try:
    nb_model = pickle.load(open(os.path.join(MODEL_PATH, 'naive_bayes_model.pkl'), 'rb'))
    rf_model = pickle.load(open(os.path.join(MODEL_PATH, 'random_forest_model.pkl'), 'rb'))
    print("✅ Models loaded successfully.")
except Exception as e:
    print("❌ Error loading models:", e)
    nb_model = None
    rf_model = None

# Crop and Fertilizer label mappings
crop_dict = {
    1: 'Rice', 2: 'Maize', 3: 'Jute', 4: 'Cotton', 5: 'Coconut',
    6: 'Papaya', 7: 'Orange', 8: 'Apple', 9: 'Muskmelon', 10: 'Watermelon',
    11: 'Grapes', 12: 'Mango', 13: 'Banana', 14: 'Pomegranate',
    15: 'Lentil', 16: 'Blackgram', 17: 'Mungbean', 18: 'Mothbeans',
    19: 'Pigeonpeas', 20: 'Kidneybeans', 21: 'Chickpea', 22: 'Coffee'
}

fertilizer_dict = {
    0: 'Urea', 1: 'DAP', 2: 'Fourteen-Thirty Five-Fourteen',
    3: 'Twenty Eight-Twenty Eight', 4: 'Seventeen-Seventeen-Seventeen',
    5: 'Twenty-Twenty', 6: 'Ten-Twenty Six-Twenty Six'
}

def index(request):
    context = {}
    
    if request.method == 'POST':
        try:
            N = float(request.POST['N'])
            P = float(request.POST['P'])
            K = float(request.POST['K'])
            temperature = float(request.POST['temperature'])
            humidity = float(request.POST['humidity'])
            ph = float(request.POST['ph'])
            rainfall = float(request.POST['rainfall'])

            crop_features = np.array([[N, P, K, ph]])
            fertilizer_features = np.array([[N, P, K, ph]])

            crop_prediction = nb_model.predict(crop_features)[0]
            fertilizer_prediction = rf_model.predict(fertilizer_features)[0]

            context['crop_prediction'] = crop_dict.get(crop_prediction, "Unknown Crop")
            context['fertilizer_prediction'] = fertilizer_dict.get(fertilizer_prediction, "Unknown Fertilizer")

        except Exception as e:
            context['error'] = f"Error in processing: {e}"

    return render(request, 'CropRF/index.html', context)


# === API Views ===
from rest_framework.views import APIView
from utils.response import ApiResponse
from crop_rf.serializers import PredictionInputSerializer
from utils.models import ModelService

class CropFertilizerPredictAPI(APIView):
    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                # Use ModelService as in the original API
                nb_model = ModelService.get_model('nb_model', os.path.join(MODEL_PATH, 'naive_bayes_model.pkl'))
                rf_model = ModelService.get_model('rf_model', os.path.join(MODEL_PATH, 'random_forest_model.pkl'))
                
                features = np.array([[data['N'], data['P'], data['K'], data['ph']]])
                crop_pred = nb_model.predict(features)[0]
                fertilizer_pred = rf_model.predict(features)[0]

                return ApiResponse.success({
                    'predicted_crop': crop_dict.get(crop_pred, 'Unknown Crop'),
                    'recommended_fertilizer': fertilizer_dict.get(fertilizer_pred, 'Unknown Fertilizer')
                })
            except Exception as e:
                return ApiResponse.error(str(e), status_code=500)
        return ApiResponse.error("Validation failed", errors=serializer.errors)
