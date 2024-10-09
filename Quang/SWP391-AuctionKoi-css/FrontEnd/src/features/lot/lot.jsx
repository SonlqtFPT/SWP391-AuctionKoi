import "./index.css";
import Time from "./component-lot/time";
import Picture from "./component-lot/picture";
import Information from "./component-lot/infomation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

function Lot() {
  const [auctionId, setAuctionId] = useState(4);
  const [lots, setLots] = useState([]);

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
    } catch (error) {
      console.error("Error fetching lots: ", error);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const handleTranForm = () => {
    window.location.href = "/bid";
  };

  return (
    <div className="bg-black h-screen">
      <Header />
      <Time />
      <div className="flex items-center mt-[50px]">
        {lots.map((lot, index) => (
          <div key={index}>
            <button
              onClick={handleTranForm}
              className="h-[600px] w-[300px] bg-slate-800 ml-[200px] rounded-tl-[50px] rounded-[50px] pb-14 mb-16"
            >
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
      <Footer />
    </div>
  );
}

export default Lot;
