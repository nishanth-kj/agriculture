# API Documentation

Base URL: `http://localhost:8000`

## Authentication

Authentication uses JWT for protected routes.

Header format:

```http
Authorization: Bearer <access_token>
```

## Crop and Fertilizer Recommendation

- Endpoint: `POST /api/crop-rf/`
- Auth: Public

Request body example:

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

Response example:

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

## Yield Prediction

- Endpoint: `POST /api/crop-yield/`

Request body example:

```json
{
  "State_Name": "Karnataka",
  "District_Name": "Bagalkot",
  "Season": "Kharif",
  "Crop": "Maize",
  "Area": 1000.0
}
```

## Pest and Disease Prediction

- Endpoint: `POST /api/prediction/pest-predict/`
- Content-Type: `multipart/form-data`
- Field: `file` (image)

## Soil Fertility

- Endpoint: `GET /api/soil-fertility/`
- Endpoint: `POST /api/soil-fertility/`

## Common Status Codes

- `200`: Success
- `400`: Invalid request
- `401`: Unauthorized
- `500`: Server error
