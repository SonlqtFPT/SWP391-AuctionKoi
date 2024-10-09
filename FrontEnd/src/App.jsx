import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../src/features/Home.jsx";
import AdminPage from "../src/features/admin/pages/index.jsx";
import { AuthProvider } from "./features/protectedRoutes/AuthContext.jsx";
import ProtectedRoute from "./features/protectedRoutes/ProtectedRoute.jsx";
import LoginPage from "./features/user/pages/Login.jsx";
import RegisterPage from "./features/user/pages/Register.jsx";
import BreederPage from "./features/breeder/index.jsx";
import StaffPage from "./features/staff/pages/index.jsx";
import Auction from "./features/auction/List-auction.jsx";
import Lot from "./features/lot/lot.jsx";
import Bid from "./features/bid/bid.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} /> {/* Home Page */}
          <Route path="/login" element={<LoginPage />} /> {/* Login Page*/}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/lot" element={<Lot />} />
          <Route path="/bid" element={<Bid />} />
          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["MANAGER"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />{" "}
          {/* Admin Page */}
          <Route
            path="/member"
            element={
              <ProtectedRoute allowedRoles={["MEMBER"]}>
                <Auction />
              </ProtectedRoute>
            }
          />{" "}
          {/* Member Page */}
          <Route
            path="/breeder"
            element={
              <ProtectedRoute allowedRoles={["BREEDER"]}>
                <BreederPage />
              </ProtectedRoute>
            }
          />{" "}
          {/* Breeder Page */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["STAFF"]}>
                <StaffPage />
              </ProtectedRoute>
            }
          />{" "}
          {/* Staff Page */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
