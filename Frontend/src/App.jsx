// src/App.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
});

export default function App() {
  const [user, setUser] = useState(null); // { username }
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({ username: "", password: "" });
  const [authErr, setAuthErr] = useState("");
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'

  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({ name: "", task: "" });
  const [taskErr, setTaskErr] = useState("");
  const [loading, setLoading] = useState(false);

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

  // --- auth handlers ---
  async function handleSignup(e) {
    e.preventDefault();
    setAuthErr("");
    
    const { username, password } = signupForm;
    
    // Validation
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
      console.log("Attempting signup with:", { username, password: "***" });
      
      const response = await api.post("/signup", { username, password });
      console.log("Signup response:", response.data);
      
      setLoginForm({ username, password: "" });
      setSignupForm({ username: "", password: "" });
      setAuthMode("login");
      alert("Signup successful! Please log in.");
    } catch (e) {
      console.error("Signup error:", e);
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
      setUser({ username: data.username });
      setLoginForm({ username: "", password: "" });
      setTaskForm((f) => ({ ...f, name: data.username || "" }));
    } catch (e) {
      setAuthErr(e.response?.data?.error || "Login failed");
    }
  }

  function handleLogout() {
    setUser(null);
    setTaskForm((f) => ({ ...f, name: "" }));
  }

  async function handleAddTask(e) {
    e.preventDefault();
    setTaskErr("");
    try {
      setLoading(true);
      const payload = {
        name: user?.username ? user.username : taskForm.name,
        task: taskForm.task,
      };
      if (!payload.name || !payload.task) {
        setTaskErr("Both name and task are required.");
        return;
      }
      const { data } = await api.post("/details", payload);
      // prepend newly created task
      setTasks((prev) => [data, ...prev]);
      setTaskForm((f) => ({ ...f, task: "" })); // clear only task field
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
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (e) {
      setTaskErr("Failed to delete task");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Task Manager</h1>

      {/* Auth box */}
      {!user ? (
        <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthErr("");
              }}
              disabled={authMode === "login"}
              style={{
                padding: "8px 16px",
                marginRight: "10px",
                backgroundColor: authMode === "login" ? "#007bff" : "#f8f9fa",
                color: authMode === "login" ? "white" : "#333",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: authMode === "login" ? "default" : "pointer"
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setAuthErr("");
              }}
              disabled={authMode === "signup"}
              style={{
                padding: "8px 16px",
                backgroundColor: authMode === "signup" ? "#007bff" : "#f8f9fa",
                color: authMode === "signup" ? "white" : "#333",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: authMode === "signup" ? "default" : "pointer"
              }}
            >
              Sign Up
            </button>
          </div>

          {authMode === "login" ? (
            <form onSubmit={handleLogin}>
              <h3>Login</h3>
              <input
                placeholder="username"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, username: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
              />
              <input
                type="password"
                placeholder="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, password: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
              />
              {authErr && <div style={{ color: "red", marginBottom: "10px" }}>{authErr}</div>}
              <button 
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h3>Sign Up</h3>
              <input
                placeholder="username"
                value={signupForm.username}
                onChange={(e) =>
                  setSignupForm((f) => ({ ...f, username: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
              />
              <input
                type="password"
                placeholder="password"
                value={signupForm.password}
                onChange={(e) =>
                  setSignupForm((f) => ({ ...f, password: e.target.value }))
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
              />
              {authErr && <div style={{ color: "red", marginBottom: "10px" }}>{authErr}</div>}
              <button 
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: loading ? "#6c757d" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div style={{ 
          border: "1px solid #ddd", 
          padding: "20px", 
          borderRadius: "8px", 
          marginBottom: "20px",
          backgroundColor: "#f8f9fa"
        }}>
          <div style={{ marginBottom: "10px" }}>
            Signed in as <b style={{ color: "#007bff" }}>{user.username}</b>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Add task */}
      <form onSubmit={handleAddTask} style={{ 
        border: "1px solid #ddd", 
        padding: "20px", 
        borderRadius: "8px", 
        marginBottom: "20px" 
      }}>
        <h3 style={{ marginTop: 0 }}>Create Task</h3>

        {/* If logged in, bind name to username and hide the name box */}
        {!user && (
          <input
            placeholder="your name"
            value={taskForm.name}
            onChange={(e) =>
              setTaskForm((f) => ({ ...f, name: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          />
        )}

        <input
          placeholder="task..."
          value={taskForm.task}
          onChange={(e) => setTaskForm((f) => ({ ...f, task: e.target.value }))}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px"
          }}
        />
        {taskErr && <div style={{ color: "red", marginBottom: "10px" }}>{taskErr}</div>}
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#6c757d" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>

      {/* List tasks */}
      <div style={{ 
        border: "1px solid #ddd", 
        padding: "20px", 
        borderRadius: "8px" 
      }}>
        <h3 style={{ marginTop: 0 }}>All Tasks</h3>
        {loading && <div style={{ textAlign: "center", color: "#666" }}>Loading...</div>}
        {!loading && tasks.length === 0 && <div style={{ textAlign: "center", color: "#666" }}>No tasks yet.</div>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((t) => (
            <li key={t._id} style={{
              border: "1px solid #eee",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "4px",
              backgroundColor: "#f8f9fa",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <strong style={{ color: "#007bff" }}>{t.name}</strong>: {t.task}
              </div>
              <button
                onClick={() => handleDeleteTask(t._id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
