📌 Attendance Management System (Full Stack Project)



🚀 Live Links
Frontend: https://stately-syrniki-09c567.netlify.app/
Backend API: https://attendance-backend-f2in.onrender.com/




🛠️ Tech Stack
Node.js
Express.js
PostgreSQL (Neon DB)
React.js (Frontend)
JWT Authentication




📦 Features
User Signup (Student / Trainer)
Login with JWT Token
Role-based Access Control
Trainer creates sessions
Student marks attendance
Trainer views attendance records




🔗 API Endpoints

1️⃣ Signup

POST /signup

{
  "name": "User",
  "email": "user@test.com",
  "password": "123",
  "role": "Student"
}

2️⃣ Login

POST /login

{
  "email": "user@test.com",
  "password": "123"
}

3️⃣ Create Session (Trainer Only)

POST /session

{
  "title": "Math Class",
  "date": "2026-04-23"
}

4️⃣ Mark Attendance (Student)

POST /attendance

{
  "sessionId": 1,
  "status": "Present"
}

5️⃣ Get Attendance (Trainer)

GET /attendance



⚙️ Setup Instructions
Backend
git clone <repo-url>
cd backend
npm install
npm run dev

Create .env file:

PORT=5000
DATABASE_URL=your_neon_postgres_url
JWT_SECRET=your_secret_key
Frontend
git clone <repo-url>
cd frontend
npm install
npm start

Create .env file:

REACT_APP_API_URL=https://attendance-backend-f2in.onrender.com/




🧠 Schema Design
Users table contains a role field (Student / Trainer) for access control
Attendance table links studentId + sessionId
Sessions created by Trainer and mapped to attendance records



📌 Notes
Backend is deployed on Render
Database is hosted on Neon PostgreSQL
JWT is used for authentication and authorization