# Installation & Setup Guide

This guide covers the installation process for the AgriTech platform. You can choose between a **Docker-based setup (recommended)** or a **Manual setup**.

## Prerequisites

- **Git**: For cloning the repository.
- **Docker & Docker Compose** (for Docker setup).
- **Python 3.12+** (for manual backend setup).
- **Node.js 18+** & **npm** (for manual frontend setup).

---

## 🐳 Docker Setup (Recommended)

The easiest way to get AgriTech running is using Docker. This handles the database, backend, and frontend containers automatically.

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
    - **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
    - **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
    - **API Documentation**: [http://localhost:8000/docs/](http://localhost:8000/docs/) (if configured)

4.  **Stop Services**
    Press `Ctrl+C` or run:
    ```bash
    docker-compose down
    ```

---

## 🛠️ Manual Setup

If you prefer to run services individually or for development purposes without Docker.

### 1. Backend Setup (Django API)

The backend uses `uv` for fast package management, but standard `pip` works as well.

1.  **Navigate to the API Directory**
    ```bash
    cd api
    ```

2.  **Create Virtual Environment & Install Dependencies**
    Using `uv` (Recommended):
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
    Initialize the database:
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
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the `web` directory if it doesn't exist:
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    ```

4.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

---

## 🔧 Troubleshooting

-   **Port Conflicts**: Ensure ports `3000` (Frontend) and `8000` (Backend) are free.
-   **Database Issues**: If using SQLite (default for dev), ensure the file permissions are correct. For PostgreSQL, check your `DATABASE_URL` in `.env`.
-   **Missing Models**: If you see errors about missing `.pkl` files, ensure you have run the model download scripts or that they are present in `api/crop_rf/static/models/`.
