# Defer heavy imports
# import pandas as pd
from django.shortcuts import render
from django.conf import settings
import os
def index(request):
    import pandas as pd
    csv_path = os.path.join(settings.BASE_DIR, 'crop_yield', 'static', 'crop_yield', 'Datasets', 'crop_data.csv')
    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip().str.lower()
    crops = sorted(df['crop'].dropna().unique())
    seasons = sorted(df['season'].dropna().unique())
    states = sorted(df['state'].dropna().unique())
    print(crops)
    print(seasons)
    print(states)
    return render(request, 'CropYield/index.html', {
        'crops': crops,
        'seasons': seasons,
        'states': states,
    })
# import os
# import pandas as pd
# from django.conf import settings
# from django.shortcuts import render

#def crop_yield_form(request):
    # csv_path = os.path.join(
    #     settings.BASE_DIR,
    #     'CropYield', 'static', 'CropYield', 'Datasets', 'crop_data.csv'
    # )

    # try:
    #     df = pd.read_csv(csv_path)
    #     df.columns = df.columns.str.strip().str.lower()  # Normalize headers

    #     crops = sorted(df['crop'].dropna().unique())
    #     seasons = sorted(df['season'].dropna().unique())
    #     states = sorted(df['state'].dropna().unique())
    # except Exception as e:
    #     return render(request, 'CropYield/index.html', {
    #         'error': f"⚠️ CSV error: {e}",
    #         'crops': [],
    #         'seasons': [],
    #         'states': [],
    #     })

    # return render(request, 'CropYield/index.html', {
    #     'crops': crops,
    #     'seasons': seasons,
    #     'states': states,
    # })

# === API Views ===
from rest_framework.views import APIView
from utils.response import ApiResponse
from rest_framework import status
from crop_yield.serializers import CropPredictionSerializer
import os, pickle
from utils.models import ModelService

# === Load model and tools
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'crop_yield', 'static', 'crop_yield', 'models')


# ✅ DRF APIView
class CropYieldAPIView(APIView):
    def post(self, request):
        serializer = CropPredictionSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            try:
                model = ModelService.get_model('cropyield_model', os.path.join(MODEL_DIR, 'model.h5'), loader_type='keras')
                scaler = ModelService.get_model('cropyield_scaler', os.path.join(MODEL_DIR, 'scaler.pkl'))
                encoders = ModelService.get_model('cropyield_encoders', os.path.join(MODEL_DIR, 'encoders.pkl'))

                crop = data["crop"].strip().title()
                season = data["season"].strip().title()
                state = data["state"].strip().title()

                # Validate inputs
                if crop not in encoders["Crop"].classes_:
                    return ApiResponse.error(f"Unknown crop: {crop}")
                if season not in encoders["Season"].classes_:
                    return ApiResponse.error(f"Unknown season: {season}")
                if state not in encoders["State"].classes_:
                    return ApiResponse.error(f"Unknown state: {state}")

                # Encode and predict
                crop_enc = encoders["Crop"].transform([crop])[0]
                season_enc = encoders["Season"].transform([season])[0]
                state_enc = encoders["State"].transform([state])[0]

                input_data = [crop_enc, season_enc, state_enc,
                              data["area"], data["rainfall"],
                              data["fertilizer"], data["pesticide"]]

                import numpy as np
                scaled = scaler.transform([input_data])
                sequence_input = np.expand_dims([scaled[0]] * 3, axis=0)
                prediction = model.predict(sequence_input)[0][0]

                return ApiResponse.success({"predicted_yield": round(float(prediction), 4)})

            except Exception as e:
                return ApiResponse.error(str(e), status_code=500)
        return ApiResponse.error("Validation failed", errors=serializer.errors)
