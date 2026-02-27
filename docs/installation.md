# Installation and Setup Guide

This guide covers the installation process for the AgriTech platform. You can choose between a Docker-based setup (recommended) or a manual setup.

## Prerequisites

- **Git**: For cloning the repository.
- **Docker and Docker Compose** (for Docker setup).
- **Python 3.12+** (for manual backend setup).
- **Node.js 18+** and **npm** (for manual frontend setup).

---

## Docker Setup (Recommended)

The easiest way to get AgriTech running is using Docker. This handles the backend and frontend containers automatically.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/nishanth-kj/agriculture.git
    cd agriculture
    ```

2.  **Build and Start Services**
    ```bash
    docker-compose up --build
    ```

3.  **Access the Application**
    - Frontend Dashboard: http://localhost:3000
    - Backend API: http://localhost:8000/api/
    - API Documentation: http://localhost:8000/docs/

4.  **Stop Services**
    Press `Ctrl+C` or run:
    ```bash
    docker-compose down
    ```

---

## Manual Setup

If you prefer to run services individually or for development purposes without Docker.

### 1. Backend Setup (Django API)

The backend uses `uv` for fast package management, but standard `pip` works as well.

1.  **Navigate to the API Directory**
    ```bash
    cd api
    ```

2.  **Create Virtual Environment and Install Dependencies**

    Using `uv` (recommended):
    ```bash
    pip install uv
    uv sync
    ```

    Using standard `pip`:
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Linux/Mac
    source venv/bin/activate

    pip install -r requirements.txt
    ```

3.  **Run Migrations**
    ```bash
    python manage.py migrate
    ```

4.  **Start the Server**
    ```bash
    python manage.py runserver
    ```
    The backend will be available at `http://localhost:8000`.

### 2. Frontend Setup (Next.js)

1.  **Navigate to the Web Directory**
    ```bash
    cd web
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the `web` directory from the template:
    ```bash
    cp .env.example .env
    ```

    Key variables:
    ```env
    DATABASE_URL=""                     # Prisma database connection string
    API_URL=http://localhost:8000       # Backend API base URL
    JWT_SECRET=your_jwt_secret          # Secret for JWT token signing
    ```

4.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`api/.env`)

Create an `.env` file from the template:
```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI prediction features |
| `SECRET_KEY` | Optional | Django secret key (has a default in settings.py) |
| `DEBUG` | Optional | Debug mode, defaults to True for development |

### Frontend (`web/.env`)

Create an `.env` file from the template:
```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Prisma database connection string |
| `API_URL` | Yes | Backend API base URL (e.g. `http://localhost:8000`) |
| `JWT_SECRET` | Yes | Secret for JWT token signing |

---

## Troubleshooting

-   **Port Conflicts**: Ensure ports `3000` (frontend) and `8000` (backend) are free.
-   **Database Issues**: If using SQLite (default for dev), ensure the file permissions are correct. For PostgreSQL, check your `DATABASE_URL` in `.env`.
-   **Missing Models**: If you see errors about missing `.pkl` files, ensure the model files are present in `api/crop_rf/static/models/`.
-   **Gemini API**: If AI prediction features fail, verify your `GEMINI_API_KEY` is set correctly in `api/.env`.
