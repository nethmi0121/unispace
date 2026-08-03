import { useState } from "react";
import LandingPage from "./components/LandingPage";
import StudentLayout from "./components/layouts/StudentLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./components/Dashboard";
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

  return (
    <div className="App">
      {page === "landing" && (
        <LandingPage
          onStudentClick={() => setPage(isStudentAuth ? "student" : "student-login")}
          onAdminClick={() => setPage(isAdminAuth ? "admin" : "login")}
        />
      )}

      {(page === "student" || page === "student-login") && (
        <StudentLayout
          isAuthenticated={isStudentAuth}
          onLoginSuccess={() => { setIsStudentAuth(true); setPage("student"); }}
          onLogout={studentLogout}
          onHomeClick={() => setPage("landing")}
        />
      )}

      {(page === "admin" || page === "login") && (
        <AdminLayout
          isAuthenticated={isAdminAuth}
          onLoginSuccess={() => { setIsAdminAuth(true); setPage("admin"); }}
          onLogout={adminLogout}
          onHomeClick={() => setPage("landing")}
        />
      )}

      {page === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;