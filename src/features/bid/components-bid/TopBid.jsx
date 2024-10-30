import { Button } from "antd";
import { useEffect, useState } from "react";

function TopBid({ list, auctionTypeName }) {
  // Nhận danh sách bid từ props
  const [topBids, setTopBids] = useState([]);

  useEffect(() => {
    // Tìm 5 bidAmount cao nhất
    const sortedBids = [...list].sort((a, b) => b.bidAmount - a.bidAmount);
    setTopBids(sortedBids.slice(0, 5));
  }, [list]);

  function formatPrice(price) {
    if (price === null || price === undefined) {
      return;
    }
    console.log(auctionTypeName);
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
          {auctionTypeName === "FIXED_PRICE_SALE"
            ? "Users Bid Participations"
            : "Top Bid"}
        </h1>
      </div>
      <div className="overflow-y-auto h-[400px]">
        {topBids.map((bid, index) => (
          <div
            key={index}
            className={`h-[70px] m-5 rounded-[20px] flex items-center justify-between pl-7 ml-10 ${
              bid.bidAmount === Math.max(...topBids.map((b) => b.bidAmount))
                ? "bg-green-500"
                : "bg-slate-400"
            }`}
          >
            <h1 className="text-xl font-bold">{bid.firstName}</h1>
            <h1 className="text-xl font-bold mr-8">
              {formatPrice(bid.bidAmount)}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopBid;
