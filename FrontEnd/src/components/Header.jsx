import { useState } from "react";
import {
  FaBars,
  FaHome,
  FaGavel,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import Logo from "../assets/logo/koi69Logo_white.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center bg-[#1a1c26] text-white">
        <div className="px-5 xl:px-12 py-6 flex items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {" "}
            {/* Use Link here */}
            <img
              src={Logo}
              alt="Koi69 Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl sm:text-2xl font-bold">Koi69</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex mx-auto font-semibold font-heading space-x-12">
          <li className="flex items-center space-x-2">
            <Link
              to="/"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <FaHome className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <Link
              to="/auction"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <FaGavel className="h-5 w-5" />
              <span>Auction</span>
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <Link
              to="/about"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <FaInfoCircle className="h-5 w-5" />
              <span>About Us</span>
            </Link>
          </li>
        </ul>

        {/* Login/Register Buttons */}
        <div className="hidden xl:flex items-center space-x-5 pr-5">
          <Link
            to="/login"
            className="hover:text-gray-200 flex items-center space-x-2"
            onClick={handleLinkClick}
          >
            <FaSignInAlt className="h-6 w-6" />
            <span>Login</span>
          </Link>
          <Link
            to="/register"
            className="hover:text-gray-200 flex items-center space-x-2"
            onClick={handleLinkClick}
          >
            <FaUserPlus className="h-6 w-6" />
            <span>Register</span>
          </Link>
        </div>

        {/* Hamburger Menu */}
        <button
          className="navbar-burger self-center mr-12 xl:hidden"
          onClick={toggleDropdown}
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
