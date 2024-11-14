import { useState } from "react";
import {
  FaBars,
  FaHome,
  FaGavel,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaFileInvoice,
} from "react-icons/fa";
import Logo from "../assets/logo/PrestigeKoi_White.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/protectedRoutes/AuthContext";
import api from "../config/axios";
import { toast } from "react-toastify";
import AddRequestButton from "./AddRequestButton";

const Header = () => {
  // State to manage the visibility of the mobile (hamburger) menu
  const [isOpen, setIsOpen] = useState(false);
  //enable navigate
  const navigate = useNavigate();
  // State to manage the visibility of the user dropdown when logged in
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle function to show or hide the hamburger menu on mobile screens
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Toggle function to show or hide the user dropdown menu (Account, Log Out)
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const {
    userName,
    role,
    setAccountId,
    setUserName,
    setAccessToken,
    setRefreshToken,
    setRole,
    setBreederName,
    setLocation,
  } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      toast.error("No valid session found. Please log in again.");
      navigate("/login");
      setLoading(false);
      return;
    }

    const data = { accessToken, refreshToken };

    try {
      const response = await api.post(`/authenticate/logout`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { status, message } = response.data;

      if (status === 5) {
        // Clear user data from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accountData");
        localStorage.clear(); // Ensures any other data stored in localStorage is removed

        // Clear user data from state
        setAccountId(null);
        setAccessToken(null);
        setRefreshToken(null);
        setUserName(null);
        setBreederName(null);
        setLocation(null);
        setRole(null);

        // Redirect to the home or login page
        // window.location.reload();
        navigate("/login");
        toast.success(message);
      } else {
        toast.error("Unexpected status during logout. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error! Cannot log out!");
    } finally {
      setLoading(false);
    }
  };

  const getAccountLink = () => {
    switch (role) {
      case "MANAGER":
        return "/admin";
      case "BREEDER":
        return "/breeder/profile/view-request";
      case "MEMBER":
        return "/member/profile/details";
      case "STAFF":
        return "/staff";
      default:
        return "/";
    }
  };

  return (
    <>
      {/* Main navigation container */}
      <nav className="flex items-center bg-[#171817] text-white fixed w-full z-50 shadow-2xl">
        {/* Logo section */}
        <div className="px-5 lg:px-20 py-3 flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={Logo}
              alt="PrestigeKoi Auctions Logo"
              className="h-14 w-14 object-contain"
            />
          </Link>
        </div>

        {/* Center menu items container */}
        <div className="invisible flex-grow absolute left-1/2 transform -translate-x-1/2 md:visible">
          <ul className="flex font-semibold font-heading space-x-8 content-center">
            <li className="flex items-center space-x-2 hover:bg-red-500 min-w-max rounded-full hover:text-black">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center space-x-2 bg-red-600 min-w-max rounded-full text-black px-4 py-2"
                    : "flex items-center space-x-2 px-4 py-2"
                }
              >
                <FaHome className="h-5 w-5" />
                <span>Home</span>
              </NavLink>
            </li>
            <li className="flex items-center space-x-2 hover:bg-red-500 min-w-max rounded-full hover:text-black">
              <NavLink
                to="/auction"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center space-x-2 bg-red-600 min-w-max rounded-full text-black px-4 py-2"
                    : "flex items-center space-x-2 px-4 py-2"
                }
              >
                <FaGavel className="h-5 w-5" />
                <span>Auction</span>
              </NavLink>
            </li>
            <li className="flex items-center space-x-2 hover:bg-red-500 min-w-max rounded-full hover:text-black">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center space-x-2 bg-red-600 min-w-max rounded-full text-black px-4 py-2"
                    : "flex items-center space-x-2 px-4 py-2"
                }
              >
                <FaInfoCircle className="h-5 w-5" />
                <span>About Us</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* User dropdown for logged-in users */}
        <div className="flex items-center pr-5 ml-auto">
          {userName ? (
            <div className="flex items-center space-x-4 relative">
              {/* User button that toggles the dropdown */}
              <button
                onClick={toggleUserDropdown}
                className="flex items-center"
              >
                <FaUserCircle className="h-6 w-6" />
                <span className="ml-2">{userName}</span>
              </button>

              {/* Dropdown content with Account and Log Out options */}
              {isUserDropdownOpen && (
                <div className="flex flex-col absolute top-7 w-full items-center mt-2 bg-[#171817] border border-gray-700 rounded-lg shadow-lg z-20">
                  <Link
                    to={getAccountLink()} // Dynamically generated link based on role
                    className="block px-4 py-2 text-white hover:bg-red-500 w-full text-center hover:rounded-lg"
                  >
                    Account
                  </Link>
                  {role === "MEMBER" && (
                    <Link
                      to="/invoice-list"
                      className="hover:bg-red-500 flex items-center justify-center space-x-2 rounded-full px-4 py-2 hover:text-black"
                    >
                      Invoices
                    </Link>
                  )}
                  <button
                    className="block px-4 py-2 text-center text-white hover:bg-red-500 w-full hover:rounded-lg"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Log Out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "bg-red-600 flex items-center space-x-2 rounded-full px-4 py-2 text-black"
                    : "hover:bg-red-500 flex items-center space-x-2 rounded-full px-4 py-2 hover:text-black"
                }
              >
                <FaSignInAlt className="h-6 w-6" />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? "bg-amber-600 flex items-center space-x-2 rounded-full px-4 py-2 text-black"
                    : "hover:bg-amber-500 flex items-center space-x-2 rounded-full px-4 py-2 hover:text-black"
                }
              >
                <FaUserPlus className="h-6 w-6" />
                <span>Register</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Hamburger menu button for mobile screens */}
        <button
          className="navbar-burger self-center mr-5 lg:hidden"
          onClick={toggleDropdown}
          aria-label="Toggle navigation"
        >
          <FaBars className="h-6 w-6 hover:text-gray-200" />
        </button>
      </nav>

      {/* Hamburger menu dropdown for mobile screens */}
      <div
        className={`bg-[#171817] text-white ${
          isOpen ? "block" : "hidden"
        } lg:hidden`}
      >
        <ul className="flex flex-col space-y-2 px-5 py-4 mt-20 text-center">
          <li className="flex items-center justify-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center space-x-2 bg-red-600 min-w-max rounded-full text-black px-4 py-2"
                  : "flex items-center justify-center space-x-2 px-4 py-2 hover:bg-red-500 hover:text-black rounded-full"
              }
              onClick={() => setIsOpen(false)} // Close menu after clicking
            >
              <FaHome className="h-5 w-5" />
              <span>Home</span>
            </NavLink>
          </li>
          <li className="flex items-center justify-center">
            <NavLink
              to="/auction"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center space-x-2 bg-red-600 min-w-max rounded-full text-black px-4 py-2"
                  : "flex items-center justify-center space-x-2 px-4 py-2 hover:bg-red-500 hover:text-black rounded-full"
              }
              onClick={() => setIsOpen(false)} // Close menu after clicking
            >
              <FaGavel className="h-5 w-5" />
              <span>Auction</span>
            </NavLink>
          </li>
          <li className="flex items-center justify-center">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center justify-center space-x-2 bg-red-600 min-w-max rounded-full text-black px-4 py-2"
                  : "flex items-center justify-center space-x-2 px-4 py-2 hover:bg-red-500 hover:text-black rounded-full"
              }
              onClick={() => setIsOpen(false)} // Close menu after clicking
            >
              <FaInfoCircle className="h-5 w-5" />
              <span>About Us</span>
            </NavLink>
          </li>
          {/* Conditional rendering of the user-specific options */}
          {userName ? (
            <>
              <li className="flex items-center justify-center">
                <Link
                  to={getAccountLink()} // Dynamically generated link based on role
                  className="hover:bg-red-500 flex items-center justify-center space-x-2 rounded-full px-4 py-2 hover:text-black"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserCircle className="h-5 w-5" />
                  <span>Account</span>
                </Link>
              </li>
              <li className="flex items-center justify-center">
                {role === "MEMBER" && (
                  <Link
                    to="/invoice-list"
                    className="hover:bg-red-500 flex items-center justify-center space-x-2 rounded-full px-4 py-2 hover:text-black"
                  >
                    <FaFileInvoice className="inline-block mr-2" />
                    <span>Invoices</span>
                  </Link>
                )}
              </li>
              <li className="flex items-center justify-center">
                <button
                  onClick={() => {
                    handleLogout(); // Call logout and close the menu
                    setIsOpen(false);
                  }}
                  className="hover:bg-red-500 flex items-center justify-center space-x-2 rounded-full px-4 py-2 hover:text-black"
                  disabled={loading}
                >
                  <FaSignInAlt className="h-5 w-5" />
                  <span>{loading ? "Loading..." : "Log Out"}</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center justify-center">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-red-600 flex items-center justify-center space-x-2 rounded-full px-4 py-2 text-black"
                      : "hover:bg-red-500 flex items-center justify-center space-x-2 rounded-full px-4 py-2 hover:text-black"
                  }
                  onClick={() => setIsOpen(false)} // Close menu after clicking
                >
                  <FaSignInAlt className="h-5 w-5" />
                  <span>Login</span>
                </NavLink>
              </li>
              <li className="flex items-center justify-center">
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? "bg-amber-600 flex items-center justify-center space-x-2 rounded-full px-4 py-2 text-black"
                      : "hover:bg-amber-500 flex items-center justify-center space-x-2 rounded-full px-4 py-2 hover:text-black"
                  }
                  onClick={() => setIsOpen(false)} // Close menu after clicking
                >
                  <FaUserPlus className="h-5 w-5" />
                  <span>Register</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Place Order Button for Breeders */}
      {role === "BREEDER" && (
        <div className="fixed bottom-5 right-5 z-50">
          <AddRequestButton />
        </div>
      )}
    </>
  );
};

export default Header;
