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

function Bid() {
  const [lot, setLot] = useState();
  const [remainingTime, setRemainingTime] = useState(0); // Thêm state để lưu thời gian còn lại

  const get_lot_api = "http://localhost:8080/auction/get-lot/1";

  const fetchLot = async () => {
    const response = await axios.get(get_lot_api);
    console.log("Data received from backend:", response.data);
    setLot(response.data.data);
  };

  useEffect(() => {
    fetchLot();
  }, []);

  useEffect(() => {
    if (lot) {
      // Kiểm tra lot và endingTime
      const endingTime = new Date(lot.endingTime).getTime(); // Lấy thời gian kết thúc
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = endingTime - now; // Tính thời gian còn lại
        setRemainingTime(timeLeft);

        // Nếu thời gian còn lại <= 0, dừng interval
        if (timeLeft <= 0) {
          clearInterval(interval);
          setRemainingTime("Ended"); // Đặt thời gian còn lại về 0
        }
      }, 1000); // Cập nhật mỗi giây

      return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }
  }, [lot]);

  return (
    <div className="bg-black pt-10 h-full">
      <div>{lot && <Time remainingTime={remainingTime} />}</div>
      {/* Truyền remainingTime xuống Time */}
      <div className="flex justify-center">
        <div>
          <div className="">
            {lot && <Picture img={lot.koiFish.imageUrl} />}
          </div>
          <div className="mt-[30px]">
            {lot && <Video vid={lot.koiFish.videoUrl} />}
          </div>
        </div>
        <div className="mr-[190px]">
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
          <div className="">
            {lot && (
              <EnterPrice
                currentPrice={lot.currentPrice}
                startingPrice={lot.startingPrice}
                increment={lot.increment}
                currentMemberId={4}
                lotId={1}
                fetchLot={fetchLot}
              />
            )}
          </div>
          <div className="mt-[30px]">{lot && <TopBid />}</div>
        </div>
      </div>
    </div>
  );
}

export default Bid;
