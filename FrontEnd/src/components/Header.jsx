import { useState } from "react";
import {
  FaBars,
  FaHome,
  FaGavel,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="flex justify-between items-center bg-[#1a1c26] text-white">
        <div className="px-5 xl:px-12 py-6 flex items-center">
          {/* Logo */}
          <a className="text-3xl font-bold font-heading" href="/">
            Koi69
          </a>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex mx-auto font-semibold font-heading space-x-12">
          <li className="flex items-center space-x-2">
            <a
              href="/"
              className="hover:text-gray-200 flex items-center space-x-2"
            >
              <FaHome className="h-5 w-5" />
              <span>Home</span>
            </a>
          </li>
          <li className="flex items-center space-x-2">
            <a
              href="/auction"
              className="hover:text-gray-200 flex items-center space-x-2"
            >
              <FaGavel className="h-5 w-5" />
              <span>Auction</span>
            </a>
          </li>
          <li className="flex items-center space-x-2">
            <a
              href="/about"
              className="hover:text-gray-200 flex items-center space-x-2"
            >
              <FaInfoCircle className="h-5 w-5" />
              <span>About Us</span>
            </a>
          </li>
        </ul>

        {/* Login/Register Buttons */}
        <div className="hidden xl:flex items-center space-x-5 pr-5">
          <a
            href="/login"
            className="hover:text-gray-200 flex items-center space-x-2"
          >
            <FaSignInAlt className="h-6 w-6" />
            <span>Login</span>
          </a>
          <a
            href="/register"
            className="hover:text-gray-200 flex items-center space-x-2"
          >
            <FaUserPlus className="h-6 w-6" />
            <span>Register</span>
          </a>
        </div>

        {/* Hamburger Menu */}
        <button
          className="navbar-burger self-center mr-12 xl:hidden"
          href="#"
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
            <a
              href="/"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <FaHome className="h-5 w-5" />
              <span>Home</span>
            </a>
          </li>
          <li>
            <a
              href="/auction"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <FaGavel className="h-5 w-5" />
              <span>Auction</span>
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <FaInfoCircle className="h-5 w-5" />
              <span>About Us</span>
            </a>
          </li>
          <li>
            <a
              href="/login"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <FaSignInAlt className="h-6 w-6" />
              <span>Login</span>
            </a>
          </li>
          <li>
            <a
              href="/register"
              className="hover:text-gray-200 flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <FaUserPlus className="h-6 w-6" />
              <span>Register</span>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;
