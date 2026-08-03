// src/components/Navbar.jsx
import "../styles/Navbar.css";

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <h2>Room Management System</h2>
      <button onClick={onLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
}

export default Navbar;