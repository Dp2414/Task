import React from 'react';
import { useApp } from '../context/AppContext';

export default function Auth() {
  const {
    authMode,
    setAuthMode,
    loginForm,
    setLoginForm,
    signupForm,
    setSignupForm,
    authErr,
    setAuthErr,
    handleLogin,
    handleSignup,
    loading
  } = useApp();
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
    justifyContent:"center",
    margin:"auto"
      }}
    >
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
            cursor: authMode === "login" ? "default" : "pointer",
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
            cursor: authMode === "signup" ? "default" : "pointer",
          }}
        >
          Sign Up
        </button>
      </div>

      {authMode === "login" ? (
        <form onSubmit={handleLogin}>
          <h3>Login</h3>
          <div className="flex">
            <div className="inputs">
              <input
                placeholder="username"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, username: e.target.value }))
                }
                style={{
                  width: "90%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
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
                  width: "90%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            {authErr && (
              <div style={{ color: "red", marginBottom: "10px" }}>
                {authErr}
              </div>
            )}
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignup}>
          <h3>Sign Up</h3>
          <div className="flex">
            <div className="inputs">
              <input
                placeholder="username"
                value={signupForm.username}
                onChange={(e) =>
                  setSignupForm((f) => ({ ...f, username: e.target.value }))
                }
                style={{
                  width: "90%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
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
                  width: "90%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            {authErr && (
              <div style={{ color: "red", marginBottom: "10px" }}>{authErr}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: loading ? "#6c757d" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}