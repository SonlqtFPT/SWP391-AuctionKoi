import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/Home.jsx";
import AdminPage from "../src/pages/Admin.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home Page */}
        <Route path="/admin" element={<AdminPage />} /> {/* Admin Page */}
        <Route path="/login" element={<LoginPage />} /> {/* Login Page*/}
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}
