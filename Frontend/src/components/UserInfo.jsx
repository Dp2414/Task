import React from 'react';
import { useApp } from '../context/AppContext';

export default function UserInfo() {
  const { user, handleLogout } = useApp();
  return (
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
  );
}