from django.http import JsonResponse
from .gpt_engine import generate_yield_prediction
import json

def predict_crop(request):
    if request.method == "POST":
        data = json.loads(request.body)
        crop = data.get("crop")
        season = data.get("season")
        state = data.get("state")
        area = data.get("area_hectares")
        soil = data.get("soil_health", {})

        # Build prompt
        prompt = (
            f"Crop: {crop}\n"
            f"Season: {season}\n"
            f"State: {state}\n"
            f"Area: {area} hectare\n"
            f"Soil Data: N={soil.get('N')}, P={soil.get('P')}, K={soil.get('K')}, pH={soil.get('pH')}, "
            f"EC={soil.get('EC')}, OC={soil.get('OC')}, S={soil.get('S')}, Zn={soil.get('Zn')}, "
            f"Fe={soil.get('Fe')}, Cu={soil.get('Cu')}, Mn={soil.get('Mn')}, B={soil.get('B')}.\n"
            f"What is the estimated crop yield, profit, and how to grow it?"
        )

        result = generate_yield_prediction(prompt)
        return JsonResponse({"response": result})
    return JsonResponse({"error": "POST request required."}, status=400)


# === API Views ===
from rest_framework.views import APIView
from utils.response import ApiResponse
from rest_framework import status
import os
from dotenv import load_dotenv
load_dotenv()
from .run import run
import json
import re

# === Django API View ===
class CropPredictionAPIView(APIView):
    def post(self, request):
        data = request.data

        crop = data.get("crop")
        season = data.get("season")
        state = data.get("state")
        area = data.get("area_hectares")
        custom_question = data.get("custom_question", "").strip()
        soil = data.get("soil_health", {})

        if not all([crop, season, state, area]):
            return ApiResponse.error("Missing required fields.")

        try:
            area = float(area)
            if area <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return ApiResponse.error("Area must be a positive number.")

        essential_keys = ["N", "P", "K", "pH", "EC", "OC", "S", "Zn", "Fe", "Cu", "Mn", "B"]
        default_soil = {key: 0 if key != "pH" else 7.0 for key in essential_keys}
        clean_soil = {key: soil.get(key, default_soil[key]) for key in essential_keys}

        prompt = (
            f"You are an expert agronomist AI.\n"
            f"Crop: {crop}\n"
            f"Season: {season}\n"
            f"State: {state}\n"
            f"Area: {area} hectares\n"
            f"Soil:\n" + "\n".join([f"- {k}: {v}" for k, v in clean_soil.items()]) + "\n\n"
        )

        if custom_question:
            prompt += f"User Question: {custom_question}\nAnswer briefly and precisely."
        else:
            prompt += (
                "Respond ONLY in this format:\n"
                "1. Yield/ha: <value>\n"
                "2. Total Yield: <value>\n"
                "3. Profitability: <short statement>\n"
                "4. Techniques: <short list>\n"
                "Be concise. Do not repeat the input or add extra explanation."
            )

        try:
            #response_text = generate_yield_prediction(prompt)
            response_text = run(prompt) 
            print("\n=== Prompt Sent to Gemini ===\n", prompt)
            print("\n=== Gemini Response ===\n", response_text)
        except Exception as e:
            return ApiResponse.error(str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return ApiResponse.success({"response": response_text})

class PestPredictionAPIView(APIView):
    def post(self, request):
        data = request.data
        message = data.get("message")
        crop_type = data.get("cropType")
        location = data.get("location")
        observed_symptoms = data.get("observedSymptoms", [])
        growth_stage = data.get("growthStage")
        weather = data.get("weather")

        if not message or not message.strip():
             return ApiResponse.error("Description of the problem is required")

        if not crop_type or not crop_type.strip():
             return ApiResponse.error("Crop type is required")
             
        if not location or not location.strip():
             return ApiResponse.error("Location is required")

        prompt = (
            f"You are AgriPestExpert 🐛🔍, an AI for predicting agricultural pests and offering treatment.\n\n"
            f"Context:\n"
            f"- Crop: {crop_type}\n"
            f"- Location: {location}\n"
            f"{f'- Growth Stage: {growth_stage}' if growth_stage else ''}\n"
            f"{f'- Weather: {weather}' if weather else ''}\n"
            f"{f'- Observed Symptoms: {', '.join(observed_symptoms)}' if observed_symptoms else ''}\n\n"
            f"User says: \"{message}\"\n\n"
            f"Respond ONLY in JSON format, no extra explanation.\n"
            f"Format:\n"
            f"{{\n"
            f"  \"prediction\": \"Example Pest Name\",\n"
            f"  \"confidenceLevel\": \"High\",\n"
            f"  \"preventionMethods\": [\"method1\", \"method2\", \"method3\"],\n"
            f"  \"treatmentOptions\": [\"treatment1\", \"treatment2\"]\n"
            f"}}\n"
        )
        
        try:
             # Using the same run function or direct model access
             response_text = run(prompt)
             print("\n=== Pest Prompt Sent ===\n", prompt)
             print("\n=== Gemini Response ===\n", response_text)
             
             try:
                 # Extract JSON block if run() returns markdown
                 match = re.search(r'\{[\s\S]*?\}', response_text)
                 if match:
                     json_str = match.group(0)
                     parsed_data = json.loads(json_str)
                     return ApiResponse.success(parsed_data)
                 else:
                     return ApiResponse.error("Failed to parse AI response")
                     
             except json.JSONDecodeError:
                 return ApiResponse.error("Invalid JSON from AI model")

        except Exception as e:
             return ApiResponse.error(str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
