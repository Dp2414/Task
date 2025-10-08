import React from 'react';
import TaskItem from './TaskItem';
import { useApp } from '../context/AppContext';

export default function TaskList() {
  const { tasks, loading } = useApp();
  return (
    <div style={{ 
      border: "1px solid #ddd", 
      padding: "20px", 
      borderRadius: "8px" 
    }}>
      <h3 style={{ marginTop: 0 }}>All Tasks</h3>
      {loading && <div style={{ textAlign: "center", color: "#666" }}>Loading...</div>}
      {!loading && tasks.length === 0 && <div style={{ textAlign: "center", color: "#666" }}>No tasks yet.</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </ul>
    </div>
  );
}