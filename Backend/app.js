require("dotenv").config();
const { MONGODB_URI, PORT = 8000 } = process.env;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(" MongoDB Error:", err));

app.use("/", authRoutes);
app.use("/details", taskRoutes);

app.listen(PORT, () =>
  console.log(" Server running on http://localhost:8000")
);
