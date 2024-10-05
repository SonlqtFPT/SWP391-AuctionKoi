import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Tag } from "antd";
import RequestDetails from "../components/RequestDetails";
import AddBreederRequest from "../components/AddBreederRequest"; // Import the AddBreederRequest component
import api from "../../../config/axios";
import { toast } from "react-toastify";

const BreederRequest = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingRequest, setAddingRequest] = useState(false); // State for adding request
  const [viewingDetails, setViewingDetails] = useState(false); // New state for viewing request details

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const breederId = 1; // Assuming you want to fetch requests for this breeder
      const response = await api.get(`/breeder/request/${breederId}`);

      // Log the raw response data
      console.log("Fetched requests data:", response.data.data);

      // Map to include full details needed
      const requestData = response.data.data.map((item) => ({
        requestId: item.requestId,
        status: item.status,
        requestedAt: item.requestedAt,
        auctionTypeNameManager: item.auctionTypeName,
        auctionTypeNameBreeder: item.koiFish.auctionTypeName,
        fishId: item.koiFish.fishId,
        breederId: item.breeder.breederId,
        breederName: item.breeder.breederName,
        breederLocation: item.breeder.location, // include breeder location
        price: item.koiFish.price,
        offerPriceManager: item.offerPrice, // include offer price
        age: item.koiFish.age, // include age
        size: item.koiFish.size, // include size
        varietyName: item.koiFish.variety.varietyName, // include variety name
        image: item.koiFish.media.imageUrl, // include image URL
        videoUrl: item.koiFish.media.videoUrl, // include video URL
        // Include additional fields if needed
        staff: item.staff, // Add staff details if needed
      }));

      // Log the processed requestData
      console.log("Processed request data:", requestData);

      setRequests(requestData);
    } catch (error) {
      toast.error("Failed to fetch breeder requests");
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request); // This now contains all details
    setViewingDetails(true); // Set state to indicate we're viewing details
    setRequests([]); // Clear the request list when viewing details
  };

  // New function to handle going back to the request list
  const handleBackToRequests = () => {
    setAddingRequest(false); // Set addingRequest to false to show the requests
    setViewingDetails(false); // Reset viewing details state
    fetchRequests(); // Optionally refetch requests to refresh the list
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
      sorter: (a, b) => a.requestId - b.requestId,
    },
    {
      title: "Fish ID",
      dataIndex: "fishId",
      key: "fishId",
      sorter: (a, b) => a.fishId - b.fishId,
    },
    {
      title: "Created At",
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.requestedAt) - new Date(b.requestedAt),
    },
    {
      title: "Auction Type",
      dataIndex: "auctionTypeName",
      key: "auctionTypeName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={getStatusColor(text)}>{formatStatus(text)}</Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => handleViewDetails(record)}>View Details</Button>
      ),
    },
  ];

  const formatStatus = (status) => {
    switch (status) {
      case "APPROVE":
        return "Approved";
      case "PENDING":
        return "Pending";
      case "PENDING_MANAGER_OFFER":
        return "Waiting For Manager Approve";
      case "PENDING_BREEDER_OFFER":
        return "Waiting For Breeder Approve";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVE":
        return "green";
      case "PENDING":
        return "blue";
      case "CANCELLED":
        return "red";
      case "PENDING_MANAGER_OFFER":
        return "gold"; // Color for manager approval status
      case "PENDING_BREEDER_OFFER":
        return "lime"; // Color for breeder approval status
      default:
        return "default";
    }
  };

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <h1>Breeder Requests</h1>
          {/* Button to add a new breeder request */}
          <Button
            type="primary"
            onClick={() => setAddingRequest(true)}
            style={{ marginBottom: 16 }}
          >
            Add Breeder Request
          </Button>

          {addingRequest ? (
            <AddBreederRequest onBack={handleBackToRequests} /> // Render AddBreederRequest
          ) : viewingDetails ? (
            <div
              style={{
                marginTop: "20px",
                border: "1px solid #d9d9d9",
                padding: "20px",
              }}
            >
              <h2>Request Details</h2>
              <RequestDetails
                request={selectedRequest}
                onBack={handleBackToRequests} // Go back to the requests list
              />
            </div>
          ) : (
            <Table dataSource={requests} columns={columns} rowKey="requestId" />
          )}
        </>
      )}
    </div>
  );
};

export default BreederRequest;
