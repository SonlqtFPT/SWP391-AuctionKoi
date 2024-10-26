import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, Input, Button, notification } from "antd";
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
    // Calculate price per km and estimated shipping fee whenever distance changes
    const newPricePerKm = calculatePricePerKm(Math.ceil(distance));
    setPricePerKm(newPricePerKm);
    calculateEstimatedShippingFee(Math.ceil(distance), newPricePerKm);
    console.log(`Distance: ${distance}`); // Log distance
  }, [distance]);

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
    const flooredDistance = Math.ceil(dist); // Round up to the nearest whole number
    console.log(flooredDistance);
    const fee = flooredDistance * price; // Estimated fee based on floored distance and price per km
    setEstimatedShippingFee(fee); // Update state with the estimated shipping fee
  };

  const handleUpdateInvoice = async () => {
    if (!address || distance <= 0) {
      // Ensure distance is positive
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
          kilometer: distance, // Send the distance as kilometer
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        // Update the invoice state with new data
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div>Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div>Error fetching invoice: {error.message}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
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
              {invoice.finalAmount} {"(vnd)"}
            </p>
            <p>
              <span className="font-semibold">Invoice Date:</span>{" "}
              {new Date(invoice.invoiceDate).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Tax:</span> {invoice.tax}{" "}
              {"(vnd)"}
            </p>
            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              {new Date(invoice.dueDate).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Subtotal:</span>{" "}
              {invoice.subTotal} {"(vnd)"}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {invoice.status}
            </p>
            {invoice.paymentLink && invoice.status !== "PAID" ? ( // Conditionally render the payment link if not PAID
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
              {invoice.kilometers !== null && invoice.kilometers !== undefined
                ? invoice.kilometers.toFixed(2)
                : "Not provided"}{" "}
              km
            </p>
          </Card>

          {/* Update Form for Distance */}
          {invoice.status !== "PAID" && ( // Conditionally render update form only if status is not PAID
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

          {/* Pricing Table Card */}
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
              <span className="font-semibold">Price per km:</span> {pricePerKm}{" "}
              VND
            </div>
            <div>
              <span className="font-semibold">Estimated Shipping Fee:</span>{" "}
              {estimatedShippingFee} VND
            </div>
          </Card>
        </div>

        {/* Render Map Component with SearchLocation */}
        {invoice.status !== "PAID" && ( // Conditionally render MapComponent only if status is not PAID
          <>
            <h2 className="text-xl font-semibold text-center mt-8 mb-4">
              Select End Point
            </h2>
            <MapComponent
              startPoint={startPoint}
              endPoint={endPoint}
              setEndPoint={setEndPoint}
              setDistance={setDistance} // Update distance in the MapComponent
              setAddress={setAddress}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
