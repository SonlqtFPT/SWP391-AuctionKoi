import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/Home.jsx";
import AdminPage from "../src/pages/Admin.jsx";
import StaffPage from "../src/pages/Staff.jsx";
import { Login } from "./pages/Login.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home Page */}
        <Route path="/admin" element={<AdminPage />} /> {/* Admin Page */}
        <Route path="/staff" element={<StaffPage />} /> {/* Staff Page*/}
        <Route path="/login" element={<Login />} /> {/* Login Page*/}
      </Routes>
    </Router>
  );
}
