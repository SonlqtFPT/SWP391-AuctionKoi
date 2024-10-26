/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import viteLogo from "/vite.svg";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import api from "../../config/axios";
import { Button } from "antd";
import Information from "../Upcomming-auction/component-upcomming/information";

function Upcomming() {
  const [upcomming, setUpcomming] = useState([]);
  const navigate = useNavigate();

  const get_auctioned_api = "auction/get-auction/waiting";

  const fetchUpcomming = async () => {
    const token = localStorage.getItem("accessToken");
    console.log("Token nè: ", token);
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
        Upcomming Auction
      </h1>
      <div className="flex flex-wrap justify-start gap-16 ml-[100px]">
        {upcomming.map((auction, index) => (
          <div key={index}>
            <button
              onClick={() => handleLotPage(auction.auctionId)}
              className="ml-10 mt-5 mb-10 h-[200px] w-[400px] bg-slate-600"
            >
              {upcomming && (
                <Information
                  auctionId={auction.auctionId}
                  lots={auction.lots}
                  startTime={auction.startTime}
                  endTime={auction.endTime}
                />
              )}
            </button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Upcomming;
