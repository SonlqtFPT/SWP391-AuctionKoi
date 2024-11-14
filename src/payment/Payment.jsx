import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, Input, Button, notification, Spin } from "antd";
import MapComponent from "./MapComponent";

const Payment = () => {
  const { lotId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [address, setAddress] = useState("");
  const [startPoint, setStartPoint] = useState({ lat: 10.8412, lng: 106.8098 });
  const [endPoint, setEndPoint] = useState(null);
  const [pricePerKm, setPricePerKm] = useState(0);
  const [estimatedShippingFee, setEstimatedShippingFee] = useState(0);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await api.get(`/invoice/get-specific-invoice`, {
          params: { lotId },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          setInvoice(response.data.data);
        } else {
          throw new Error("Failed to fetch invoice");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [lotId]);

  useEffect(() => {
    if (invoice) {
      const newPricePerKm = calculatePricePerKm(distance.toFixed(2));
      console.log(newPricePerKm);
      setPricePerKm(newPricePerKm);
      calculateEstimatedShippingFee(distance.toFixed(2), newPricePerKm);
    }
  }, [distance, invoice]);

  useEffect(() => {
    const handleRefresh = (event) => {
      if (
        typeof event.data === "string" &&
        event.data === "payment_successful"
      ) {
        window.location.reload();
      }
    };

    window.addEventListener("message", handleRefresh);
    return () => {
      window.removeEventListener("message", handleRefresh);
    };
  }, []);

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

  const calculateEstimatedShippingFee = (dist, price) => {
    console.log("Distance : " + dist + "| Price: " + price);
    const fee = dist * price;
    console.log(fee);
    setEstimatedShippingFee(fee);
  };

  const handleUpdateInvoice = async () => {
    if (!address || distance <= 0) {
      notification.error({
        message: "Error",
        description: "Please fill in both the address and a valid distance.",
      });
      return;
    }

    try {
      setUpdating(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.patch(`/invoice/update-invoice`, null, {
        params: {
          invoiceId: invoice?.invoiceId,
          address,
          kilometer: distance.toFixed(2),
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setInvoice({
          ...response.data.data,
          address,
          kilometer: distance,
        });
        notification.success({
          message: "Success",
          description: "Invoice updated successfully!",
        });
      } else {
        throw new Error("Failed to update invoice");
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update invoice. Please try again.",
      });
      console.error("Error updating invoice:", error);
    } finally {
      setUpdating(false);
    }
  };

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

  function formatPrice(price) {
    if (price === null || price === undefined) {
      return;
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

  // Conditional rendering based on invoice data
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">
            <h2>Your payment will be ready after 1 minute</h2>
            <Spin size="large" className="mt-4" />
          </div>
        ) : error ? (
          <div className="text-center">
            <h2>Error fetching invoice: {error.message}</h2>
          </div>
        ) : invoice ? ( // Ensure invoice is not null before rendering details
          <>
            <h1 className="text-2xl font-bold text-center mb-8">
              Payment for Lot: {lotId}
            </h1>

            <div className="flex justify-center space-x-4">
              <Card
                title="Invoice Details"
                style={{ width: 300 }}
                className="shadow-lg"
              >
                <p>
                  <span className="font-semibold">Invoice ID:</span>{" "}
                  {invoice.invoiceId || "Not available"}
                </p>
                <p>
                  <span className="font-semibold">Final Amount:</span>{" "}
                  {formatPrice(invoice.finalAmount)}
                </p>
                <p>
                  <span className="font-semibold">Invoice Date:</span>{" "}
                  {invoice.invoiceDate
                    ? new Date(invoice.invoiceDate).toLocaleString()
                    : "Not available"}
                </p>
                <p>
                  <span className="font-semibold">Platform fee {"(10%)"}:</span>{" "}
                  {formatPrice(invoice.tax)}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span>{" "}
                  {invoice.dueDate
                    ? new Date(invoice.dueDate).toLocaleString()
                    : "Not available"}
                </p>
                <p>
                  <span className="font-semibold">Bidded Price:</span>{" "}
                  {formatPrice(invoice.subTotal)}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {formatStatus(invoice.status)}
                </p>
                {invoice.paymentLink && invoice.status !== "PAID" ? (
                  <p>
                    <span className="font-semibold">Payment Link:</span>{" "}
                    <a
                      href={invoice.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      Click here to pay
                    </a>
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Payment Link:</span>{" "}
                    {invoice.status === "PAID"
                      ? "Payment completed."
                      : "Please update shipping details."}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Shipping Address:</span>{" "}
                  {invoice.address || "Not provided"}
                </p>
                <p>
                  <span className="font-semibold">Estimated Distance:</span>{" "}
                  {invoice.kilometers !== null &&
                  invoice.kilometers !== undefined
                    ? invoice.kilometers.toFixed(2)
                    : "Not provided"}{" "}
                  km
                </p>
                <p>
                  <span className="font-semibold">Estimated Shipping Fee:</span>{" "}
                  {invoice.kilometers !== null &&
                  invoice.kilometers !== undefined
                    ? `${formatPrice(
                        calculatePricePerKm(invoice.kilometers) *
                          invoice.kilometers
                      )}`
                    : "Not provided"}
                </p>
              </Card>

              {invoice.status !== "PAID" && (
                <Card
                  title="Update Shipping Details"
                  style={{ width: 300 }}
                  className="shadow-lg flex flex-col"
                >
                  <div className="flex flex-col mb-4">
                    <label className="font-semibold">Address:</label>
                    <Input
                      value={address}
                      placeholder="Selected address"
                      onChange={(e) => setAddress(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col mb-4">
                    <label className="font-semibold">Distance (km):</label>
                    <Input
                      value={distance.toFixed(2)}
                      placeholder="Distance in km"
                      type="number"
                      disabled
                    />
                  </div>
                  <Button
                    type="primary"
                    loading={updating}
                    onClick={handleUpdateInvoice}
                    className="mt-4"
                  >
                    Update Invoice
                  </Button>
                </Card>
              )}

              <Card
                title="Pricing Table"
                style={{ width: 300 }}
                className="shadow-lg"
              >
                <ul>
                  <li>0 - 10 km: Free</li>
                  <li>11 - 50 km: 1500 VND/km</li>
                  <li>51 - 100 km: 1200 VND/km</li>
                  <li>101 - 200 km: 1000 VND/km</li>
                  <li>200+ km: 800 VND/km</li>
                </ul>
                <div>
                  <span className="font-semibold">Price per km:</span>{" "}
                  {pricePerKm} VND
                </div>
                <div>
                  <span className="font-semibold">Estimated Shipping Fee:</span>{" "}
                  {formatPrice(estimatedShippingFee)}
                </div>
              </Card>
            </div>

            {invoice.status !== "PAID" && (
              <>
                <h2 className="text-xl font-semibold text-center mt-8 mb-4">
                  Select End Point
                </h2>
                <MapComponent
                  startPoint={startPoint}
                  endPoint={endPoint}
                  setEndPoint={setEndPoint}
                  setDistance={setDistance}
                  setAddress={setAddress}
                />
              </>
            )}
          </>
        ) : (
          <div className="text-center">
            <h2>No invoice details available.</h2>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
