
# AgriTech - AI Agriculture Platform

### Project Overview

AgriTech is a comprehensive agriculture-focused AI platform that combines a **Django** backend with a **Next.js 15** frontend. Our mission is to empower farmers with actionable insights derived from advanced machine learning and real-time data monitoring.

**Key capabilities include:**
- 🌱 **Crop & Fertilizer Prediction**: Suggests optimal crops and nutrients based on soil NPK values and pH.
- 🔬 **Soil Health Monitoring**: Analyzes soil quality to recommend improvements.
- 🐞 **Pest & Disease Detection**: Identifying plant diseases from images using computer vision.
- 📊 **Real-time Analytics**: Monitoring climate, market prices, and historical production data.

> [!NOTE]
> For detailed API documentation and developer guides, please see [docs/guide.md](docs/guide.md).

---

## 🚀 How It Works

AgriTech leverages a microservices-based architecture where the **Python/Django** backend handles complex ML inference (Random Forest, CNNs), while the **Next.js** frontend provides a responsive, user-friendly dashboard for farmers.

1.  **Data Collection**: IoT sensors and manual input collect soil and environmental data.
2.  **AI Inference**: Data is sent to the Python backend where trained models analyze it.
3.  **Actionable Insights**: The frontend displays easy-to-understand recommendations (e.g., "Grow Rice", "Apply Nitrogen").

---

## 🔗 Source Code

