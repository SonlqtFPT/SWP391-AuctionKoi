import { Button } from "antd";
import { useEffect, useState } from "react";

function TopBid({ list, auctionTypeName, hasEnded, winnerAccountId }) {
  const [topBids, setTopBids] = useState([]);

  useEffect(() => {
    let sortedBids = [...list].sort((a, b) => b.bidAmount - a.bidAmount);

    // If auction is not ASCENDING_BID and has ended, place the winner at the top
    if (auctionTypeName !== "ASCENDING_BID" && hasEnded) {
      const winnerIndex = sortedBids.findIndex(
        (bid) => bid.memberId === winnerAccountId
      );
      if (winnerIndex > -1) {
        // Move winner to the front of the array
        const [winnerBid] = sortedBids.splice(winnerIndex, 1);
        sortedBids = [winnerBid, ...sortedBids];
      }
    }

    // Set top 5 bids after arranging the winner at the top
    setTopBids(sortedBids.slice(0, 5));
  }, [list, auctionTypeName, hasEnded, winnerAccountId]);

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
    <div className="px-5 bg-gray-900 hover:bg-gray-800 rounded-2xl border-2 border-[#bcab6f] outline outline-offset-2 outline-white h-full w-full text-white shadow-md">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl p-5 text-[#bcab6f]">
          {auctionTypeName === "ASCENDING_BID"
            ? "Top Bid"
            : "Users Bid Participations"}
        </h1>
      </div>
      <div className="overflow-y-auto h-[400px]">
        {topBids.map((bid, index) => (
          <div
            key={index}
            className={`h-[70px] m-5 rounded-[20px] flex items-center justify-between pl-7 ml-10 ${
              auctionTypeName === "ASCENDING_BID"
                ? bid.bidAmount === Math.max(...topBids.map((b) => b.bidAmount))
                  ? "bg-green-500"
                  : "bg-slate-400"
                : hasEnded && bid.memberId === winnerAccountId
                ? "bg-green-500"
                : "bg-slate-400"
            }`}
          >
            <h1 className="text-xl font-bold">{bid.firstName}</h1>
            <h1 className="text-xl font-bold mr-8">
              {auctionTypeName === "ASCENDING_BID"
                ? formatPrice(bid.bidAmount)
                : ""}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopBid;
