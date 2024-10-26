/* eslint-disable react/prop-types */
import { Input, Button } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Socket } from "socket.io-client";
import api from "../../../config/axios";

function EnterPrice({
  currentPrice,
  startingPrice,
  increment,
  currentMemberId,
  lotId,
  fetchLot,
  fetchBidList,
  remainingTime,
  eventName,
  registed,
}) {
  const [bidPrice, setBidPrice] = useState("");
  const [registrationLink, setRegistrationLink] = useState(""); // Thêm state để lưu link đăng ký

  const post_bid_api = "bid/bidAuction"; //Bid
  const post_regis_api = "register-lot/regis"; //Deposit
  const post_socket_api = `test/send?eventName=${eventName}`;

  const handleBidNotification = async () => {
    try {
      await api.post(post_socket_api, {
        winnerName: currentMemberId, // Tên người thắng
        newPrice: bidPrice.replace(/\./g, ""), // Giá mới
        lotId: lotId, // ID của lô
      });
    } catch (error) {
      console.error("Error sending bid notification:", error);
    }
  };

  const handleBid = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // Move the headers object outside of the data you're sending
      const response = await api.post(
        post_bid_api,
        {
          lotId: lotId,
          price: bidPrice.replace(/\./g, ""), // Format price
          memberId: currentMemberId, // Ensure this is correctly passed
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      if (response.data.message == "Bid placed successfully") {
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.message);
      }
      fetchLot();
      fetchBidList();
      await handleBidNotification(); // Gọi hàm thông báo sau khi đặt giá thầu
      setRegistrationLink("");
    } catch (error) {
      console.error("Error submitting bid:", error);
      console.log("Registration link: ", registrationLink);
    }
  };

  const fetchRegisLink = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await api.post(
      post_regis_api,
      {
        lotId: lotId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Đạ dang ki chua? ", registed);
    const link = response.data.data;
    console.log("Link: ", link);
    setRegistrationLink(link);
  };

  // Hàm định dạng số
  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""; // {{ edit_8 }}
  };

  const handleDepositClick = () => {
    if (registrationLink) {
      window.open(registrationLink, "_blank"); // Mở link trong tab mới
    }
  };

  useEffect(() => {
    fetchRegisLink();
  }, []);

  return (
    <div
      className={`p-5 my-5 rounded-2xl border-2 hover:border-4 border-[#bcab6f] outline outline-offset-2 outline-white text-white shadow-md bg-gray-900 hover:bg-gray-800`}
    >
      {/* Price Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3  text-black">
        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full py-6">
          <h1 className="text-xl font-bold w-auto lg:w-48">Highest Price</h1>
          <h1 className="text-xl font-extrabold  text-[#af882b]">
            {formatNumber(currentPrice)}
          </h1>
        </div>
        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full py-6">
          <h1 className="text-xl font-bold w-auto lg:w-48">Starting Price</h1>
          <h1 className="text-xl font-bold">{formatNumber(startingPrice)}</h1>
        </div>
      </div>

      {/* Bid Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-7">
        {/* Bid Input */}
        {registed && remainingTime > 0 && (
          <div className="w-full ">
            <Input
              className="rounded-3xl h-[40px] w-full text-black"
              type="text"
              value={formatNumber(bidPrice)}
              onChange={(e) => setBidPrice(e.target.value.replace(/\./g, ""))}
            />
          </div>
        )}

        {registed && remainingTime > 0 && (
          <div className="w-full lg:w-36 ">
            <button
              className="bg-red-600 hover:bg-red-500 rounded-2xl h-[40px] w-full lg:w-24 px-5 font-bold text-black hover:border-2 hover:border-[#bcab6f]"
              onClick={handleBid}
            >
              Bid
            </button>
          </div>
        )}

        {/* Deposit Button */}
        {!registed && (remainingTime > 0 || remainingTime == -2) && (
          <div className=" w-full ">
            <button
              className="bg-blue-400 hover:bg-blue-300 rounded-2xl h-[40px] w-full px-5 font-bold text-black hover:border-2 hover:border-[#bcab6f]"
              onClick={handleDepositClick}
            >
              Deposit here!
            </button>
          </div>
        )}

        {/* Increment Section */}
        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full py-6 text-black">
          <h1 className="text-xl font-bold">Increment</h1>
          <h1 className="text-xl font-bold">{formatNumber(increment)}</h1>
        </div>
      </div>
    </div>
  );
}

export default EnterPrice;
