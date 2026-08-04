import { useState } from "react";
import LandingPage from "./components/LandingPage";
import StudentLayout from "./components/layouts/StudentLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./components/Dashboard";
import AnalyticsDashboard from "./AnalyticsDashboard";
import "./App.css";

function App() {
  const [page, setPage] = useState("landing");
  const [isAdminAuth, setIsAdminAuth] = useState(!!localStorage.getItem("token"));
  const [isStudentAuth, setIsStudentAuth] = useState(!!localStorage.getItem("studentToken"));

  const adminLogout = () => {
    localStorage.removeItem("token");
    setIsAdminAuth(false);
    setPage("landing");
  };

  const studentLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentId");
    setIsStudentAuth(false);
    setPage("landing");
  };

  // Helper for clicking Analytics: requires Admin auth
  const handleAnalyticsClick = () => {
    if (isAdminAuth) {
      setPage("analytics");
    } else {
      // Redirect to admin login if not authenticated yet
      setPage("login");
    }
  };

  return (
    <div className="App">
      {/* 1. LANDING PAGE */}
      {page === "landing" && (
        <LandingPage
          onStudentClick={() => setPage(isStudentAuth ? "student" : "student-login")}
          onAdminClick={() => setPage(isAdminAuth ? "admin" : "login")}
          onAnalyticsClick={handleAnalyticsClick} // 👈 Added prop connection
        />
      )}

      {/* 2. STUDENT PORTAL LAYOUT */}
      {(page === "student" || page === "student-login") && (
        <StudentLayout
          isAuthenticated={isStudentAuth}
          onLoginSuccess={() => { setIsStudentAuth(true); setPage("student"); }}
          onLogout={studentLogout}
          onHomeClick={() => setPage("landing")}
        />
      )}

      {/* 3. ADMIN PORTAL LAYOUT */}
      {(page === "admin" || page === "login") && (
        <AdminLayout
          isAuthenticated={isAdminAuth}
          onLoginSuccess={() => { setIsAdminAuth(true); setPage("admin"); }}
          onLogout={adminLogout}
          onHomeClick={() => setPage("landing")}
        />
      )}

      {/* 4. ANALYTICS DASHBOARD VIEW */}
      {page === "analytics" && (
        <div className="analytics-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#1e3a8a', color: 'white', alignItems: 'center' }}>
            <button 
              onClick={() => setPage("landing")}
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🏠 Home
            </button>
            <h2 style={{ margin: 0 }}>📊 Campus Analytics</h2>
            <button 
              onClick={adminLogout}
              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Logout
            </button>
          </div>
          <AnalyticsDashboard />
        </div>
      )}

      {/* 5. OTHER DASHBOARDS */}
      {page === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;