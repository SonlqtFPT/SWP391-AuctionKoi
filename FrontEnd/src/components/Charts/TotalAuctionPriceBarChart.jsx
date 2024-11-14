import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../../config/axios";

function TotalAuctionPriceBarChart() {
  const [total, setTotal] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);

  const get_auctionPrice_api = "invoice/get-all-auctioned-fish-prices";

  const fetchAuctionPrice = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(get_auctionPrice_api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const requestData = response.data.data;

      const monthly = Array(12).fill(0);
      requestData.forEach((x) => {
        const priceInMonth = new Date(x.endTime);
        const month = priceInMonth.getMonth();
        if (priceInMonth.getFullYear() == selectedYear) {
          monthly[month] += x.subTotal;
        }
      });
      console.log("monthly: ", monthly);
      setTotal(monthly);
    } catch (error) {
      console.log("Error at TotalAuctionPriceBarChart.jsx: ", error);
    }
  };

  useEffect(() => {
    fetchAuctionPrice();
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    fetchAuctionPrice();
  };

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "April",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Yearly Auction Price Totals by Month in " + selectedYear,
        data: total,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(255, 0, 0, 0.2)",
          "rgba(0, 0, 128, 0.2)",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 20, // Thay đổi kích thước chữ ở đây
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="w-[700px] h-[400px] bg-white rounded-2xl shadow-2xl">
        <select
          onChange={handleYearChange}
          value={selectedYear}
          className="bg-slate-200 rounded-md m-2 w-14 h-7 shadow-2xl"
        >
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
          <option value={2022}>2022</option>
          <option value={2021}>2021</option>
          <option value={2020}>2020</option>
          <option value={2019}>2019</option>
          <option value={2018}>2018</option>
        </select>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default TotalAuctionPriceBarChart;
