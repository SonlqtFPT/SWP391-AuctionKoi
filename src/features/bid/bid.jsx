/* eslint-disable no-unused-vars */
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

function Bid() {
  const [lot, setLot] = useState();
  const [remainingTime, setRemainingTime] = useState(0); // Thêm state để lưu thời gian còn lại

  const get_lot_api = "http://localhost:8080/auction/get-lot/6";

  const fetchLot = async () => {
    const token = localStorage.getItem("accessToken");
    console.log(token);
    const response = await axios.get(get_lot_api, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in Authorization header
      },
    });
    console.log("Data received from backend:", response.data);
    setLot(response.data.data);
  };

  useEffect(() => {
    fetchLot();
  }, []);

  useEffect(() => {
    if (lot) {
      const endingTime = new Date(lot.endingTime).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = endingTime - now;

        // Nếu thời gian còn lại <= 0, dừng interval
        if (timeLeft <= 0) {
          clearInterval(interval);
          setRemainingTime(-1); // Đặt giá trị đặc biệt để chỉ ra đã kết thúc
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
          {lot && <Time remainingTime={remainingTime} />}
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
                  currentMemberId={4}
                  lotId={6}
                  fetchLot={fetchLot}
                />
              )}
            </div>
            <div className="mt-4 lg:mt-[30px]">{lot && <TopBid />}</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Bid;
