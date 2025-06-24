# 📄 Resume Scanner AI (Claude-powered)

A full-stack AI-powered resume scanner that gives instant feedback using Claude 3 (via OpenRouter). Built with MERN + Bootstrap + AI APIs.

---

## 🔍 Features

- Paste resume text (from any domain)
- Get:
  - 3-line summary
  - Key strengths
  - Areas to improve
  - Suggested job roles
- Built with Claude 3 Haiku via OpenRouter API

---

## 🛠 Tech Stack

| Layer       | Tools                        |
|-------------|------------------------------|
| Frontend    | React, Vite, Bootstrap, Axios |
| Backend     | Node.js, Express, dotenv, Axios |
| AI API      | Claude 3 via OpenRouter.ai    |
| DevOps      | Docker, GitHub Actions        |
| Deployment  | Vercel (frontend), Render (backend)

---

## ⚙️ Local Setup

### Backend

```bash
cd backend
npm install
touch .env
# Add your OpenRouter API key:
OPENROUTER_API_KEY=sk-...
npm start

```

### Frontend
```bash

cd frontend
npm install
npm run dev
```
---
## 📦 Deployment (Docker + CI/CD)
Docker (Local)

### Backend
```bash
cd backend
docker build -t resume-backend .
docker run -p 5000:5000 resume-backend
```
### Frontend
```bash
cd frontend
docker build -t resume-frontend .
docker run -p 5173:4173 resume-frontend
```
CI/CD
GitHub Actions runs tests & builds on every push

## Deploy using:

✅ Render (backend Docker)

✅ Vercel (frontend auto-deploy)

## 👨‍💻 Author
Name: Vidhyasagar Myana

GitHub: https://github.com/1Vidhyasagar
