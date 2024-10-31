import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import api from "../../config/axios";

function VarietyTypePieChart() {
  const [kohaku, setKohaku] = useState(0);
  const [taishoSanke, setTaishoSanke] = useState(0);
  const [showa, setShowa] = useState(0);
  const [shiroUtsuri, setShiroUtsuri] = useState(0);
  const [utsurimono, setUtsurimono] = useState(0);
  const [beniKikokuryu, setBeniKikokuryu] = useState(0);
  const [asagi, setAsagi] = useState(0);
  const [kikokuryu, setKikokuryu] = useState(0);
  const [hikariMuji, setHikariMuji] = useState(0);
  const [goshiki, setGoshiki] = useState(0);

  const fetchRequest = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("manager/request/getRequest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data;

      // Kiểm tra và đếm các loại giống
      data.forEach((item) => {
        const varietyName = item.koiFish.variety.varietyName;
        switch (varietyName) {
          case "Kohaku":
            setKohaku((prev) => prev + 1);
            break;
          case "Taisho Sanke":
            setTaishoSanke((prev) => prev + 1);
            break;
          case "Showa":
            setShowa((prev) => prev + 1);
            break;
          case "Shiro Utsuri":
            setShiroUtsuri((prev) => prev + 1);
            break;
          case "Utsurimono":
            setUtsurimono((prev) => prev + 1);
            break;
          case "Beni Kikokuryu":
            setBeniKikokuryu((prev) => prev + 1);
            break;
          case "Asagi":
            setAsagi((prev) => prev + 1);
            break;
          case "Kikokuryu":
            setKikokuryu((prev) => prev + 1);
            break;
          case "Hikari Muji":
            setHikariMuji((prev) => prev + 1);
            break;
          case "Goshiki":
            setGoshiki((prev) => prev + 1);
            break;
          default:
            break;
        }
      });
    } catch (error) {
      console.log("Error at VarietyPieChart.jsx: ", error);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const data = {
    labels: [
      "Kohaku",
      "Taisho Sanke",
      "Showa",
      "Shiro Utsuri",
      "Utsurimono",
      "Beni Kikokuryu",
      "Asagi",
      "Kikokuryu",
      "Hikari Muji",
      "Goshiki",
    ],
    datasets: [
      {
        label: "Dataset 1",
        data: [
          kohaku,
          taishoSanke,
          showa,
          shiroUtsuri,
          utsurimono,
          beniKikokuryu,
          asagi,
          kikokuryu,
          hikariMuji,
          goshiki,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
          "rgb(255, 99, 71)",
          "rgb(60, 179, 113)",
          "rgb(255, 215, 0)",
          "rgb(128, 0, 128)",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        // Thêm phần tiêu đề
        display: true,
        text: "Variety Overview", // Tiêu đề biểu đồ
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
    <div className="w-[400px] h-[400px] bg-white shadow-xl rounded-2xl p-4">
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default VarietyTypePieChart;
