import { Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

function TopBid() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [bidAmount, setBidAmount] = useState();
  const get_bidList_api = "http://localhost:8080/bid/list?lotId=1";

  const fetchList = async () => {
    try {
      const response = await axios.get(get_bidList_api);
      console.log("Data received from backend:", response.data);
      const listData = response.data.data.map((bid) => ({
        bidAmount: bid.bidAmount,
        lastName: bid.member.account.lastName,
      }));
      listData.sort((a, b) => b.bidAmount - a.bidAmount);
      setList(listData);

      // Cập nhật name và bidAmount từ danh sách đầu tiên

      console.log("qq: ", name, bidAmount);
    } catch (error) {
      console.error("Error fetching bid data:", error);
    }
  };

  // Tìm 5 bidAmount cao nhất
  const topBids = list.slice(0, 5);
  const highestBid =
    topBids.length > 0 ? Math.max(...topBids.map((bid) => bid.bidAmount)) : 0;

  useEffect(() => {
    fetchList();
  }, []);

  // // Tìm bidAmount cao nhất
  // const highestBid =
  //   list.length > 0 ? Math.max(...list.map((bid) => bid.bidAmount)) : 0;

  return (
    <div className="ml-[30px] bg-slate-600 rounded-3xl h-[550px] w-[800px] text-white shadow-md">
      <div className="flex justify-between">
        <h1 className="font-bold text-3xl p-5">Top Bid</h1>
        <Button className="font-bold m-6 rounded-3xl">Refesh </Button>
      </div>
      {/* Hiển thị 5 bid cao nhất */}
      {topBids.map((bid, index) => (
        <div
          key={index}
          className={`h-[70px] w-[700px] m-5 rounded-[20px] flex items-center justify-between pl-7 ml-10 ${
            bid.bidAmount === highestBid ? "bg-green-500" : "bg-slate-400"
          }`}
        >
          <h1 className="text-xl font-bold">{bid.lastName}</h1>
          <h1 className="text-xl font-bold mr-8">{bid.bidAmount}</h1>
        </div>
      ))}
    </div>
  );
}

export default TopBid;
