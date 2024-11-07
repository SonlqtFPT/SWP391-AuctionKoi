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

      // Biến tạm để đếm số lượng cho từng loại cá
      let counts = {
        kohaku: 0,
        taishoSanke: 0,
        showa: 0,
        shiroUtsuri: 0,
        utsurimono: 0,
        beniKikokuryu: 0,
        asagi: 0,
        kikokuryu: 0,
        hikariMuji: 0,
        goshiki: 0,
      };

      data.forEach((item) => {
        const varietyName = item.koiFish.variety.varietyName;
        switch (varietyName) {
          case "Kohaku":
            counts.kohaku++;
            break;
          case "Taisho Sanke":
            counts.taishoSanke++;
            break;
          case "Showa":
            counts.showa++;
            break;
          case "Shiro Utsuri":
            counts.shiroUtsuri++;
            break;
          case "Utsurimono":
            counts.utsurimono++;
            break;
          case "Beni Kikokuryu":
            counts.beniKikokuryu++;
            break;
          case "Asagi":
            counts.asagi++;
            break;
          case "Kikokuryu":
            counts.kikokuryu++;
            break;
          case "Hikari Muji":
            counts.hikariMuji++;
            break;
          case "Goshiki":
            counts.goshiki++;
            break;
          default:
            break;
        }
      });

      // Cập nhật trạng thái một lần cho tất cả các loại cá
      setKohaku(counts.kohaku);
      setTaishoSanke(counts.taishoSanke);
      setShowa(counts.showa);
      setShiroUtsuri(counts.shiroUtsuri);
      setUtsurimono(counts.utsurimono);
      setBeniKikokuryu(counts.beniKikokuryu);
      setAsagi(counts.asagi);
      setKikokuryu(counts.kikokuryu);
      setHikariMuji(counts.hikariMuji);
      setGoshiki(counts.goshiki);

      console.log("Counts: ", counts); // In ra tất cả các giá trị đã đếm
    } catch (error) {
      console.log("Error at VarietyPieChart.jsx: ", error);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const totalVarietyCount =
    kohaku +
    taishoSanke +
    showa +
    shiroUtsuri +
    utsurimono +
    beniKikokuryu +
    asagi +
    kikokuryu +
    hikariMuji +
    goshiki;

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
        label: "Quantity",
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
        text: "Varieties Overview", // Tiêu đề biểu đồ
        font: {
          size: 24, // Kích thước chữ tiêu đề
          weight: "bold", // Độ đm của chữ tiêu đề
        },
      },
      legend: {
        display: true,
        position: "right",
        align: "center",
        labels: {
          boxWidth: 30,
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="w-[350px] h-[400px] bg-white shadow-xl rounded-2xl p-4">
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default VarietyTypePieChart;
