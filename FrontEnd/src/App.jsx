
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../src/features/Home.jsx";
import AdminPage from "../src/features/admin/pages/index.jsx";
import StaffPage from "../src/features/staff/pages/index.jsx";
import { Login } from "../src/features/Login.jsx";
import BreederPage from "../src/features/breeder/index.jsx";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/", // Home page route should have "/"
      element: <HomePage />, // The element to display for the root "/"
    },
    {
      path: "/admin", // Admin page
      element: <AdminPage />,
    },
    {
      path: "/staff", // Staff page
      element: <StaffPage />,
    },
    {
      path: "/login", // Login page
      element: <Login />,
    },
    {
      path: "/breeder", // Login page
      element: <BreederPage />,
    },
  ]);

  return <RouterProvider router={router} />;
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "../src/features/Home.jsx";
import AdminPage from "../src/features/admin/pages/index.jsx";
import { AuthProvider } from "./features/protectedRoutes/AuthContext.jsx";
import ProtectedRoute from "./features/protectedRoutes/ProtectedRoute.jsx";
import MemberPage from "./features/user/pages/Member.jsx";
import LoginPage from "./features/user/pages/Login.jsx";
import RegisterPage from "./features/user/pages/Register.jsx";
import BreederPage from "./features/breeder/index.jsx";
import StaffPage from "./features/staff/pages/index.jsx";

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

          <Route
            path="/breeder"
            element={
              <ProtectedRoute allowedRoles={["BREEDER"]}>
                <BreederPage />
              </ProtectedRoute>
            }
          /> {/* Breeder Page */}

          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["STAFF"]}>
                <StaffPage />
              </ProtectedRoute>
            }
          /> {/* Staff Page */}

        </Routes>
      </Router>
    </AuthProvider>

  );

}
