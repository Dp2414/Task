import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ContextApi = createContext();

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
});

export function ContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({ username: "", password: "" });
  const [authErr, setAuthErr] = useState("");
  const [authMode, setAuthMode] = useState("login");

  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ task: "" });
  const [taskErr, setTaskErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const { data } = await api.get("/details");
      setTasks(data);
    } catch (e) {
      console.error(e);
      setTaskErr("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setAuthErr("");
    
    const { username, password } = signupForm;
    
    if (!username || !password) {
      setAuthErr("Username and password are required");
      return;
    }
    
    if (username.length < 3) {
      setAuthErr("Username must be at least 3 characters");
      return;
    }
    
    if (password.length < 6) {
      setAuthErr("Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      await api.post("/signup", { username, password });
      setLoginForm({ username, password: "" });
      setSignupForm({ username: "", password: "" });
      setAuthMode("login");
      alert("Signup successful! Please log in.");
    } catch (e) {
      if (e.code === 'ECONNREFUSED') {
        setAuthErr("Cannot connect to server. Make sure backend is running on port 8000.");
      } else {
        setAuthErr(e.response?.data?.error || e.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthErr("");
    try {
      const { data } = await api.post("/login", loginForm);
      setUser({ username: data.username, userId: data.userId });
      setLoginForm({ username: "", password: "" });

    } catch (e) {
      setAuthErr(e.response?.data?.error || "Login failed");
    }
  }

  function handleLogout() {
    setUser(null);
    setTaskForm({ task: "" });
  }

  async function handleAddTask(e) {
    e.preventDefault();
    setTaskErr("");
    try {
      setLoading(true);
      const addingTask = {
        name: user.username,
        task: taskForm.task,
        userId: user.userId,
      };
      if (!addingTask.name || !addingTask.task) {
        setTaskErr("Both name and task are required.");
        return;
      }
      const { data } = await api.post("/details", addingTask);
      setTasks((prev) => [data, ...prev]);
      setTaskForm({ task: "" });
    } catch (e) {
      setTaskErr(e.response?.data?.error || "Failed to add task");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(taskId) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      setLoading(true);
      await api.delete(`/details/${taskId}`, {
        data: { userId: user?.userId }
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (e) {
      if (e.response?.status === 403) {
        alert("403 Forbidden: " + (e.response?.data?.error || "You can only delete your own tasks"));
      } else {
        setTaskErr(e.response?.data?.error || "Failed to delete task");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleEditTask(task) {
    setEditingTask(task._id);
    setEditText(task.task);
  }

  async function handleUpdateTask(taskId) {
    try {
      setLoading(true);
      const { data } = await api.put(`/details/${taskId}`, {
        task: editText,
        userId: user?.userId
      });
      setTasks((prev) => prev.map(t => t._id === taskId ? data : t));
      setEditingTask(null);
      setEditText("");
    } catch (e) {
      if (e.response?.status === 403) {
        alert("403 Forbidden: " + (e.response?.data?.error || "You can only update your own tasks"));
        handleCancelEdit();
      } else {
        setTaskErr(e.response?.data?.error || "Failed to update task");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    setEditingTask(null);
    setEditText("");
  }

  async function handleToggleComplete(taskId) {
    const task = tasks.find(t => t._id === taskId);
    if (task?.completed) return;
    
    try {
      setLoading(true);
      const { data } = await api.patch(`/details/${taskId}/complete`, {
        userId: user?.userId
      });
      setTasks((prev) => prev.map(t => t._id === taskId ? data : t));
      

      if (editingTask === taskId) {
        setEditingTask(null);
        setEditText("");
      }
    } catch (e) {
      if (e.response?.status === 403) {
        alert("403 Forbidden: " + (e.response?.data?.error || "You can only update your own tasks"));
      } else {
        setTaskErr(e.response?.data?.error || "Failed to update task status");
      }
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    loginForm,
    setLoginForm,
    signupForm,
    setSignupForm,
    authErr,
    setAuthErr,
    authMode,
    setAuthMode,
    tasks,
    taskForm,
    setTaskForm,
    taskErr,
    loading,
    editingTask,
    editText,
    setEditText,
    handleSignup,
    handleLogin,
    handleLogout,
    handleAddTask,
    handleDeleteTask,
    handleEditTask,
    handleUpdateTask,
    handleCancelEdit,
    handleToggleComplete
  };

  return <ContextApi.Provider value={value}>{children}</ContextApi.Provider>;
}

export function useApp() {
  const context = useContext(ContextApi);
  if (!context) {
    throw new Error('useApp must be used within ContextProvider');
  }
  return context;
}