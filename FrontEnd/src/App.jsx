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
}
