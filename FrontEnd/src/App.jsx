import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../src/pages/Home.jsx";
import AdminPage from "../src/pages/admin/index.jsx";
import StaffPage from "../src/pages/Staff.jsx";
import { Login } from "./pages/Login.jsx";

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
      path: "/breeder", // Breeder page
      element: <Login />,
    },
    {
      path: "/login", // Login page
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}
