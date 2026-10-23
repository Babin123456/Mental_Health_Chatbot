# Contributing to MindFul 🧠

Thank you for your interest in contributing to **MindFul**, an empathetic AI-powered mental health chatbot! Open-source contributions from developers, researchers, and mental health advocates are warmly welcomed.

---

## 📋 Code of Conduct

We are dedicated to providing a welcoming, inclusive, and harassment-free environment for everyone. Please treat all contributors and maintainers with kindness, respect, and constructive empathy.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance running on port 27017 or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Git**

### 2. Fork and Clone
```bash
# Fork the repository on GitHub, then clone your fork:
git clone https://github.com/<your-username>/Mental_Health_Chatbot.git
cd Mental_Health_Chatbot
```

### 3. Environment Setup
```bash
# Backend setup
cd Backend
cp .env.example .env
npm install

# Frontend setup
cd ../Frontend/vite-project
cp .env.example .env
npm install
```

### 4. Running the Development Environment
```bash
# Terminal 1: Backend
cd Backend
npm start

# Terminal 2: Frontend
cd Frontend/vite-project
npm run dev
```

Alternatively, run everything via Docker Compose:
```bash
docker-compose up --build
```

---

## 🌿 Branching Workflow

1. Always sync your local `main` branch before starting work:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create a focused, descriptive branch:
   ```bash
   # Use clean prefixes: feat/, fix/, docs/, refactor/, test/
   git checkout -b feat/your-feature-name
   ```
3. Keep changes isolated to the specific issue you are resolving.

---

## ✍️ Commit Conventions

Follow conventional commit formats:
- `feat: add crisis detection guardrails and emergency helpline resources`
- `fix: resolve jwt token verification crash in auth middleware`
- `docs: update installation instructions and environment variables`
- `refactor: extract reusable voice transcription service`

---

## 🧪 Pull Request Guidelines

Before submitting your PR:
- [ ] Code compiles without errors (`npm run build` in Frontend, `node -c` in Backend).
- [ ] No extraneous files or sensitive credentials committed.
- [ ] Provide a clear summary of changes and reference related issues (`Closes #12`).
- [ ] Ensure backward compatibility and clean code formatting.

---

## 💬 Community & Support

Have questions, suggestions, or bug reports? Please open an issue on GitHub.
