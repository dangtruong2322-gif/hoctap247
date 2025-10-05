import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

app.post("/api/register", async (req, res) => {
  const { email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO users (email, password, role) VALUES ($1,$2,$3)", [email, hash, role || "student"]);
  res.json({ message: "Đăng ký thành công" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  const user = rows[0];
  if (!user) return res.status(400).json({ message: "Email không tồn tại" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Sai mật khẩu" });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ token });
});

app.get("/api/courses", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM courses ORDER BY id");
  res.json(rows);
});

app.get("/api/forum", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM forum ORDER BY id DESC");
  res.json(rows);
});
app.post("/api/forum", async (req, res) => {
  const { title, content, author } = req.body;
  await pool.query("INSERT INTO forum (title, content, author) VALUES ($1,$2,$3)", [title, content, author]);
  res.json({ message: "Đăng bài thành công" });
});

app.post("/api/ai", async (req, res) => {
  const { question } = req.body;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: question }]
    })
  });
  const data = await response.json();
  res.json({ answer: data.choices?.[0]?.message?.content || "Trợ giảng đang bận, vui lòng thử lại." });
});

app.listen(process.env.PORT || 10000, () => console.log("✅ Backend chạy tại cổng 10000"));
