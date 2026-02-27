# AgriTech

AgriTech is an agriculture platform with:
- A Django API in `api/`
- A Next.js app in `web/`

## Repository Structure

- `api/`: backend services, ML inference, and prediction endpoints
- `web/`: frontend app and API routes
- `docs/`: setup and API documentation
- `mobile/`: mobile client resources

## Quick Start

### Option 1: Docker

```bash
docker-compose up --build
```

- Web: `http://localhost:3000`
- API: `http://localhost:8000`

### Option 2: Manual

Backend:

```bash
cd api
uv sync
python manage.py migrate
python manage.py runserver
```

Frontend:

```bash
cd web
npm install
npm run dev
```

## Environment Variables

### `web/.env.local`

```env
DATABASE_URL=
API_URL=http://localhost:8000
JWT_SECRET=replace_with_a_strong_secret
GEMINI_API_KEY=replace_with_gemini_key
NEXT_PUBLIC_DATA_GOV_API_KEY=replace_with_data_gov_api_key
```

### `api/.env`

```env
GEMINI_API_KEY=replace_with_gemini_key
SECRET_KEY=replace_with_django_secret
DEBUG=True
```

## Security Notes

- Do not commit real API keys, secrets, or tokens.
- Rotate any key that was previously committed.
- Use `.env` and `.env.local` for local configuration.

## Documentation

- Setup: `docs/installation.md`
- API: `docs/api.md`
- Overview: `docs/guide.md`
