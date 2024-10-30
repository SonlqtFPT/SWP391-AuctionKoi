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
  const [distance, setDistance] = useState(0); // Single state for distance
  const [updating, setUpdating] = useState(false);
  const [address, setAddress] = useState(""); // State for the address
  const [startPoint, setStartPoint] = useState({ lat: 10.8412, lng: 106.8098 });
  const [endPoint, setEndPoint] = useState(null);
  const [pricePerKm, setPricePerKm] = useState(0); // State for price per kilometer
  const [estimatedShippingFee, setEstimatedShippingFee] = useState(0); // State for estimated shipping fee

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

  // Update states whenever distance changes
  useEffect(() => {
    const newPricePerKm = calculatePricePerKm(distance.toFixed(2));
    setPricePerKm(newPricePerKm);
    calculateEstimatedShippingFee(distance.toFixed(2), newPricePerKm);
    console.log(`Distance: ${distance.toFixed(2)}`); // Log distance
  }, [distance]);

  useEffect(() => {
    const handleRefresh = (event) => {
      // Check if event.data exists and matches the expected value
      if (event?.data === "payment_successful") {
        // Reload the page when the message is received
        window.location.reload();
      }
    };

    // Add an event listener for the 'message' event
    window.addEventListener("message", handleRefresh);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleRefresh);
    };
  }, []);

  // Function to calculate price per kilometer
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
    return 0; // Default case
  };

  // Function to calculate estimated shipping fee using floored distance
  const calculateEstimatedShippingFee = (dist, price) => {
    const fee = dist * price; // Use exact distance and price per km
    console.log(dist, price, fee); // Log distance, price per km, and fee for debugging
    setEstimatedShippingFee(fee); // Update state with the estimated shipping fee
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
          invoiceId: invoice.invoiceId,
          address,
          kilometer: distance.toFixed(2), // Send the distance as kilometer
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setInvoice({
          ...response.data.data,
          address, // Add the updated address
          kilometer: distance, // Add the updated kilometer
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">
            <h2>Your payment will be ready after 1 minute</h2>
            <Spin size="large" className="mt-4" /> {/* Loading Spinner */}
          </div>
        ) : error ? (
          <div className="text-center">
            <h2>Error fetching invoice: {error.message}</h2>
          </div>
        ) : (
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
                  {invoice.invoiceId}
                </p>
                <p>
                  <span className="font-semibold">Final Amount:</span>{" "}
                  {formatPrice(invoice.finalAmount)}
                </p>
                <p>
                  <span className="font-semibold">Invoice Date:</span>{" "}
                  {new Date(invoice.invoiceDate).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Platform fee:</span>{" "}
                  {formatPrice(invoice.tax)}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span>{" "}
                  {new Date(invoice.dueDate).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Bidded Price:</span>{" "}
                  {formatPrice(invoice.subTotal)}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {invoice.status}
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
                    <label className="font-semibold">Distance:</label>
                    <Input
                      value={distance.toFixed(2)} // Display distance value
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
