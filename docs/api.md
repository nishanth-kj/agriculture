# API Documentation

AgriTech provides a RESTful API to expose its Machine Learning capabilities.

**Base URL**: `http://localhost:8000`

---

## 🔐 Authentication

Authentication is handled via **JSON Web Tokens (JWT)**.

-   **Public Endpoints**: Most prediction endpoints (like Crop/Fertilizer recommendation) are open for demonstration.
-   **Protected Endpoints**: User data and history endpoints require a valid Bearer Token.

**Header Format**:
```http
Authorization: Bearer <your_access_token>
```

---

## 🌾 Crop & Fertilizer Recommendation

Predicts the most suitable crop and fertilizer based on soil and environmental conditions.

- **Endpoint**: `/api/crop-rf/`
- **Method**: `POST`
- **Authentication**: None (Public)

### Request Body

| Field | Type  | Description |
| :--- | :--- | :--- |
| `N` | `float` | Ratio of Nitrogen content in soil |
| `P` | `float` | Ratio of Phosphorous content in soil |
| `K` | `float` | Ratio of Potassium content in soil |
| `ph` | `float` | pH value of the soil |
| `temperature` | `float` | Temperature in degree Celsius (Optional, often auto-fetched) |
| `humidity` | `float` | Relative humidity in % (Optional) |
| `rainfall` | `float` | Rainfall in mm (Optional) |

**Example JSON:**
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "ph": 6.5,
  "temperature": 20.8,
  "humidity": 82.0,
  "rainfall": 202.9
}
```

### Response

```json
{
    "status": "success",
    "data": {
        "predicted_crop": "Rice",
        "recommended_fertilizer": "Urea",
        "confidence": 0.95
    }
}
```

---

## 📈 Yield Prediction

Estimates the crop yield (production per unit area).

- **Endpoint**: `/api/crop-yield/`
- **Method**: `POST`

### Request Body

```json
{
  "State_Name": "Karnataka",
  "District_Name": "Bagalkot",
  "Season": "Kharif",
  "Crop": "Maize",
  "Area": 1000.0
}
```

### Response

```json
{
    "prediction": 3500.50,
    "unit": "Quintals"
}
```

---

## 🐞 Pest & Disease Analysis

Analyzes plant leaf images to detect diseases or pests.

- **Endpoint**: `/api/prediction/pest-predict/`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### Request

- **file**: Binary image file (JPEG/PNG)

### Response

```json
{
    "result": "Corn Common Rust",
    "confidence": 0.98,
    "treatment": "Apply fungicide..."
}
```

---

## 🧪 Soil Health (IoT Integration)

*Note: This endpoint is often used by IoT devices.*

- **Endpoint**: `/api/soil-fertility/`
- **Method**: `GET` / `POST`

---

## Status Codes

- **200 OK**: Request successful.
- **400 Bad Request**: Invalid input data.
- **500 Internal Server Error**: ML Model failure or server issue.
