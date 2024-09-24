import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/Home.jsx";
import AdminPage from "../src/pages/Admin.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home Page */}
        <Route path="/admin" element={<AdminPage />} /> {/* Admin Page */}
      </Routes>
    </Router>
  );
}
