import React, { useEffect, useState } from "react";
import {
  Chart as Chartjs,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  plugins,
  Legend,
  scales,
} from "chart.js/auto";
import { Line } from "react-chartjs-2";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Grid, HandCoins } from "lucide-react";
import { Label } from "recharts";

// Đăng ký các scale cần thiết
Chartjs.register(CategoryScale, LinearScale, LineElement, PointElement);

const IncomeLineChart = () => {
  const [incomeData, setIncomeData] = useState([]);
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

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
        label: `Income in ${currentYear}`,
        data: incomeData,
        backgroundColor: "#f26c6d",
        borderColor: "#f26c6d",
        pointBorderWidth: 4,
        tension: 0.3,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "black",
          font: {
            size: 20, // Kích thước chữ
            weight: "bold", // Độ đậm của chữ
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "VNĐ",
        },
        ticks: {
          callback: (value) => formatValue(value),
        },
      },
    },
  };

  const formatValue = (value) => {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + "B"; // Hàng tỉ
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + "M"; // Hàng triệu
    }
    return value; // Trả về giá trị gốc nếu không thuộc hàng triệu hoặc hàng tỉ
  };

  const calculateShippingCost = (kilometers) => {
    if (kilometers <= 10) {
      return 0; // Free
    } else if (kilometers <= 50) {
      return kilometers * 1500; // 1500 VND/km
    } else if (kilometers <= 100) {
      return kilometers * 1200; // 1200 VND/km
    } else if (kilometers <= 200) {
      return kilometers * 1000; // 1000 VND/km
    } else {
      return kilometers * 800; // 800 VND/km
    }
  };

  const fetchRequest = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("invoice/get-invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const requestData = response.data.data; // Lấy dữ liệu giao dịch

      // Khởi tạo mảng để lưu tổng amount cho từng tháng
      const monthlyTotals = Array(12).fill(0);

      // Duyệt qua dữ liệu giao dịch
      requestData.forEach((transaction) => {
        const transactionDate = new Date(transaction.invoiceDate);
        if (
          transaction.status === "PAID" &&
          transactionDate.getFullYear() === currentYear
        ) {
          const month = transactionDate.getMonth(); // Lấy tháng (0-11)
          const shippingCost = calculateShippingCost(transaction.kilometers); // Tính toán chi phí vận chuyển
          const calculatedAmount = transaction.subTotal * 0.1 + shippingCost; // Cập nhật công thức tính toán
          monthlyTotals[month] += calculatedAmount; // Cộng dồn amount vào tháng tương ứng
        }
      });

      console.log("Tổng amount theo từng tháng: ", monthlyTotals);
      setIncomeData(monthlyTotals); // Cập nhật state với tổng amount theo tháng
    } catch (error) {
      toast.error("Failed to fetch auction request data");
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  return (
    <div className="h-[600px] w-[1100px] flex justify-center ml-16 bg-white shadow-2xl rounded-2xl p-4">
      <Line data={data} options={options}></Line>
    </div>
  );
};

export default IncomeLineChart;
