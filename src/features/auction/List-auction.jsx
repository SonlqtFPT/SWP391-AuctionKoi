/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Auctioning from "./component-auction/auctioning";
import api from "../../config/axios";

function Auction() {
  const [auctionId, setAuctionId] = useState();
  const navigate = useNavigate();

  const get_auctioning_api = "auction/get-auction/auctioning";

  const fetchAuctioning = async () => {
    const token = localStorage.getItem("accessToken");
    const rtoken = localStorage.getItem("refreshToken");
    console.log("Access Token: ", token);
    console.log("Refresh Token: ", rtoken);
    const response = await api.get(get_auctioning_api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const auction = response.data.data[0]?.auctionId;
    setAuctionId(auction);
    console.log("Current Auction ID: ", auction);
  };

  useEffect(() => {
    fetchAuctioning();
  }, [auctionId]);

  const handlePastAuction = () => {
    navigate("/auctioned");
  };

  const handleUpcommingAuction = () => {
    navigate("/upcomming");
  };

  return (
    <div className="flex flex-col min-h-screen min-w-max">
      <Header />
      <div className="flex flex-col justify-center items-center h-screen bg-hero-pattern bg-cover relative">
        <div className="absolute bg-black bg-opacity-80 inset-0"></div>
        {auctionId ? (
          <Auctioning auctionId={auctionId} />
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="bg-gray-800 bg-opacity-60 p-6 rounded-lg">
              <h1 className="text-white text-3xl font-bold">
                No auction happening
              </h1>
            </div>
          </div>
        )}
        {/* Adjusted button styling for placement at the bottom */}
        <div className="absolute bottom-10 flex justify-center items-center gap-5">
          <button
            onClick={handlePastAuction}
            className="bg-yellow-400 rounded-3xl h-[60px] w-[250px] flex justify-center items-center hover:bg-yellow-500 transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            <h1 className="text-black font-bold text-lg">View Past Auctions</h1>
          </button>

          <button
            onClick={handleUpcommingAuction}
            className="bg-yellow-400 rounded-3xl h-[60px] w-[250px] flex justify-center items-center hover:bg-yellow-500 transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            <h1 className="text-black font-bold text-lg">
              View Upcoming Auctions
            </h1>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Auction;
