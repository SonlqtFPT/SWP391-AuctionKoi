import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

function TransportDetail() {
  const { transportId } = useParams();
  const navigate = useNavigate();
  const [invoiceDetail, setInvoiceDetail] = useState(null);

  const formatStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "PAID":
        return "Paid";
      case "OVERDUE":
        return "Overdue";
      case "DELIVERY_IN_PROGRESS":
        return "Delivering";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/invoice/staff/list-invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const invoiceData = response.data.data;

      // Lọc thông tin dựa trên transportId
      const invoice = invoiceData.find(
        (item) => item.invoiceId === parseInt(transportId)
      );
      if (invoice) {
        setInvoiceDetail(invoice);
      } else {
        toast.error("Invoice not found");
      }
    } catch (error) {
      toast.error("Failed to fetch data at TransportDetail.jsx", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (!invoiceDetail) {
    return <div className="m-20">Loading...</div>; // Hiển thị loading khi chưa có dữ liệu
  }

  const {
    invoiceId,
    finalAmount,
    invoiceDate,
    status,
    koiFish,
    member,
    address,
  } = invoiceDetail;

  const { fishId, gender, age, size, price, varietyName, breederName } =
    koiFish;

  const {
    account: { accountId, email, firstName, lastName, phoneNumber },
  } = member;

  function formatPrice(price) {
    // Check if price is null or undefined
    if (price === null || price === undefined) {
      return;
    }

    // Format the price as a string with commas and add the currency symbol
    return price
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0, // Ensures no decimal places are shown
      })
      .replace(/\sđ/, "đ"); // Remove the space before the currency symbol
  }

  return (
    <div>
      <Header />
      <div className="p-24">
        <button
          onClick={() => navigate("/staff")}
          className="mb-4 p-2 bg-red-500 text-white rounded"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold text-blue-400">Transport Detail</h1>

        {/* Khung thông tin hóa đơn */}
        <div className="border p-4 mb-4 mt-2 bg-slate-300">
          <h2 className="text-xl font-semibold">Invoice Information</h2>
          <p>
            <strong>Invoice ID:</strong> {invoiceId}
          </p>
          <p>
            <strong>Final Amount:</strong>
            {formatPrice(finalAmount)}
          </p>
          <p>
            <strong>Invoice Date:</strong>{" "}
            {new Date(invoiceDate).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {formatStatus(status)}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
        </div>

        {/* Khung thông tin thành viên */}
        <div className="border p-4 mb-4 bg-slate-300">
          <h2 className="text-xl font-semibold">Member Information</h2>
          <p>
            <strong>Account ID:</strong> {accountId}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>First Name:</strong> {firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {lastName}
          </p>
          <p>
            <strong>Phone Number:</strong> {phoneNumber}
          </p>
        </div>

        {/* Khung thông tin cá koi */}
        <div className="border p-4 mb-4 bg-slate-300">
          <h2 className="text-xl font-semibold">Koi Fish Information</h2>
          <p>
            <strong>Fish ID:</strong> {fishId}
          </p>
          <p>
            <strong>Gender:</strong> {gender}
          </p>
          <p>
            <strong>Age:</strong> {age}
          </p>
          <p>
            <strong>Size:</strong> {size}
          </p>
          <p>
            <strong>Price:</strong> {price}
          </p>
          <p>
            <strong>Variety Name:</strong> {varietyName}
          </p>
          <p>
            <strong>Breeder Name:</strong> {breederName}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TransportDetail;
