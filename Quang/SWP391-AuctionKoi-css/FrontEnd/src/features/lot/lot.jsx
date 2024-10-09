import "./index.css";
import Time from "./component-lot/time";
import Picture from "./component-lot/picture";
import Information from "./component-lot/infomation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { useEffect } from "react";

function Lot() {
  const [auctionId, setAuctionId] = useState(4);
  const [lots, setLots] = useState([]);
  const [endTime, setEndTime] = useState();
  const [remainingTime, setRemainingTime] = useState();

  const get_lot_api = `http://localhost:8080/auction/get-auction/${auctionId}`;

  const fetchLots = async () => {
    try {
      const response = await axios.get(get_lot_api);
      console.log("API: ", response.data.data);
      const listLots = response.data.data.lots.map((lot) => ({
        // Cập nhật ở đây
        varietyName: lot.koiFish.varietyName,
        currentPrice: lot.currentPrice,
        breederName: lot.koiFish.breederName,
        gender: lot.koiFish.gender,
        size: lot.koiFish.size,
        age: lot.koiFish.age,
        imageUrl: lot.koiFish.imageUrl,
      }));
      setLots(listLots);
      console.log("data nhận dc: ", listLots); // Cập nhật để in ra danh sách lots
      setEndTime(response.data.data.endTime);
      console.log("End time ", response.data.data.endTime);
    } catch (error) {
      console.error("Error fetching lots: ", error);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  useEffect(() => {
    if (lots) {
      const endingTime = new Date(endTime).getTime();
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
  }, [lots]);

  const handleTransform = () => {

  };
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-hero-pattern bg-cover relative">
        <div className="absolute bg-black bg-opacity-70 inset-0 "></div>
        {lots && <Time remainingTime={remainingTime} />}
        {/* Main content */}
        <div className="relative z-20 m-10">
          {lots.map((lot, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center justify-center space-y-10 md:space-y-0 md:space-x-10 my-5">
              <button onClick={handleTransform}
                className="flex items-center space-x-10 h-[600px] w-[300px] bg-[#171817] rounded-tl-[50px] rounded-[50px] shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out mt-10">
                {lots && <Picture img={lot.imageUrl} />}
                <div>
                  {lots && (
                    <Information
                      varietyName={lot.varietyName}
                      currentPrice={lot.currentPrice}
                      breederName={lot.breederName}
                      gender={lot.gender}
                      size={lot.size}
                      age={lot.age}
                    />
                  )}
                </div>

              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Lot;
