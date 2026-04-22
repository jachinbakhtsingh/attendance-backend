# 📌 Attendance Management System (Backend)

## 🚀 Live API
https://attendance-backend-f2in.onrender.com/

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- PostgreSQL (Neon DB)
- JWT Authentication

---

## 📦 Features
- User Signup (Student / Trainer)
- Login with JWT Token
- Role-based Access Control
- Trainer creates sessions
- Student marks attendance
- Trainer views attendance

---

## 🔗 API Endpoints

### 1️⃣ Signup
POST /signup

```json
{
  "name": "User",
  "email": "user@test.com",
  "password": "123",
  "role": "Student"
}