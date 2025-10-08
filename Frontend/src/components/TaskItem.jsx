import React from 'react';
import { useApp } from '../context/AppContext';

export default function TaskItem({ task }) {
  const {
    user,
    editingTask,
    editText,
    setEditText,
    handleEditTask,
    handleUpdateTask,
    handleCancelEdit,
    handleDeleteTask,
    handleToggleComplete,
    loading
  } = useApp();
  const isOwner = user && user.userId === task.userId;
  const isEditing = editingTask === task._id;

  return (
    <li style={{
      border: "1px solid #eee",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "4px",
      backgroundColor: "#f8f9fa",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="checkbox"
          checked={task.completed || false}
          onChange={() => handleToggleComplete(task._id)}
          disabled={task.completed}
          style={{ cursor: task.completed ? "not-allowed" : "pointer" }}
        />
        <div style={{ textDecoration: task.completed ? "line-through" : "none", opacity: task.completed ? 0.6 : 1 }}>
          <strong style={{ color: "#007bff" }}>{task.name}</strong>: 
          {isEditing ? (
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              style={{
                marginLeft: "8px",
                padding: "4px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                width: "200px"
              }}
            />
          ) : (
            <span> {task.task}</span>
          )}
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "5px" }}>
          {isEditing ? (
            <>
              <button
                onClick={() => handleUpdateTask(task._id)}
                disabled={loading}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {!task.completed && (
                <button
                  onClick={() => handleEditTask(task)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDeleteTask(task._id)}
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
            </>
          )}
      </div>
    </li>
  );
}