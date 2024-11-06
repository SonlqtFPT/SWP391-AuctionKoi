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

// Đăng ký các scale cần thiết
Chartjs.register(CategoryScale, LinearScale, LineElement, PointElement);

const IncomeLineChart = () => {
  const [incomeDataThisYear, setIncomeDataThisYear] = useState([]);
  const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
  const [incomeDataLastYear, setIncomeDataLastYear] = useState([]);
  const [incomeDataLast2Year, setIncomeDataLast2Year] = useState([]);

  const get_invoices_api = "invoice/get-invoices";

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
        data: incomeDataThisYear,
        backgroundColor: "#f26c6d",
        borderColor: "#f26c6d",
        pointBorderWidth: 4,
        tension: 0.3,
      },
      {
        label: `Income in ${currentYear - 1}`, // Dữ liệu cho năm trước
        data: incomeDataLastYear, // Cần thêm logic để lấy dữ liệu cho năm trước
        backgroundColor: "#6d6df2", // Màu sắc khác cho năm trước
        borderColor: "#6d6df2",
        pointBorderWidth: 4,
        tension: 0.3,
      },
      {
        label: `Income in ${currentYear - 2}`, // Dữ liệu cho hai năm trước
        data: incomeDataLast2Year, // Cần thêm logic để lấy dữ liệu cho hai năm trước
        backgroundColor: "#6df26d", // Màu sắc khác cho hai năm trước
        borderColor: "#6df26d",
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
      title: {
        // Thêm phần tiêu đề
        display: true,
        text: "Yearly Income Summary", // Tiêu đề biểu đồ
        font: {
          size: 24, // Kích thước chữ tiêu đề
          weight: "bold", // Độ đậm của chữ tiêu đề
        },
        align: "start", // Đặt tiêu đề nằm bên trái
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
      const response = await api.get(get_invoices_api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const requestData = response.data.data; // Lấy dữ liệu giao dịch

      // Khởi tạo mảng để lưu tổng amount cho từng tháng
      const monthlyTotalsThisYear = Array(12).fill(0);
      const monthlyTotalsLastYear = Array(12).fill(0);
      const monthlyTotalsLast2Year = Array(12).fill(0);

      // Duyệt qua dữ liệu giao dịch
      requestData.forEach((transaction) => {
        const transactionDate = new Date(transaction.invoiceDate); // Lấy invoice theo từng tháng
        const month = transactionDate.getMonth(); // Lấy tháng (0-11)
        const shippingCost = calculateShippingCost(transaction.kilometers); // Tính toán chi phí vận chuyển
        const calculatedAmount = transaction.subTotal * 0.1 + shippingCost; // Cập nhật công thức tính toán

        if (transaction.status === "DELIVERED") {
          if (transactionDate.getFullYear() === currentYear) {
            monthlyTotalsThisYear[month] += calculatedAmount; // Cộng dồn amount vào tháng tương ứng
          } else if (transactionDate.getFullYear() === currentYear - 1) {
            monthlyTotalsLastYear[month] += calculatedAmount; // Cộng dồn amount cho năm trước
          } else if (transactionDate.getFullYear() === currentYear - 2) {
            monthlyTotalsLast2Year[month] += calculatedAmount; // Cộng dồn amount cho hai năm trước
          }
        }
      });

      console.log("Line Chart This Year: ", monthlyTotalsThisYear);
      console.log("Line Chart Last Year: ", monthlyTotalsLastYear);
      console.log("Line Chart Two Years Ago: ", monthlyTotalsLast2Year);

      setIncomeDataThisYear(monthlyTotalsThisYear); // Cập nhật state với tổng amount theo tháng cho năm hiện tại
      setIncomeDataLastYear(monthlyTotalsLastYear); // Cập nhật state với tổng amount theo tháng cho năm trước
      setIncomeDataLast2Year(monthlyTotalsLast2Year); // Cập nhật state với tổng amount theo tháng cho hai năm trước
    } catch (error) {
      console.log("Error at IncomeLineChart.jsx: ", error);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  return (
    <div className="h-[600px] w-max flex justify-center bg-white shadow-2xl rounded-2xl p-4">
      <Line data={data} options={options}></Line>
    </div>
  );
};

export default IncomeLineChart;
