import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "../../../components/StatCard";
import { CheckCheck, CircleX, ReceiptEuro } from "lucide-react";
import api from "../../../config/axios";
import UserBarChart from "../../../components/Charts/UserBarChart";
import RequestBarChart from "../../../components/Charts/RequestBarChart";
import AuctionTypePieChart from "../../../components/Charts/AuctionTypePieChart";
import TransactionBarChar from "../../../components/Charts/TransactionBarChar";
import IncomeLineChart from "../../../components/Charts/IncomeLineChart";
import VarietyPieChart from "../../../components/Charts/VarietyTypePieChart";
import TotalAuctionPriceBarChart from "../../../components/Charts/TotalAuctionPriceBarChart";

function ManagerDashBoard() {
  const [registeredCount, setRegisteredCount] = useState();
  const [cancleCount, setCancleCount] = useState();
  const [invoiceCount, setInvoiceCount] = useState();
  const token = localStorage.getItem("accessToken");

  const fetchRequest = async () => {
    try {
      const response = await api.get("manager/request/getRequest", {
        headers: {
          Authorization: `Bearer ${token}`, // Corrected token syntax
        },
      });
      const data = response.data.data;

      // Count all requests with status "PENDING"
      setRegisteredCount(
        data.filter((item) => item.status === "REGISTERED").length
      );
      setCancleCount(data.filter((item) => item.status === "CANCELED").length);
    } catch (error) {
      console.log("Error at fetchRequest in ManagerDashBoard.jsx: ", error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await api.get("invoice/get-invoices", {
        headers: {
          Authorization: `Bearer ${token}`, // Corrected token syntax
        },
      });
      const data = response.data.data;
      setInvoiceCount(
        data.filter((item) => item.status === "DELIVERED").length
      );
    } catch (error) {
      console.log("Error at fetchInvoice in ManagerDashBoard.jsx: ", error);
    }
  };

  useEffect(() => {
    fetchRequest();
    fetchInvoice();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <h1 className="mb-8 text-blue-500 font-bold text-4xl">
        Welcome to Manager DashBoard
      </h1>
      {/* Stat Card Section */}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 lg:flex lg:justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard
          name="Total Paid Invoices"
          icon={ReceiptEuro}
          value={invoiceCount}
          color="#37AFE1"
        />
        <StatCard
          name="Registered Request"
          icon={CheckCheck}
          value={registeredCount}
          color="#32cd32"
        />
        <StatCard
          name="Cancled Request"
          icon={CircleX}
          value={cancleCount}
          color="#ff0000"
        />
      </motion.div>

      {/* Chart Income*/}
      <div className="flex justify-center gap-10 ">
        {/* <div>
          <TotalAuctionPriceBarChart />
        </div> */}
        <div className="">
          <VarietyPieChart />
        </div>
        <div className="">
          <AuctionTypePieChart />
        </div>
      </div>
      <div className="mt-32">
        <IncomeLineChart />
      </div>
    </div>
  );
}

export default ManagerDashBoard;
