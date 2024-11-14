import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import axios from "axios";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  // Format price in VND
  function formatPrice(price) {
    if (price === null || price === undefined) {
      return "TBD";
    }
    return price
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\sđ/, "đ");
  }

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

  // Calculate price per kilometer based on distance
  const calculatePricePerKm = (km) => {
    if (km >= 0 && km <= 10) {
      return 0;
    } else if (km >= 11 && km <= 50) {
      return 1500;
    } else if (km >= 51 && km <= 100) {
      return 1200;
    } else if (km >= 101 && km <= 200) {
      return 1000;
    } else if (km > 200) {
      return 800;
    }
    return 0;
  };

  // Calculate estimated shipping fee based on distance and price per km
  const calculateEstimatedShippingFee = (distance) => {
    const pricePerKm = calculatePricePerKm(distance);
    return distance * pricePerKm;
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8080/invoice/get-invoices-of-winner",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "*/*",
            },
          }
        );
        setInvoices(response.data.data);
      } catch (error) {
        console.error("Error fetching invoices", error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <>
      <Header />
      <div
        style={{
          padding: "20px",
          paddingTop: "80px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {invoices.map((invoice) => {
          const distanceFormatted =
            invoice.kilometers !== null
              ? invoice.kilometers.toFixed(2) + " km"
              : "TBD";
          const shippingFee =
            invoice.kilometers !== null
              ? calculateEstimatedShippingFee(invoice.kilometers)
              : null;

          return (
            <div
              key={invoice.invoiceId}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                width: "300px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              {/* Invoice header */}
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                Invoice #{invoice.invoiceId}
              </h2>
              <p>
                <strong>Status:</strong> {formatStatus(invoice.status)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Final Amount:</strong>{" "}
                {formatPrice(invoice.finalAmount)}
              </p>
              <p>
                <strong>Bidded Price:</strong> {formatPrice(invoice.subTotal)}
              </p>
              <p>
                <strong>Platform Fee (10%):</strong> {formatPrice(invoice.tax)}
              </p>
              <p>
                <strong>Distance (km):</strong> {distanceFormatted}
              </p>
              <p>
                <strong>Shipping Fee:</strong>{" "}
                {shippingFee !== null ? formatPrice(shippingFee) : "TBD"}
              </p>
              <p>
                <strong>Address:</strong> {invoice.address ?? "TBD"}
              </p>
              <p>
                <strong>Lot ID:</strong> {invoice.lotId ?? "TBD"}
              </p>

              {/* Conditionally render the payment link if status is PENDING */}
              {invoice.status === "PENDING" && (
                <button
                  onClick={() => navigate(`/payment/${invoice.lotId}`)}
                  style={{
                    display: "block",
                    marginTop: "20px",
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  Proceed to Payment
                </button>
              )}

              {/* Koi Fish Details */}
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
              >
                Koi Fish Details
              </h3>
              <img
                src={invoice.koiFish.imageUrl}
                alt={invoice.koiFish.varietyName}
                style={{
                  width: "100%",
                  borderRadius: "4px",
                  marginTop: "10px",
                }}
              />
              <p>
                <strong>Variety:</strong> {invoice.koiFish.varietyName}
              </p>
              <p>
                <strong>Breeder:</strong> {invoice.koiFish.breederName}
              </p>
              <p>
                <strong>Age:</strong> {invoice.koiFish.age} years
              </p>
              <p>
                <strong>Size:</strong> {invoice.koiFish.size} cm
              </p>
              <p>
                <strong>Starting Price:</strong>{" "}
                {formatPrice(invoice.koiFish.price)}
              </p>

              {/* Member Details */}
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
              >
                Member Details
              </h3>
              <p>
                <strong>Name:</strong> {invoice.member.account.firstName}{" "}
                {invoice.member.account.lastName}
              </p>
              <p>
                <strong>Email:</strong> {invoice.member.account.email}
              </p>
              <p>
                <strong>Phone:</strong> {invoice.member.account.phoneNumber}
              </p>
            </div>
          );
        })}
      </div>
      <Footer />
    </>
  );
};

export default InvoiceList;
