import "./index.css";
import Time from "./component-lot/time";
import Picture from "./component-lot/picture";
import Information from "./component-lot/information";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";

function Lot() {
  const { auctionId } = useParams();
  const [lots, setLots] = useState([]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [remainingTime, setRemainingTime] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const get_lot_api = `auction/get-auction/${auctionId}`;

  const fetchLots = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(get_lot_api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const listLots = response.data.data.lots.map((lot) => ({
        lotId: lot.lotId,
        varietyName: lot.koiFish.varietyName,
        currentPrice: lot.currentPrice,
        breederName: lot.koiFish.breederName,
        gender: lot.koiFish.gender,
        size: lot.koiFish.size,
        age: lot.koiFish.age,
        imageUrl: lot.koiFish.imageUrl,
        auctionTypeName: lot.auctionTypeName,
      }));
      setLots(listLots);
      setStartTime(response.data.data.startTime);
      setEndTime(response.data.data.endTime);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lots: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, [auctionId]);

  useEffect(() => {
    if (lots.length) {
      const startingTime = new Date(startTime).getTime();
      const endingTime = new Date(endTime).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = endingTime - now;
        if (startingTime - now > 0) {
          clearInterval(interval);
          setRemainingTime(-2);
        } else if (timeLeft <= 0) {
          clearInterval(interval);
          setRemainingTime(-1);
        } else {
          setRemainingTime(timeLeft);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lots]);

  const handlePageChange = (lotId) => {
    navigate(`/bid/${lotId}/${auctionId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <Header />
          <div className="mt-[50px] bg-hero-pattern bg-cover relative">
            <div className="absolute bg-black bg-opacity-70 inset-0"></div>
            <div className="relative">
              <Time
                remainingTime={remainingTime}
                auctionId={auctionId}
                startTime={startTime}
              />
            </div>
            <div className="mb-10 z-20 relative p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {lots.map((lot, index) => (
                  <div
                    key={index}
                    className="float-in"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    <button
                      onClick={() => handlePageChange(lot.lotId)}
                      className="h-[625px] w-full bg-gray-900 rounded-[50px] pb-14 border-2 border-[#bcab6f] hover:bg-gray-800 hover:border-4"
                    >
                      <div className="w-full h-auto object-cover">
                        <Picture img={lot.imageUrl} />
                      </div>
                      <div className="flex justify-center font-bold mt-3">
                        <Information
                          varietyName={lot.varietyName}
                          currentPrice={lot.currentPrice}
                          breederName={lot.breederName}
                          gender={lot.gender}
                          size={lot.size}
                          age={lot.age}
                          auctionTypeName={lot.auctionTypeName}
                        />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default Lot;
