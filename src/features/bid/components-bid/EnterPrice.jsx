import { Input, Button } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [registrationLink, setRegistrationLink] = useState("");

  const post_bid_api = "bid/bidAuction";
  const post_regis_api = "register-lot/regis";
  const post_socket_api = `test/send?eventName=${eventName}`;

  const maxBid = startingPrice * 20; // Limit the bid to 20 times the starting price

  const handleBidNotification = async () => {
    try {
      await api.post(post_socket_api, {
        winnerName: currentMemberId,
        newPrice: bidPrice.replace(/\./g, ""),
        lotId: lotId,
      });
    } catch (error) {
      console.error("Error sending bid notification:", error);
    }
  };

  const handleBid = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        post_bid_api,
        {
          lotId: lotId,
          price: bidPrice.replace(/\./g, ""),
          memberId: currentMemberId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === "Bid placed successfully") {
        toast.success(response.data.message);
      } else {
        toast.warn(response.data.message);
      }
      fetchLot();
      fetchBidList();
      await handleBidNotification();
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
    const link = response.data.data;
    setRegistrationLink(link);
  };

  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
  };

  const handleDepositClick = () => {
    if (registrationLink) {
      window.open(registrationLink, "_blank");
    }
  };

  // Increase bid by increment, ensuring it doesn't exceed maxBid
  const increaseBid = () => {
    setBidPrice((prevBid) => {
      const newBid = prevBid
        ? Math.min(Number(prevBid) + increment, maxBid).toString()
        : Math.min(currentPrice + increment, maxBid).toString();
      return newBid;
    });
  };

  // Decrease bid, ensuring it doesn't fall below the current price + increment
  const decreaseBid = () => {
    setBidPrice((prevBid) => {
      const decreasedBid = Math.max(
        currentPrice + increment,
        Number(prevBid || currentPrice) - increment
      );
      return decreasedBid.toString();
    });
  };

  useEffect(() => {
    fetchRegisLink();

    const handleRefresh = (event) => {
      if (event.data === "payment_successful") {
        window.location.reload();
      }
    };

    window.addEventListener("message", handleRefresh);

    return () => {
      window.removeEventListener("message", handleRefresh);
    };
  }, []);

  function formatPrice(price) {
    if (price === null || price === undefined) {
      return;
    }
    return price
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\sđ/, "đ");
  }

  return (
    <div className="p-5 my-5 rounded-2xl border-2 hover:border-4 border-[#bcab6f] outline outline-offset-2 outline-white text-white shadow-md bg-gray-900 hover:bg-gray-800">
      <div className="flex flex-col sm:flex-row items-center gap-3 text-black">
        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full py-6">
          <h1 className="text-xl font-bold w-auto lg:w-48">Highest Price</h1>
          <h1 className="text-xl font-extrabold text-[#af882b]">
            {formatPrice(currentPrice)}
          </h1>
        </div>
        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full py-6">
          <h1 className="text-xl font-bold w-auto lg:w-48">Starting Price</h1>
          <h1 className="text-xl font-bold">{formatPrice(startingPrice)}</h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-7">
        {registed && remainingTime > 0 && (
          <div className="flex w-full items-center gap-2">
            <Button
              className="bg-red-500 text-black rounded-full"
              onClick={decreaseBid}
              disabled={Number(bidPrice) <= currentPrice + increment}
            >
              -
            </Button>
            <Input
              className="rounded-3xl h-[40px] w-full text-black"
              type="text"
              value={formatNumber(bidPrice)}
              onChange={(e) => {
                const newBid = e.target.value.replace(/\./g, "");
                setBidPrice(Math.min(Number(newBid), maxBid).toString());
              }}
              disabled={Number(bidPrice) >= maxBid}
            />
            <Button
              className="bg-green-400 text-white rounded-full"
              onClick={increaseBid}
              disabled={Number(bidPrice) >= maxBid}
            >
              +
            </Button>
          </div>
        )}

        {registed && remainingTime > 0 && (
          <div className="w-full lg:w-36">
            <button
              className="bg-red-600 hover:bg-red-500 rounded-2xl h-[40px] w-full lg:w-24 px-5 font-bold text-black hover:border-2 hover:border-[#bcab6f]"
              onClick={handleBid}
              disabled={Number(bidPrice) > maxBid}
            >
              Bid
            </button>
          </div>
        )}

        {!registed && (remainingTime > 0 || remainingTime === -2) && (
          <div className="w-full">
            <button
              className="bg-blue-400 hover:bg-blue-300 rounded-2xl h-[40px] w-full px-5 font-bold text-black hover:border-2 hover:border-[#bcab6f]"
              onClick={handleDepositClick}
            >
              Deposit here!
            </button>
          </div>
        )}

        <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full py-6 text-black">
          <h1 className="text-xl font-bold">Increment</h1>
          <h1 className="text-xl font-bold">{formatPrice(increment)}</h1>
        </div>
      </div>
    </div>
  );
}

export default EnterPrice;
