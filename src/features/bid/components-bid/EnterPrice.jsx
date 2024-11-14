import { Input, Button } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";

function EnterPrice({
  currentPrice,
  startingPrice,
  increment,
  currentAccountId,
  lotId,
  fetchLot,
  fetchBidList,
  remainingTime,
  eventName,
  registed,
  auctionTypeName,
  isLogin,
}) {
  const [bidPrice, setBidPrice] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [hasBid, setHasBid] = useState(false); // State to track if the member has bid
  const navigate = useNavigate();

  const post_bid_api = "bid/bidAuction";
  const post_regis_api = "register-lot/regis";
  const post_socket_api = `test/send?eventName=${eventName}`;
  const fetch_bids_api = `bid/list?lotId=${lotId}`;

  const maxBid = startingPrice * 20;

  useEffect(() => {
    if (auctionTypeName === "FIXED_PRICE_SALE") {
      setBidPrice(startingPrice);
    }
  }, [auctionTypeName, startingPrice]);

  // Fetch existing bids
  const fetchExistingBids = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(fetch_bids_api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if currentAccountId matches any accountId in the bids
      const existingBids = response.data.data || [];
      const userHasBid = existingBids.some(
        (bid) => bid.member.account.accountId === currentAccountId
      );
      setHasBid(userHasBid);
    } catch (error) {
      console.error("Error fetching existing bids:", error);
    }
  };

  const handleBidNotification = async () => {
    try {
      await api.post(post_socket_api, {
        winnerName: currentAccountId,
        newPrice: bidPrice.replace(/\./g, ""),
        lotId: lotId,
      });
    } catch (error) {
      console.error("Error sending bid notification:", error);
    }
  };

  const handleBid = async () => {
    // Fetch existing bids and check if the user has already placed a bid
    await fetchLot(); // Refresh lot data
    await fetchBidList(); // Refresh bid list
    await fetchExistingBids();

    if (auctionTypeName === "ASCENDING_BID" && bidPrice > maxBid) {
      toast.warn("You can't bid higher than max bid");
      return;
    }

    // Check if user has already bid for fixed price sale
    if (auctionTypeName === "FIXED_PRICE_SALE" && hasBid) {
      toast.warn("You can only bid once for a fixed price sale.");
      return;
    }

    if (auctionTypeName === "SEALED_BID" && hasBid) {
      toast.warn("You can only bid once for sealed bid.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        post_bid_api,
        {
          lotId: lotId,
          price: bidPrice,
          memberId: currentAccountId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Bid placed successfully") {
        toast.success(response.data.message);
        fetchLot(); // Refresh lot data
        fetchBidList(); // Refresh bid list
        await handleBidNotification(); // Notify other participants
        await fetchExistingBids();
      } else {
        toast.warn(response.data.message);
      }

      // Clear the registration link after a successful bid
      setRegistrationLink("");
    } catch (error) {
      console.error("Error submitting bid:", error);
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

  useEffect(() => {
    fetchRegisLink();
    fetchExistingBids(); // Fetch existing bids when the component mounts

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

  const increaseBid = () => {
    const newBidPrice = Math.min(
      Number(bidPrice || startingPrice) + increment,
      maxBid
    );
    setBidPrice(newBidPrice);
  };

  const decreaseBid = () => {
    const newBidPrice = Math.max(
      Number(bidPrice || startingPrice) - increment,
      currentPrice
    );
    setBidPrice(newBidPrice);
  };

  const handleLoginChange = () => {
    navigate("/login");
  };

  return (
    <div className="p-5 my-5 rounded-2xl border-2 hover:border-4 border-[#bcab6f] outline outline-offset-2 outline-white text-white shadow-md bg-gray-900 hover:bg-gray-800">
      <div className="flex flex-col sm:flex-row items-center gap-3 text-black">
        {/* Only show the highest price when the auction type is NOT SEALED_BID */}
        {auctionTypeName !== "SEALED_BID" && (
          <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full py-6">
            <h1 className="text-xl font-bold w-auto lg:w-48">
              {auctionTypeName === "FIXED_PRICE_SALE"
                ? "Fixed Price Sale:"
                : "Highest Price"}
            </h1>
            <h1 className="text-xl font-extrabold text-[#af882b]">
              {formatPrice(
                auctionTypeName === "FIXED_PRICE_SALE"
                  ? startingPrice
                  : currentPrice
              )}
            </h1>
          </div>
        )}

        {/* Only show starting price when auction type is NOT FIXED_PRICE_SALE */}
        {auctionTypeName !== "FIXED_PRICE_SALE" && (
          <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full py-6">
            <h1 className="text-xl font-bold w-auto lg:w-48">Starting Price</h1>
            <h1 className="text-xl font-bold">{formatPrice(startingPrice)}</h1>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-7">
        {registed &&
          remainingTime > 0 &&
          currentPrice < maxBid &&
          (auctionTypeName === "ASCENDING_BID" ||
            auctionTypeName === "SEALED_BID") && (
            <div className="flex w-full items-center gap-2">
              <Button
                className="bg-red-500 text-black rounded-full"
                onClick={decreaseBid}
                disabled={hasBid && auctionTypeName === "SEALED_BID"}
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
                disabled={hasBid && auctionTypeName === "SEALED_BID"}
              />
              <Button
                className="bg-green-400 text-white rounded-full"
                onClick={increaseBid}
                disabled={hasBid && auctionTypeName === "SEALED_BID"}
              >
                +
              </Button>
            </div>
          )}
        {!isLogin && (
          <Button
            className="bg-red-600 w-52 h-12 rounded-3xl"
            onClick={handleLoginChange}
          >
            Login
          </Button>
        )}
        {registed && remainingTime > 0 && currentPrice < maxBid && (
          <div className="w-full lg:w-36">
            {hasBid &&
            (auctionTypeName === "FIXED_PRICE_SALE" ||
              auctionTypeName === "SEALED_BID") ? (
              <div className="text-red-500 font-bold w-full ">
                You have already bid! Please wait for bidding result.
              </div>
            ) : (
              <button
                className="bg-red-600 hover:bg-red-500 rounded-2xl h-[40px] w-full lg:w-24 px-5 font-bold text-black hover:border-2 hover:border-[#bcab6f]"
                onClick={handleBid}
                disabled={hasBid && auctionTypeName === "SEALED_BID"}
              >
                Bid
              </button>
            )}
          </div>
        )}

        {currentPrice >= maxBid && (
          <div className="flex w-full justify-between">
            <div className="text-red-500 font-bold">Max bid reached</div>
            <div className="flex-1" /> {/* Spacer to balance the layout */}
          </div>
        )}

        {isLogin &&
          !registed &&
          (remainingTime > 0 || remainingTime === -2) &&
          currentPrice < maxBid && (
            <div className="w-full">
              <button
                className="bg-blue-400 hover:bg-blue-300 rounded-2xl h-[40px] w-full px-5 font-bold text-black hover:border-2 hover:border-[#bcab6f]"
                onClick={handleDepositClick}
              >
                Deposit here!
              </button>
            </div>
          )}

        {/* Increment section will be hidden if auction type is FIXED_PRICE_SALE */}
        {auctionTypeName === "ASCENDING_BID" && (
          <div className="bg-slate-500 h-[40px] rounded-full flex items-center justify-between pl-5 pr-8 w-full py-6 text-black">
            <h1 className="text-xl font-bold">Increment</h1>
            <h1 className="text-xl font-bold">{formatPrice(increment)}</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnterPrice;
