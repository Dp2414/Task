const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb+srv://dpdp8311:dpdp8311@cluster0.5ysqydm.mongodb.net/")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const taskSchema = new mongoose.Schema({
  name: String,
  task: String,
});
const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);


app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.json({ message: "Signup successful" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  res.json({ message: "Login successful", username: user.username });
});

app.post("/details", async (req, res) => {
  const { name, task } = req.body;
  const newTask = new Task({ name, task });
  await newTask.save();
  res.json(newTask);
});

app.get("/details", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(8000, () =>
  console.log("🚀 Server running on http://localhost:8000")
);
