## Project Scope & Disclaimer

This repository showcases the design and implementation of a telemedicine web application developed as part of an academic project.

The primary focus of this project is backend development, REST API design, database modeling, and understanding system architecture concepts. 
Advanced or production-level components (such as fully trained ML models, secrets, and deployment configurations) are intentionally simplified or excluded.


# HealthConnect – Telemedicine Web Application (Academic Project)


**Timeline:** Oct 2024 – Apr 2025  
**Stack:** React, Node.js, Python, PostgreSQL, TensorFlow, Redis, JWT, Docker, GitHub Actions, Microservices, AWS-ready

## Architecture
- Microservices: `user-service` (auth/users), `appointment-service` (appointments), `ml-service` (TensorFlow FastAPI).
- DB: PostgreSQL (UUIDs via pgcrypto).
- Cache: Redis (metrics and appointment list caching).
- Auth: JWT (middleware in services).
- Frontend: React + Vite with lazy loading.
- CI/CD: GitHub Actions workflow (`.github/workflows/deploy.yml`).
- Docker: `docker-compose.yml` orchestrates all services.

## Run locally
```bash
docker compose up --build
```
Services:
- Frontend: http://localhost:3000
- User Service: http://localhost:4001
- Appointment Service: http://localhost:4002
- ML Service: http://localhost:5000
- Postgres: localhost:5432 (hc_user/hc_password, db=healthconnect)
- Redis: localhost:6379

## APIs
- `POST /api/auth/register` → { email, password, role, fullName }
- `POST /api/auth/login` → returns JWT
- `GET /api/appointments` (JWT) → role-aware list
- `POST /api/appointments` (JWT) → create

## ML Service
`POST /predict` with `{ "symptoms": ["fever","cough"] }` → mock prognosis + confidence.  
If a real Keras model is placed at `services/ml-service/model/model.h5`, it will attempt to load at startup.

## Notes
- Secrets controlled via env in `docker-compose.yml`.
- Schema auto-applied from `db/schema.sql` on first Postgres start.
