// src/components/AdminContainer.jsx
import React, { useState, useEffect } from "react";
import Login from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import Navbar from "./Navbar";

function AdminContainer() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists on initial load
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <AdminDashboard />
    </div>
  );
}

export default AdminContainer;