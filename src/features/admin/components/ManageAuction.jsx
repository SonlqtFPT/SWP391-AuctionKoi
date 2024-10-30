import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { TbGavel } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const ManageAuction = () => {
  const [auctionList, setAuctionList] = useState([]);
  const navigate = useNavigate();
  const fetchAuction = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("auction/get-all-auction", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Auction list: ", response.data.data);
      const data = response.data.data;
      setAuctionList(data);
    } catch (error) {
      console.log("Error at ManageAuction: ", error);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, []);

  const handleLotPage = (id) => {
    navigate(`/lot/${id}`);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "WAITING":
        return "Upcoming";
      case "AUCTIONING":
        return "On going";
      case "COMPLETED":
        return "Ended";
    }
  };

  const formatTime = (time) => {
    const date = new Date(time); // Create a Date object from the time
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit", // Add seconds to the format
      hour12: false, // Change to true for 12-hour format
    };
    return date.toLocaleString("en-US", options); // Use toLocaleString for full date and time formatting
  };
  return (
    <div className="">
      <h1 className="text-3xl font-bold" style={{ color: "#507687" }}>
        Auction List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctionList.map((auction, index) => (
          <div key={index}>
            <button
              onClick={() => handleLotPage(auction.auctionId)}
              className="ml-10 mt-5 mb-10 h-[200px] w-[400px] rounded-lg"
              style={{ backgroundColor: "#384B70" }}
            >
              <div>
                <h1 className="text-[#bcab6f] text-3xl font-bold pt-5 pr-[200px]">
                  Auction#{auction.auctionId}
                </h1>
                <div className="flex items-start ml-5">
                  <TbGavel className="h-[150px] w-[70px] text-white pb-3" />
                  <div className="mt-10 ml-3">
                    <div>
                      <h2 className="text-white flex items-center text-sm">
                        {formatTime(auction.startTime)} -{" "}
                        {formatTime(auction.endTime)}
                      </h2>
                    </div>
                    <div className="flex items-start">
                      <h1 className="text-white text-xl font-bold">Status:</h1>
                      <h2 className="text-white text-l ml-1 mt-1">
                        {getStatusText(auction.status)}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAuction;
