const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: String,
  task: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);