**GitHub Repository:** [https://github.com/nishanth-kj/agriculture](https://github.com/nishanth-kj/agriculture)

---

---

## Table of Contents

1. [Project Setup](#project-setup)
   - [Frontend Setup (Next.js)](#frontend-setup-nextjs)
   - [Backend Setup (Django)](#backend-setup-django)
2. [File Structure](#file-structure)
3. [Environment Variables](#environment-variables)
4. [Usage](#usage)
5. [API Endpoints](#api-endpoints)
6. [Features](#features)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

---

## Project Setup

### Frontend Setup (Next.js)

1. **Navigate to the frontend directory**:

   ```bash
   cd agri_frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

   The application should now be accessible at `http://localhost:3000`.

### Backend Setup (Django)

1. **Navigate to the backend directory**:

   ```bash
   cd agri_backend
   ```

2. **Create and activate a virtual environment**:

   ```bash
   python -m venv env
   source env/bin/activate    
   # On Windows, use 
   env\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the database** (PostgreSQL recommended):

   - Configure the database in `settings.py`.
   - Run migrations:
     ```bash
     python manage.py migrate
     ```

5. **Run the development server**:

   ```bash
   python manage.py runserver
   ```

   The backend API should now be available at `http://localhost:8000`.

---

## File Structure

### Frontend (Next.js 15)

```
agri_frontend/
├── app/
│   ├── layout.js                   # Root layout component for consistent styling
│   ├── page.js                     # Landing page component
│   ├── dashboard/
│   │   ├── page.js                 # Dashboard home page
│   ├── crop-prediction/
│   │   ├── page.js                 # Crop Prediction page
│   ├── soil-health/
│   │   ├── page.js                 # Soil Health page
│   ├── pest-prediction/
│   │   ├── page.js                 # Pest Prediction page
│   ├── real-time-monitoring/
│   │   ├── climate-history.js       # Climate History page
│   │   ├── price-history.js         # Price History page
│   │   ├── production.js            # Production page
│   ├── managing/
│   │   ├── camera.js                # Camera monitoring page
│   │   ├── stocks-works.js          # Stocks and Works management
│   │   ├── labourer.js              # Labour management
├── components/
│   ├── Sidebar.js                  # Sidebar navigation component
│   ├── Header.js                   # Header component with user info and notifications
│   ├── Card.js                     # Reusable card component for dashboard stats
│   ├── CropHealthMap.js            # Map component for crop health visualization
│   ├── AlertCard.js                # Component for displaying individual alerts
│   ├── Gauge.js                    # Gauge chart for soil and weather metrics
│   └── Chart.js                    # Reusable chart component for analytics pages
├── styles/
│   ├── globals.css                 # Global CSS for styling
├── public/                         # Static assets (images, icons, etc.)
│   ├── logo.png                    # Logo image
│   ├── favicon.ico                 # Favicon
├── .env.local                      # Environment variables (API base URL, etc.)
├── next.config.js                  # Next.js configuration file
├── tailwind.config.js              # Tailwind CSS configuration (if using Tailwind)
├── package.json                    # Node dependencies and scripts
└── README.md                       # Project overview and instructions
```

### Backend (Django)

```
agri_backend/
├── agri_backend/                   # Root Django project directory
│   ├── settings.py                 # Django settings, including REST framework and database setup
│   ├── urls.py                     # Root URL configurations
│   ├── wsgi.py                     # WSGI configuration for deployment
│   └── asgi.py                     # ASGI configuration for async support
├── crop_yield/                 # Crop yield prediction app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── soil_fertility/             # Soil fertility app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── crop_rf/                    # Crop Random Forest app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── training/                   # Model training app
│   └── TrainFineModel.py
├── predictor/                  # Predictor app
│   └── ...
├── manage.py                       # Django management script
├── .env                            # Environment variables (e.g., SECRET_KEY, DB settings)
└── requirements.txt                # Backend dependencies
```

---

## Environment Variables

### Frontend (`.env.local`)

```plaintext
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Backend (`.env`)

```plaintext
SECRET_KEY=your_secret_key
DEBUG=True
DATABASE_URL=postgres://username:password@localhost:5432/dbname
ALLOWED_HOSTS=localhost
```

---

## Usage

1. **Access the Dashboard**:

   - After login, users can view crop health summaries, soil data, and weather insights.

2. **Explore Features**:
   - **Crop Prediction**: AI-driven suggestions for optimal crop selection based on soil and climate data.
   - **Soil Health Monitoring**: Real-time soil health analysis via IoT sensors.
   - **Pest Prediction**: Predictive insights on pest risks for proactive management.
   - **Climate & Price History Monitoring**: Historical data on climate and market prices for informed decision-making.
   - **Production Tracking**: Records of past and current production levels.
   - **Management Tools**:
     - **Camera Monitoring**: Real-time visuals for remote monitoring.
     - **Stocks and Works**: Inventory and work tracking.
     - **Labour Management**: Track laborer assignments and productivity.

---

## API Endpoints

### Authentication

- `POST /api/auth/login/`: User login
- `POST /api/auth/register/`: User registration
- `POST /api/auth/logout/`: User logout

### Crop Prediction

- `GET /api/crop-prediction/`: Get crop prediction data
- `POST /api/crop-prediction/`: Submit data for crop prediction

### Soil Health Monitoring

- `GET /api/soil-health/`: Get soil health data
- `POST /api/soil-health/monitor/`: Upload soil monitoring data

### Pest Prediction

- `GET /api/pest-prediction/`: Get pest prediction data

### Real-Time Monitoring

- `GET /api/climate-history/`: Access climate history data
- `GET /api/price-history/`: Access price history data
- `GET /api/production/`: Access production data

### Managing

- `GET /api/camera/`: Access camera monitoring data
- `GET /api/stocks-works/`: Access stock and work data
- `GET /api/labourer/`: Access labour management data

---

##

Features

1. **Generative AI-Driven Crop Prediction**: AI-based crop prediction for optimal yield.
2. **Real-Time Monitoring**: IoT-powered monitoring for soil health, climate, and prices.
3. **Pest Prediction**: AI-generated insights on pest risks to minimize crop losses.
4. **Camera and Stock Management**: Tools for managing inventory and remote monitoring.
5. **User-Friendly Interface**: Simplified dashboard for farmers to access critical insights.

---

## Testing

### Frontend Testing

1. **Unit Tests**: Write unit tests for components in the `components/` directory.
2. **Integration Tests**: Test data fetching and API integrations using Jest or React Testing Library.

   ```bash
   npm test
   ```

### Backend Testing

1. **Unit Tests**: Write tests for each Django view and model.
2. **Run Tests**:

   ```bash
   python manage.py test
   ```

---

## Deployment

### Frontend Deployment

- Deploy on **Vercel** or **Netlify** for seamless Next.js support.

### Backend Deployment

- Deploy using **Render**, **Docker**, or **AWS Elastic Beanstalk**.
- Set up PostgreSQL in the cloud for database management.

---

## Contributing

Contributions are welcome! Follow the setup instructions and submit a pull request with a description of your changes.

---

## License

This project is licensed under the MIT License:

```
# The MIT License (Modified)


Copyright (c) <2024> AgriTech

Permission is hereby granted to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software subject to the following conditions:

1. Non-Commercial Use: Individuals, educational institutions, and non-profit organizations may use, copy, modify, and distribute the Software free of charge for non-commercial purposes.

2. Commercial Use: Any commercial entity wishing to use the Software in a revenue-generating capacity must obtain a commercial license from the copyright holder and pay the associated licensing fee. Commercial use includes, but is not limited to, any activity that generates revenue, whether directly or indirectly, from the use of the Software.

3. Attribution: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
