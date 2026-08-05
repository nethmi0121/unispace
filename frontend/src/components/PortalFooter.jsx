// src/components/PortalFooter.jsx
import React from "react";

function PortalFooter() {
  return (
    <footer
      style={{
        width: "100%",
        background: "rgba(35, 8, 14, 0.95)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(201, 162, 39, 0.35)",
        color: "#d8b9a8",
        padding: "20px 32px",
        fontFamily: "'Work Sans', sans-serif",
        fontSize: "13px",
        boxSizing: "border-box",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Left Side: Plain Text Branding */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div>
            <span style={{ fontWeight: 600, color: "#f9f3e7" }}>UniSpace</span>
            {" · "}
            <span style={{ color: "#e8c874", fontWeight: 500 }}>
              University of Colombo (UOC)
            </span>
          </div>
          <div style={{ fontSize: "11.5px", color: "#b6a894" }}>
            est. 1921 · Colombo, Sri Lanka
          </div>
        </div>

        {/* Right Side: Navigation Links */}
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#privacy" style={{ color: "#d8b9a8", textDecoration: "none" }}>
            Privacy Policy
          </a>
          <a href="#terms" style={{ color: "#d8b9a8", textDecoration: "none" }}>
            Terms of Use
          </a>
          <a
            href="#support"
            style={{ color: "#e8c874", textDecoration: "none", fontWeight: 500 }}
          >
            UOC IT Helpdesk
          </a>
        </div>
      </div>
    </footer>
  );
}

export default PortalFooter;