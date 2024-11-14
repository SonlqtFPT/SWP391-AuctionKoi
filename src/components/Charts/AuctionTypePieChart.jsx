import { useEffect, useState } from "react";
import api from "../../config/axios";
import { Pie } from "react-chartjs-2";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981"];

const AuctionTypePieChart = () => {
  const [fixedPriceSale, setFixedPriceSale] = useState(0);
  const [sealedBid, setSealedBid] = useState(0);
  const [ascesdingBid, setAscendingBid] = useState(0);
  const [descendingBid, setDescendingBid] = useState(0);

  const fetchRequest = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("manager/request/getRequest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data;
      console.log("Pie chart: ", data);
      setFixedPriceSale(
        data.filter(
          (item) => item.koiFish.auctionTypeName === "FIXED_PRICE_SALE"
        ).length
      );
      setSealedBid(
        data.filter((item) => item.koiFish.auctionTypeName === "SEALED_BID")
          .length
      );
      setAscendingBid(
        data.filter((item) => item.koiFish.auctionTypeName === "ASCENDING_BID")
          .length
      );
      setDescendingBid(
        data.filter((item) => item.koiFish.auctionTypeName === "DESCENDING_BID")
          .length
      );
      console.log(
        "1. ",
        fixedPriceSale,
        "2. ",
        sealedBid,
        "3. ",
        ascesdingBid,
        "4. ",
        descendingBid
      );
    } catch (error) {
      console.log("Error at AuctionTypePieChart.jsx: ", error);
    }
  };
  useEffect(() => {
    fetchRequest();
  }, []);

  const data = {
    labels: ["Fixed price sale", "Sealed bid", "Ascending bid"],
    datasets: [
      {
        label: "Quantity: ",
        data: [fixedPriceSale, sealedBid, ascesdingBid, descendingBid],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
        ],
        hoverOffset: 4,
        percentageLabel: "Percentage: ",
        percentageData: [
          (fixedPriceSale /
            (fixedPriceSale + sealedBid + ascesdingBid + descendingBid)) *
            100,
          (sealedBid /
            (fixedPriceSale + sealedBid + ascesdingBid + descendingBid)) *
            100,
          (ascesdingBid /
            (fixedPriceSale + sealedBid + ascesdingBid + descendingBid)) *
            100,
          (descendingBid /
            (fixedPriceSale + sealedBid + ascesdingBid + descendingBid)) *
            100,
        ],
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const quantity = tooltipItem.raw; // Lấy số lượng
            const percentage = (
              (quantity /
                (fixedPriceSale + sealedBid + ascesdingBid + descendingBid)) *
              100
            ).toFixed(2); // Tính phần trăm
            return [`Quantity: ${quantity}`, `Percentage: ${percentage}%`]; // Trả về mảng để hiển thị
          },
        },
      },
      title: {
        // Thêm phần tiêu đề
        display: true,
        text: "Auction Types Overview", // Tiêu đề biểu đồ
        font: {
          size: 24, // Kích thước chữ tiêu đề
          weight: "bold", // Độ đm của chữ tiêu đề
        },
        align: "start", // Đặt tiêu đề nằm bên trái
      },
      legend: {
        display: true,
        position: "right", // Đặt vị trí chú thích ở cuối bên phải
        align: "center", // Căn giữa chiều dọc
        labels: {
          boxWidth: 30, // Kích thước hộp màu
          padding: 10, // Khoảng cách giữa các mục
        },
      },
    },
  };

  return (
    <div className="w-[350px] h-[400px] bg-white shadow-xl rounded-2xl p-4">
      <Pie data={data} options={options} />
    </div>
  );
};

export default AuctionTypePieChart;
