import React from "react";

function LandingPage({ onStudentClick, onAdminClick }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "50px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
          textAlign: "center",
          width: "400px",
        }}
      >
        <h1 style={{ color: "#1e3a8a" }}>
          UniSpace 🚀
        </h1>

        <p>Select your portal</p>

        <button
          onClick={onStudentClick}
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Student Portal
        </button>

        <button
          onClick={onAdminClick}
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "15px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default LandingPage;