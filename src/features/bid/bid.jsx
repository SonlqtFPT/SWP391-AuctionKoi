import { useState, useEffect, useRef } from "react";
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
import { io } from "socket.io-client";

function Bid() {
  const { lotId } = useParams(); // Lấy lotId từ URL
  const { auctionId } = useParams();
  const [lot, setLot] = useState();
  const [remainingTime, setRemainingTime] = useState(0);
  const [bidList, setBidList] = useState([]); // State for bid list
  const [connectionStatus, setConnectionStatus] = useState(""); // State to store connection status

  const eventName = `Event_${lotId}`;

  // Memoize socket connection using useRef to ensure it's stable across renders
  const socketRef = useRef(null);

  const get_lot_api = `http://localhost:8080/auction/get-lot/${lotId}`; // Sử dụng lotId
  const get_bidList_api = `http://localhost:8080/bid/list?lotId=${lotId}`; // API for bid list

  const fetchLot = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(get_lot_api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Api lot: ", response.data.data);
      setLot(response.data.data);
    } catch (error) {
      console.error("Error fetching lot data at bid.jsx:", error);
    }
  };

  const fetchBidList = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(get_bidList_api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const listData = response.data.data.map((bid) => ({
        bidAmount: bid.bidAmount,
        lastName: bid.member.account.lastName,
      }));
      listData.sort((a, b) => b.bidAmount - a.bidAmount);
      setBidList(listData);
    } catch (error) {
      console.error("Error fetching bid data at bid.jsx:", error);
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

  useEffect(() => {
    // Only establish the socket connection if it doesn't exist
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8081"); // Establish connection
    }

    const socket = socketRef.current; // Access the stable socket

    // Listen for the connect event
    socket.on("connect", () => {
      console.log("WebSocket Connected");
      setConnectionStatus("WebSocket Connected");
    });

    // Listen for specific event
    socket.on(eventName, (data) => {
      console.log("Received data from specific event:", data);
      fetchLot();
      fetchBidList();
    });

    // Clean up the event listener on unmount or when eventName changes
    return () => {
      socket.off(eventName); // Properly remove listener
    };
  }, [eventName]); // Only re-subscribe when eventName changes

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-hero-pattern bg-cover relative">
        <div className="absolute bg-black bg-opacity-70 inset-0"></div>
        <h1 className="relative mt-5">
          {lot && <Time remainingTime={remainingTime} auctionId={auctionId} />}
        </h1>
        <div className="flex flex-row justify-center relative mb-10">
          <div className="mt-16">
            <div className="max-w-full">
              {lot && <Picture img={lot.koiFish.imageUrl} />}
            </div>
            <div className="mt-4 lg:mt-[30px]">
              {lot && <Video vid={lot.koiFish.videoUrl} />}
            </div>
          </div>
          <div className="mr-0 lg:mr-[190px] mt-10 ">
            <div>
              {lot && (
                <Information
                  gender={lot.koiFish.gender}
                  size={lot.koiFish.size}
                  age={lot.koiFish.age}
                  breeder={lot.koiFish.breederName}
                  varietyName={lot.koiFish.varietyName}
                  fishId={lot.koiFish.fishId}
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
                  remainingTime={remainingTime}
                  eventName={eventName}
                  socket={socketRef.current} // Use stable socket instance
                />
              )}
            </div>
            <div className="mt-4 lg:mt-[20px]">
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
