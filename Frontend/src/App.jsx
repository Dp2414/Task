
import React from "react";
import { ContextProvider, useApp } from "./context/AppContext";
import Auth from "./components/Auth";
import UserInfo from "./components/UserInfo";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function AppContent() {
  const { user } = useApp();

  return (
    <div style={{ width: "100%", margin: "0 250px", padding: "20px", fontFamily: "Arial, sans-serif",backgroundColor:"#9999" ,border:"10px solid #ddd"}} >
      <h1 style={{ textAlign: "center", color: "#333" }}>Task Manager</h1>

      {!user ? (
        <Auth/>
      ) : (
        <>
          <UserInfo />
          <TaskForm />
          <TaskList />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ContextProvider className="div">
      <AppContent />
    </ContextProvider>
  );
}


