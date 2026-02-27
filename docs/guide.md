# AgriTech Project Documentation

Welcome to the AgriTech documentation. This directory contains detailed guides for developers and contributors.

## Documentation Contents

- **[Installation Guide](installation.md)**: Setting up the project using Docker or manual installation for backend and frontend.
- **[API Reference](api.md)**: REST API endpoints, request/response formats, and examples.
- **[Contributing](../web/app/contribution/page.tsx)**: Guidelines for contributing code (see the Contribution page on the website).

## Project Overview

AgriTech is an AI-powered agriculture platform with three modules:

| Module | Directory | Technology |
|--------|-----------|------------|
| Backend API | `api/` | Django 5, Django REST Framework, Python 3.12 |
| Web Dashboard | `web/` | Next.js 15, React 18, TypeScript |
| Mobile App | `mobile/` | Android (Kotlin/Java, Gradle) |

### Capabilities

- **Crop and Fertilizer Prediction**: Random Forest models for optimal recommendations.
- **Crop Yield Prediction**: Regional yield estimation.
- **Pest and Disease Detection**: CNN-based image analysis.
- **Soil Health Monitoring**: Real-time soil parameter analysis.
- **AI Chatbot**: Conversational assistant powered by Google Gemini and LangChain.

### Architecture

- **Backend**: Django REST Framework (Python 3.12), Google Gemini API
- **Frontend**: Next.js 15 (React 18 / TypeScript), Tailwind CSS, Radix UI / shadcn/ui
- **Database**: SQLite (development), Prisma ORM (frontend), PostgreSQL (production)
- **ML Engine**: Scikit-Learn, TensorFlow, PyTorch, Google Gemini
- **Auth**: JWT-based authentication with Prisma user store
- **DevOps**: Docker Compose, Dockerfiles for API and Web

## Links

- [GitHub Repository](https://github.com/nishanth-kj/agriculture)
- [Installation Guide](installation.md)
- [API Reference](api.md)
