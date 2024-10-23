import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get route params
import api from "../config/axios"; // Import your configured Axios instance
import Header from "../components/Header"; // Import your Header component
import Footer from "../components/Footer"; // Import your Footer component
import { Card, Input, Button, notification } from "antd"; // Import Ant Design components

const Payment = () => {
  const { lotId } = useParams(); // Get the lotId from the route
  const [invoice, setInvoice] = useState(null); // State to hold invoice data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors
  const [address, setAddress] = useState(""); // State to track the address input
  const [kilometer, setKilometer] = useState(""); // State to track the kilometer input
  const [updating, setUpdating] = useState(false); // State to track update process

  useEffect(() => {
    // Function to fetch invoice data
    const fetchInvoice = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from local storage
        const response = await api.get(`/invoice/get-specific-invoice`, {
          params: { lotId }, // Pass the lotId as a query parameter
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add Bearer token to headers
          },
        });

        // Check if the response is okay
        if (response.status === 200) {
          setInvoice(response.data.data); // Set the invoice data in state
        } else {
          throw new Error("Failed to fetch invoice");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(error); // Set error in state
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchInvoice(); // Call the fetch function
  }, [lotId]); // Dependency array includes lotId

  // Function to handle invoice update
  const handleUpdateInvoice = async () => {
    if (!address || !kilometer) {
      notification.error({
        message: "Error",
        description: "Please fill in both the address and distance fields.",
      });
      return;
    }

    try {
      setUpdating(true); // Set updating state to true
      const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from local storage
      const response = await api.patch(`/invoice/update-invoice`, null, {
        params: {
          invoiceId: invoice.invoiceId, // Pass the invoiceId
          address, // Pass the updated address
          kilometer, // Pass the updated kilometer (distance)
        },
        headers: {
          Authorization: `Bearer ${accessToken}`, // Add Bearer token to headers
        },
      });

      if (response.status === 200) {
        notification.success({
          message: "Success",
          description: "Invoice updated successfully!",
        });
        setInvoice({ ...invoice, address, kilometer }); // Update the local invoice state with new values
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
      setUpdating(false); // Set updating state to false
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header /> {/* Include the header component */}
        <div className="flex-grow flex items-center justify-center">
          <div>Loading...</div>
        </div>
        <Footer /> {/* Include the footer component */}
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header /> {/* Include the header component */}
        <div className="flex-grow flex items-center justify-center">
          <div>Error fetching invoice: {error.message}</div>
        </div>
        <Footer /> {/* Include the footer component */}
      </div>
    );
  }

  // Styles for the invoice and waiting message
  const styles = {
    container: {
      padding: "20px",
      maxWidth: "800px",
      margin: "auto",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      marginTop: "20px",
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "10px",
    },
  };

  // Render invoice details and update form if available
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Include the header component */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Payment for Lot: {lotId}
        </h1>

        <div className="flex justify-center space-x-4">
          {/* Invoice Card */}
          <Card
            title="Invoice Details"
            style={{ width: 300 }} // Width of the card
            className="shadow-lg" // Tailwind shadow
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
          </Card>

          {/* Update Form for Address and Kilometer */}
          <Card
            title="Update Shipping Details"
            style={{ width: 300 }} // Width of the card
            className="shadow-lg flex flex-col" // Use flex column for vertical stacking
          >
            <div style={styles.formGroup}>
              <label className="font-semibold">Address:</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter new address"
              />
            </div>
            <div style={styles.formGroup}>
              <label className="font-semibold">Kilometer (Distance):</label>
              <Input
                value={kilometer}
                onChange={(e) => setKilometer(e.target.value)}
                placeholder="Enter distance"
                type="number"
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
        </div>
      </div>
      <Footer /> {/* Include the footer component */}
    </div>
  );
};

export default Payment;
