import { NavLink, Outlet } from "react-router-dom"; // Use NavLink for active state styling
import { useAuth } from "../../protectedRoutes/AuthContext";

function BreederProfile() {
  const { userName, breederName } = useAuth();

  const breederLogos = {
    Dainichi:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/dainichi-logo.png?raw=true",
    Isa: "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/isa-logo.png?raw=true",
    Izumiya:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/izumiya-logo.png?raw=true",
    Kanno:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/kanno-logo.png?raw=true",
    Koi69:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/koi69Logo_dark.png?raw=true",
    Maruhiro:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/maruhiro-logo.png?raw=true",
    Marushin:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/marushin-logo.png?raw=true",
    NND: "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/nnd-logo.png?raw=true",
    PrestigeKoiBlack:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/PrestigeKoi_Black.png?raw=true",
    PrestigeKoiWhite:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/PrestigeKoi_White.png?raw=true",
    Sakai:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/sakai-logo.png?raw=true",
    Shinoda:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/shinoda-logo.png?raw=true",
    Torazo:
      "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/torazo-logo.png?raw=true",
  };

  const profileLogo =
    breederLogos[breederName] ||
    "https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/torazo-logo.png?raw=true";

  return (
    <div className="bg-black w-full relative">
      {/* Profile Header Section */}
      <section className="relative h-52 bg-hero-pattern bg-cover flex justify-center items-center mt-20">
        {/* Overlay */}
        <div className="absolute bg-black bg-opacity-70 inset-0"></div>
        {/* Profile Info */}
        <div className="relative z-10 text-center text-white flex flex-col items-center mt-10">
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full bg-white border-4 border-gray-500 overflow-hidden">
            <img
              src={profileLogo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {/* User Info */}
          <h2 className="mt-2 text-lg">{userName}</h2>
          <p className="text-sm text-gray-400">From {breederName}</p>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="bg-gray-900 text-white py-3">
        <div className="container mx-auto flex justify-center space-x-4">
          <NavLink
            to="/breeder/profile/details"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 bg-yellow-500 text-black rounded-full px-4 py-2"
                : "flex items-center space-x-2 px-4 py-2 hover:bg-yellow-500 hover:text-black rounded-full"
            }
          >
            PROFILE DETAILS
          </NavLink>
          <NavLink
            to="/breeder/profile/view-request"
            className={({ isActive }) =>
              isActive
                ? "flex items-center space-x-2 bg-yellow-500 text-black rounded-full px-4 py-2"
                : "flex items-center space-x-2 px-4 py-2 hover:bg-yellow-500 hover:text-black rounded-full"
            }
          >
            VIEW REQUEST
          </NavLink>
        </div>
      </section>

      {/* Dynamic Content */}
      <section className="p-6">
        <div className="container mx-auto">
          <Outlet /> {/* Dynamic content will load here */}
        </div>
      </section>
    </div>
  );
}

export default BreederProfile;
