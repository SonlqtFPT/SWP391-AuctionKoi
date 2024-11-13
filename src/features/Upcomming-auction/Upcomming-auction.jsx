/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import api from "../../config/axios";
import Information from "./component-upcomming/information";

function Upcomming() {
  const [upcomming, setUpcomming] = useState([]);
  const navigate = useNavigate();

  const get_auctioned_api = "auction/get-auction/waiting";

  const fetchUpcomming = async () => {
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
        startingTime: lot.startingTime,
      })),
    }));
    setUpcomming(auction);
  };

  useEffect(() => {
    fetchUpcomming();
  }, []);

  const handleLotPage = (id) => {
    navigate(`/lot/${id}`);
  };

  return (
    <div className="bg-black flex flex-col min-h-screen">
      <Header />
      <h1 className="text-[#bcab6f] mt-[100px] ml-10 text-3xl font-bold">
        Upcoming Auction
      </h1>
      <div className="flex flex-grow justify-center items-center">
        {upcomming.length > 0 ? (
          <div className="flex flex-wrap justify-start gap-8 ml-[100px]">
            {upcomming.map((auction) => (
              <div key={auction.auctionId} className="flex-none">
                <button
                  onClick={() => handleLotPage(auction.auctionId)}
                  className="h-[200px] w-[400px] bg-slate-600 flex items-center justify-center"
                >
                  <Information
                    auctionId={auction.auctionId}
                    lots={auction.lots}
                    startTime={auction.startTime}
                    endTime={auction.endTime}
                  />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <h2 className="text-white text-xl">No scheduled auctions</h2>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Upcomming;
