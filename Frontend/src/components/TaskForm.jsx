import React from 'react';
import { useApp } from '../context/AppContext';

export default function TaskForm() {
  const { taskForm, setTaskForm, taskErr, loading, handleAddTask } = useApp();
  return (
    <form onSubmit={handleAddTask} style={{ 
      border: "1px solid #ddd", 
      padding: "20px", 
      borderRadius: "8px", 
      marginBottom: "20px" 
    }}>
      <h3 style={{ marginTop: 0 }}>Create Task</h3>

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
  );
}