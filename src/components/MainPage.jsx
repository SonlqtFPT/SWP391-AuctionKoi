import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/protectedRoutes/AuthContext";
import { useEffect, useRef } from "react";

function MainPage() {
  const { userName } = useAuth();
  const sectionsRef = useRef([]);

  // Function to add "float-up" animation class when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("float-up");
            observer.unobserve(entry.target); // Optional: stop observing once animated
          }
        });
      },
      { threshold: 0.1 } // Trigger animation when 10% of the section is visible
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect(); // Clean up observer on component unmount
  }, []);

  return (
    <div className="flex-auto bg-[#131313]">
      {/* Hero-section */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="flex flex-col bg-hero-pattern bg-cover w-full mt-20 opacity-0 translate-y-20 transition-all duration-700"
      >
        <div className="max-w-xl text-center lg:text-left px-8 lg:px-20 py-10 lg:py-20 bg-gradient-to-l from-transparent via-[rgba(10,10,12,0.4)] to-[#0a0a0c] drop-shadow-2xl">
          <h1 className="text-2xl font-semibold font-mono text-amber-400 text-shadow-2xl">
            Prestige KoiAuction
          </h1>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            We Are The Best Consulting Agency
          </h2>
          <button className="bg-red-600 hover:bg-red-500 rounded-full py-3 px-4 md:py-4 md:px-5 font-bold mt-6">
            <Link to="/auction">View Auction</Link>
          </button>
        </div>
      </section>

      {/* Introduction Section */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="text-center py-10 lg:py-20 opacity-0 translate-y-20 transition-all duration-700"
      >
        <img
          src="https://redirect.zalo.me/v3/verifyv2/pc?token=OMBwnDvpLWvc2F75snXKOMC4xwlM5bHXOWJlgpWm&continue=https%3A%2F%2Fgithub.com%2FSonlqtFPT%2FSWP391-AuctionKoi%2Fblob%2F0135d35ed6dc97888160624172e071424708495a%2Fsrc%2Fassets%2FDivider%2Ft1HeaderDivider.png%3Fraw%3Dtrue"
          alt="Divider"
          className="block w-full"
        />
        <h3 className="text-2xl lg:text-3xl font-bold text-[#bcab6f] mt-2">
          Our Main Goals
        </h3>
        <p className="max-w-2xl mx-auto text-gray-50 mt-4 px-4">
          At{" "}
          <span className="text-yellow-500 font-bold">Prestige KoiAuction</span>
          , our mission is to revolutionize the online auction experience by
          providing a transparent, user-friendly platform for buyers and sellers
          alike.
        </p>
      </section>

      {/* Call to Action Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="relative bg-section-pattern bg-cover text-center flex flex-col lg:flex-row items-center justify-center py-6 opacity-0 translate-y-20 transition-all duration-700"
      >
        <div className="absolute bg-black bg-opacity-70 inset-0 z-10"></div>
        {userName ? (
          <>
            <h4 className="relative text-3xl font-extrabold text-[#bcab6f] py-6 z-20">
              Thank You For Trusting Us!
            </h4>
            <Link
              to="/auction"
              className="relative z-10 font-bold text-2xl bg-amber-500 hover:bg-amber-400 rounded-full px-20 py-3 lg:ml-10 lg:py-5"
            >
              View Auction Now!
            </Link>
          </>
        ) : (
          <>
            <h4 className="relative text-3xl font-extrabold text-[#bcab6f] py-6 z-20">
              Want To Dive Into The World Of Koi?
            </h4>
            <Link
              to="/register"
              className="relative z-10 font-bold text-2xl bg-amber-500 hover:bg-amber-400 rounded-full px-20 py-3 lg:ml-10 lg:py-5"
            >
              Register!
            </Link>
          </>
        )}
      </section>

      {/* Breeder Section */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="text-center py-10 lg:py-20 opacity-0 translate-y-20 transition-all duration-700"
      >
        <h5 className="text-3xl font-bold text-[#bcab6f]">
          Breeders Participated
        </h5>
        <p className="max-w-2xl mx-auto text-gray-50 mt-4 mb-10">
          Your direct connection to the top Japanese koi breeders
        </p>
        <div className="gap-2 w-full mb-10 z-20 sm:flex flex-wrap justify-center">
          <NavLink
            to="/saki"
            className="aspect-square sm:w-48 p-4 flex flex-col items-center justify-around bg-amber-500 rounded-xl hover:bg-amber-400"
          >
            <img
              className="max-h-[60%] max-w-[80%] h-full"
              src="https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/logo/sakai-logo.png?raw=true"
              alt={`Saki Logo`}
            />
            <span className="font-semibold">Saki</span>
          </NavLink>
          <NavLink
            to="/isa"
            className="aspect-square sm:w-48 p-4 flex flex-col items-center justify-around bg-amber-500 rounded-xl hover:bg-amber-400"
          >
            <img
              className=" max-h-[60%] max-w-[80%] h-full "
              src="https://th.bing.com/th/id/R.a0f012d976a1b109ee2bdde1147fe6cf?rik=C6AoaugI7LDLaA&riu=http%3a%2f%2fkoikichi-auction.com%2fimages%2fupload%2fbreeder%2f111320_Breeder_ISA-LOGO.jpg&ehk=Hf1sTTJWFP0CQnkh7Ln%2bLlVW3%2fYSq1ZIAFuiJoHQ6xQ%3d&risl=&pid=ImgRaw&r=0"
              alt={`Isa Logo`}
            />
            <span className="font-semibold">Isa</span>
          </NavLink>
          <NavLink
            to="/dainichi"
            className="aspect-square sm:w-48 p-4 flex flex-col items-center justify-around bg-amber-500 rounded-xl hover:bg-amber-400"
          >
            <img
              className=" max-h-[60%] max-w-[80%] h-full "
              src="https://dainichikoifarm.com/wp-content/themes/dainichi_231122/assets/images/common/main_logo.svg"
              alt={`Dainichi Logo`}
            />
            <span className="font-semibold">Dainichi</span>
          </NavLink>
          <NavLink
            to="/marushin"
            className="aspect-square sm:w-48 p-4 flex flex-col items-center justify-around bg-amber-500 rounded-xl hover:bg-amber-400"
          >
            <img
              className=" max-h-[60%] max-w-[80%] h-full "
              src="https://auctionkoi.com/images/marushin-logo.png"
              alt={`Marushin Logo`}
            />
            <span className="font-semibold">Marushin</span>
          </NavLink>
          <NavLink
            to="/kanno"
            className="aspect-square sm:w-48 p-4 flex flex-col items-center justify-around bg-amber-500 rounded-xl hover:bg-amber-400"
          >
            <img
              className=" max-h-[60%] max-w-[80%] h-full "
              src="https://auctionkoi.com/images/kanno-logo.png"
              alt={`Kanno Logo`}
            />
            <span className="font-semibold">Kanno</span>
          </NavLink>
        </div>
      </section>

      {/* Float-Up CSS */}
      <style jsx>{`
        @keyframes float-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .float-up {
          opacity: 1;
          transform: translateY(0);
          animation: float-up 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default MainPage;
