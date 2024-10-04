import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/Home.jsx";
import AdminPage from "../src/pages/Admin.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MemberPage from "./pages/Member.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} /> {/* Home Page */}
          <Route path="/login" element={<LoginPage />} /> {/* Login Page*/}
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          /> {/* Admin Page */}

          <Route
            path="/member"
            element={
              <ProtectedRoute allowedRoles={["MEMBER"]}>
                <MemberPage />
              </ProtectedRoute>
            }
          /> {/* Member Page */}


        </Routes>
      </Router>
    </AuthProvider>
  );
}
