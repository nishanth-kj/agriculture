# Installation

## Prerequisites

- Docker + Docker Compose (for container setup), or
- Python 3.12+ and Node.js 18+ (for manual setup)

## Docker Setup

```bash
git clone https://github.com/nishanth-kj/agriculture.git
cd agriculture
docker-compose up --build
```

Services:
- Web: `http://localhost:3000`
- API: `http://localhost:8000`

Stop:

```bash
docker-compose down
```

## Manual Setup

### Backend

```bash
cd api
uv sync
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd web
npm install
npm run dev
```

## Environment Setup

### `api/.env`

```env
GEMINI_API_KEY=replace_with_gemini_key
SECRET_KEY=replace_with_django_secret
DEBUG=True
```

### `web/.env.local`

```env
DATABASE_URL=
API_URL=http://localhost:8000
JWT_SECRET=replace_with_a_strong_secret
GEMINI_API_KEY=replace_with_gemini_key
NEXT_PUBLIC_DATA_GOV_API_KEY=replace_with_data_gov_api_key
```
