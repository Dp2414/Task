const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, task, userId } = req.body;
  const newTask = new Task({ name, task, userId });
  await newTask.save();
  res.json(newTask);
});

router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { task, userId } = req.body;
  
  try {
    const existingTask = await Task.findById(id);
    if (!existingTask) return res.status(404).json({ error: "Task not found" });
    
    if (existingTask.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only update your own tasks" });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(id, { task }, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.patch("/:id/complete", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only update your own tasks" });
    }
    
    if (task.completed) {
      return res.status(400).json({ error: "Task is already completed" });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      { completed: true }, 
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task status" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    
    if (task.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own tasks" });
    }
    
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;