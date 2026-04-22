require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   DATABASE CONNECTION
================================ */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect()
  .then(() => console.log("Database connected ✅"))
  .catch(err => console.log(err));

/* ===============================
   TEST ROUTE
================================ */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


app.get("/signup", (req, res) => {
  res.send("Use POST request to signup");
});

/* ===============================
   SIGNUP
================================ */
app.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, password, role]
    );

    res.send("User created ✅");
  } catch (err) {
    console.log("SIGNUP ERROR:", err.message); // 👈 ADD THIS
    res.status(500).send(err.message); // 👈 SHOW ERROR
  }
});

/* ===============================
   LOGIN
================================ */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(400).send("Invalid credentials ❌");
    }

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      message: "Login successful ✅",
      token,
      user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Login error");
  }
});

/* ===============================
   AUTH MIDDLEWARE
================================ */
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

/* ===============================
   CREATE SESSION (Trainer only)
================================ */
app.post("/sessions", auth, async (req, res) => {
  if (req.user.role !== "Trainer") {
    return res.status(403).send("Access denied");
  }

  const { title, batch_id } = req.body;

  try {
    await pool.query(
      "INSERT INTO sessions (title, batch_id) VALUES ($1, $2)",
      [title, batch_id]
    );

    res.send("Session created ✅");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating session");
  }
});

/* ===============================
   MARK ATTENDANCE (Student only)
================================ */
app.post("/attendance", auth, async (req, res) => {
  if (req.user.role !== "Student") {
    return res.status(403).send("Access denied");
  }

  const { session_id, status } = req.body;

  try {
    await pool.query(
      "INSERT INTO attendance (session_id, student_id, status) VALUES ($1, $2, $3)",
      [session_id, req.user.id, status]
    );

    res.send("Attendance marked ✅");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error marking attendance");
  }
});

/* ===============================
   VIEW ATTENDANCE (Trainer only)
================================ */
app.get("/attendance/:sessionId", auth, async (req, res) => {
  if (req.user.role !== "Trainer") {
    return res.status(403).send("Access denied");
  }

  try {
    const data = await pool.query(
      "SELECT * FROM attendance WHERE session_id=$1",
      [req.params.sessionId]
    );

    res.json(data.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching attendance");
  }
});

/* ===============================
   START SERVER
================================ */
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});