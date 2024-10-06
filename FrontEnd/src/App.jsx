
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
import HomePage from "../src/pages/Home.jsx";
import AdminPage from "../src/pages/Admin.jsx";
import StaffPage from "../src/pages/Staff.jsx";
import { Login } from "./pages/Login.jsx";
import BreederRequest from "./pages/BreederRequest.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home Page */}
        <Route path="/admin" element={<AdminPage />} /> {/* Admin Page */}
        <Route path="/staff" element={<StaffPage />} /> {/* Staff Page*/}
        <Route path="/login" element={<Login />} /> {/* Login Page*/}
        <Route path="/breeder-request" element={<BreederRequest />} />{" "}
        {/* Breeder Request Page*/}
      </Routes>
    </Router>
  );

}
