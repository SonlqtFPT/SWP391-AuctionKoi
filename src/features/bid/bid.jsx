import { useState, useEffect } from "react";
import "./index.css";
import Time from "./components-bid/time";
import Picture from "./components-bid/picture";
import Information from "./components-bid/Infomation";
import EnterPrice from "./components-bid/EnterPrice";
import TopBid from "./components-bid/TopBid";
import Video from "./components-bid/Video";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom"; // Import useParams

function Bid() {
  const { lotId } = useParams(); // Lấy lotId từ URL
  const { auctionId } = useParams();
  const [lot, setLot] = useState();
  const [remainingTime, setRemainingTime] = useState(0);
  const [bidList, setBidList] = useState([]); // State for bid list

  const get_lot_api = `http://localhost:8080/auction/get-lot/${lotId}`; // Sử dụng lotId
  const get_bidList_api = `http://localhost:8080/bid/list?lotId=${lotId}`; // API for bid list

  const fetchLot = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(get_lot_api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setLot(response.data.data);
  };

  const fetchBidList = async () => {
    try {
      const response = await axios.get(get_bidList_api);
      const listData = response.data.data.map((bid) => ({
        bidAmount: bid.bidAmount,
        lastName: bid.member.account.lastName,
      }));
      listData.sort((a, b) => b.bidAmount - a.bidAmount);
      setBidList(listData);
    } catch (error) {
      console.error("Error fetching bid data:", error);
    }
  };

  useEffect(() => {
    fetchLot();
    fetchBidList();
  }, []);

  useEffect(() => {
    if (lot) {
      const endingTime = new Date(lot.endingTime).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = endingTime - now;
        if (timeLeft <= 0) {
          clearInterval(interval);
          setRemainingTime(-1);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lot]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-hero-pattern bg-cover relative">
        <div className="absolute bg-black bg-opacity-70 inset-0"></div>
        <div className="relative mt-5">
          {lot && <Time remainingTime={remainingTime} auctionId={auctionId} />}
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center relative mb-10">
          <div>
            <div className="max-w-full">
              {lot && <Picture img={lot.koiFish.imageUrl} />}
            </div>
            <div className="mt-4 lg:mt-[30px]">
              {lot && <Video vid={lot.koiFish.videoUrl} />}
            </div>
          </div>
          <div className="mr-0 lg:mr-[190px] mt-4 lg:mt-0">
            <div>
              {lot && (
                <Information
                  gender={lot.koiFish.gender}
                  size={lot.koiFish.size}
                  age={lot.koiFish.age}
                  breeder={lot.koiFish.breederName}
                />
              )}
            </div>
            <div>
              {lot && (
                <EnterPrice
                  currentPrice={lot.currentPrice}
                  startingPrice={lot.startingPrice}
                  increment={lot.increment}
                  lotId={lotId}
                  fetchLot={fetchLot}
                  fetchBidList={fetchBidList}
                />
              )}
            </div>
            <div className="mt-4 lg:mt-[30px]">
              {lot && <TopBid list={bidList} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Bid;
