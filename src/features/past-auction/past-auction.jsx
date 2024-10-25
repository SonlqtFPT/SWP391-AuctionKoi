import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import api from "../../config/axios";
import Information from "./component-past-auction/information";

function Auctioned() {
  const [auctioned, setAuctioned] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState([]);
  const navigate = useNavigate();

  const get_auctioned_api = "auction/get-auction/completed";

  const fetchAuctioned = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await api.get(get_auctioned_api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const auction = response.data.data.map((auction) => ({
      auctionId: auction.auctionId,
      startTime: auction.startTime,
      endTime: auction.endTime,
      lots: auction.lots.map((lot) => ({
        lotId: lot.lotId,
        varietyName: lot.koiFish.varietyName,
        imageUrl: lot.imageUrl,
      })),
    }));
    setAuctioned(auction);
    setIsLoading(false);
    staggerItems(auction.length);
  };

  const staggerItems = (count) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, i]);
      }, i * 150);
    }
  };

  useEffect(() => {
    fetchAuctioned();
  }, []);

  const handleLotPage = (id) => {
    navigate(`/lot/${id}`);
  };

  // Floating animation styles
  const floatInStyle = {
    opacity: 0,
    transform: "translateY(20px)",
    animation: "float-in 0.5s forwards",
  };

  const styleSheet = document.styleSheets[0];
  const keyframes = `
    @keyframes float-in {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

  return (
    <div className="bg-black flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col">
        <h1 className="text-[#e7c449] mt-[100px] ml-[calc(5vw+20px)] text-3xl font-bold">
          Past Auction
        </h1>
        <div className="flex flex-wrap justify-start gap-8 ml-[100px]">
          {isLoading ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-white text-xl">Loading...</p>
            </div>
          ) : auctioned.length > 0 ? (
            auctioned.map(
              (auction, index) =>
                visibleItems.includes(index) && (
                  <div key={index} className="flex-shrink-0 w-[30%]">
                    <button
                      onClick={() => handleLotPage(auction.auctionId)}
                      className="mt-5 mb-10 h-[200px] w-full bg-slate-600 hover:bg-opacity-60 transition-colors duration-300" // Hover effect added here
                      style={floatInStyle}
                    >
                      <Information
                        auctionId={auction.auctionId}
                        lots={auction.lots}
                        startTime={auction.startTime}
                        endTime={auction.endTime}
                      />
                    </button>
                  </div>
                )
            )
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-white text-xl">No past auctions available.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Auctioned;
