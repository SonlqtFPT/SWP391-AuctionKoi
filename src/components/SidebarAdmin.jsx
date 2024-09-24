import { FaHome, FaUser, FaBell, FaSignOutAlt } from "react-icons/fa"; // Importing React icons

const SidebarAdmin = () => {
  return (
    <div className="min-h-screen flex flex-row bg-orange-400">
      <div className="flex flex-col w-56 bg-[#c74743] rounded-r-3xl overflow-hidden">
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-3xl uppercase text-white">Logo</h1>
        </div>
        <ul className="flex flex-col py-4">
          <li>
            <a
              href="#"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-200"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                <FaHome />
              </span>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-200"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                <FaUser />
              </span>
              <span className="text-sm font-medium">Profile</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-200"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                <FaBell />
              </span>
              <span className="text-sm font-medium">Notifications</span>
              <span className="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">
                5
              </span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-200"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                <FaSignOutAlt />
              </span>
              <span className="text-sm font-medium">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarAdmin;
