import { useState } from "react";
import {
  FaBars,
  FaHome,
  FaGavel,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
} from "react-icons/fa";

import Logo from "../assets/logo/PrestigeKoi_White.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/protectedRoutes/AuthContext";


const Header = () => {
  // State to manage the visibility of the mobile (hamburger) menu
  const [isOpen, setIsOpen] = useState(false);
  //enable navigate
  const navigate = useNavigate();
  // State to manage the visibility of the user dropdown when logged in
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Toggle function to show or hide the hamburger menu on mobile screens
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Toggle function to show or hide the user dropdown menu (Account, Log Out)
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  const { userName, role, setUserName, setRole, setAccessToken, setRefreshToken, setAccountId } = useAuth();
  // Function to handle logout: remove user-related data from localStorage
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accountData');
    setAccountId('');
    setAccessToken('');
    setRefreshToken('');
    setUserName('');
    setRole('');
    navigate('/');
  };

  // Dynamically generate the account link based on the user's role
  const getAccountLink = () => {
    switch (role) {
      case "MANAGER":
        return "/admin";
      case "BREEDER":
        return "/breeder";
      case "User":
        return "/user-account";
      default:
        return "/account"; // Default route if no role is matched
    }
  };

  return (
    <>

      {/* Main navigation container */}
      <nav className="flex justify-between items-center bg-[#171817] text-white fixed w-full z-20 shadow-2xl">

        {/* Logo section */}
        <div className="px-5 lg:px-20 py-3 flex items-center">
          <Link to="/" className="flex items-center space-x-2">

            <img
              src={Logo}
              alt="Koi Logo"
              className="h-10 w-auto object-contain"
            />

          </Link>
        </div>

        {/* Center menu items container */}
        <div className="hidden flex-grow sm:flex justify-center mr-10">
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
        <div className="relative">
          {userName ? (
            <div className="flex items-center space-x-4 pr-10">
              {/* User button that toggles the dropdown */}
              <button onClick={toggleUserDropdown} className="flex items-center">
                <FaUserCircle className="h-6 w-6" />
                <span className="ml-2">{userName}</span>
              </button>

              {/* Dropdown content with Account and Log Out options */}
              {isUserDropdownOpen && (
                <div className="absolute top-7 left-5 mt-2 bg-[#171817] border border-gray-700 rounded-lg shadow-lg z-20">
                  <Link
                    to={getAccountLink()} // Dynamically generated link based on role
                    className="block px-4 py-2 text-left text-white hover:bg-red-500"
                  >
                    Account
                  </Link>
                  <button
                    className="block px-4 py-2 text-left text-white hover:bg-red-500"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // If the user is not logged in, show Login and Register links
            <div className="hidden lg:flex items-center space-x-2 pr-5">
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


      {/* Dropdown Menu */}
      <div
        className={`bg-blue-800 text-white ${
          isOpen ? "block" : "hidden"
        } md:hidden`}
      >
        <ul className="flex flex-col space-y-2 px-5 py-4">
          <li>
            <Link
              to="/"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <FaHome className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/auction"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <FaGavel className="h-5 w-5" />
              <span>Auction</span>
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <FaInfoCircle className="h-5 w-5" />
              <span>About Us</span>
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <FaSignInAlt className="h-6 w-6" />
              <span>Login</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <FaUserPlus className="h-6 w-6" />
              <span>Register</span>
            </Link>
          </li>
        </ul>
      </div>

    </>
  );
};

export default Header;
