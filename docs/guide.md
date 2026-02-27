# AgriTech Documentation Guide

This directory contains project documentation for contributors and maintainers.

## Contents

- [Installation](installation.md)
- [API Reference](api.md)

## Stack

- Backend: Django + Django REST Framework
- Frontend: Next.js + TypeScript
- Database: SQLite (default dev), PostgreSQL (optional)
- ML: scikit-learn, TensorFlow/PyTorch (project-dependent modules)

## Security

- Keep all keys/secrets in environment files.
- Never hardcode secrets in source code.
- Rotate keys immediately if they are exposed.
