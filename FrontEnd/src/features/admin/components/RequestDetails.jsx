import React, { useState, useEffect } from "react";
import { Image, Button, Modal, Select, Input, notification } from "antd";
import api from "../../../config/axios";

const RequestDetails = ({
  selectedRequest,
  onAssign,
  fetchRequest,
  onGoBack,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [offerPrice, setOfferPrice] = useState(selectedRequest.price);
  const [offerAuctionType, setOfferAuctionType] = useState(
    selectedRequest.auctionTypeName
  );
  const [staffList, setStaffList] = useState([]); // State for storing staff data

  useEffect(() => {
    // Fetch staff data on component mount
    const fetchStaff = async () => {
      try {
        const response = await api.get(
          "/manager/request/assign-staff/getStaff"
        );
        if (response.data.status === 200) {
          setStaffList(response.data.data); // Store staff data in state
        } else {
          console.error("Failed to fetch staff:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Fetch the request details again when selectedRequest changes
  useEffect(() => {
    if (selectedRequest) {
      setOfferPrice(selectedRequest.price);
      setOfferAuctionType(selectedRequest.auctionTypeName);
    }
  }, [selectedRequest]); // Fetch request details whenever selectedRequest changes

  if (!selectedRequest) return <p>No request selected.</p>;

  const formatStatus = (status) => {
    switch (status) {
      case "INSPECTION_PASSED":
        return "Pass";
      case "INSPECTION_FAILED":
        return "Fail";
      case "INSPECTION_IN_PROGRESS":
        return "Checking";
      case "PENDING":
        return "Pending";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  const capitalizeAuctionType = (auctionType) => {
    switch (auctionType) {
      case "ASCENDING_BID":
      case "DESCENDING_BID":
      case "SEALED_BID":
      case "FIXED_PRICE_SALE":
        return auctionType
          .toLowerCase()
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      default:
        return auctionType;
    }
  };

  // Handle negotiation request
  const handleNegotiate = async () => {
    try {
      const payload = {
        offerPrice: offerPrice || selectedRequest.price,
        offerAuctionType: offerAuctionType || selectedRequest.auctionTypeName,
      };

      await api.post(
        `/manager/request/negotiation/${selectedRequest.requestId}`,
        payload
      );

      notification.success({
        message: "Success",
        description: "Offer submitted successfully!",
      });
      fetchRequest(); // Refresh the list after negotiation
    } catch (error) {
      console.error("Error submitting negotiation offer:", error);
      notification.error({
        message: "Error",
        description: "Failed to submit the offer.",
      });
    }
  };

  return (
    <div>
      <h2>Auction Request Details</h2>
      <p>
        <strong>Request ID:</strong> {selectedRequest.requestId}
      </p>
      <p>
        <strong>Request Status:</strong> {formatStatus(selectedRequest.status)}
      </p>
      <p>
        <strong>Breeder ID:</strong> {selectedRequest.breederId}
      </p>
      <p>
        <strong>Breeder Name:</strong> {selectedRequest.breederName}
      </p>
      <p>
        <strong>Fish ID:</strong> {selectedRequest.fishId}
      </p>
      <p>
        <strong>Gender:</strong> {selectedRequest.gender}
      </p>
      <p>
        <strong>Age:</strong> {selectedRequest.age} years old
      </p>
      <p>
        <strong>Size:</strong> {selectedRequest.size} cm
      </p>
      <p>
        <strong>Price:</strong> {selectedRequest.price} $
      </p>
      <p>
        <strong>Auction Type:</strong>{" "}
        {capitalizeAuctionType(selectedRequest.auctionTypeName)}
      </p>
      <p>
        <strong>Variety:</strong> {selectedRequest.varietyName}
      </p>

      <Image
        width={200}
        src={selectedRequest.image}
        alt="Auction Request"
        style={{ marginTop: 16 }}
      />
      {selectedRequest.videoUrl ? (
        <div style={{ marginTop: 16 }}>
          <strong>Video:</strong>
          <video width="300" controls>
            <source src={selectedRequest.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : null}

      {/* Staff Assignment Section */}
      {selectedRequest.status === "PENDING" && (
        <div>
          <h3>Assign Staff</h3>
          <Select
            placeholder="Select staff"
            onChange={setSelectedStaff}
            style={{ width: "300px", marginBottom: "16px" }}
          >
            {staffList.map((staff) => (
              <Select.Option key={staff.accountId} value={staff.accountId}>
                {staff.firstName} {staff.lastName} (ID: {staff.accountId})
              </Select.Option>
            ))}
          </Select>
          <Button
            onClick={() => setIsModalVisible(true)}
            disabled={!selectedStaff}
            type="primary"
          >
            Assign
          </Button>

          <Modal
            title="Confirm Staff Assignment"
            visible={isModalVisible}
            onOk={async () => {
              try {
                await api.post(
                  `/manager/request/assign-staff/${selectedRequest.requestId}?accountId=${selectedStaff}`
                );
                notification.success({
                  message: "Success",
                  description: "Staff assigned successfully!",
                });
                onAssign(); // Refresh the auction requests after assigning staff
                fetchRequest(); // Ensure to refresh the request list
                setIsModalVisible(false); // Close modal
              } catch (error) {
                console.error("Error assigning staff:", error);
                notification.error({
                  message: "Error",
                  description: "Failed to assign staff.",
                });
              }
            }}
            onCancel={() => setIsModalVisible(false)}
          >
            <p>Are you sure you want to assign this staff member?</p>
          </Modal>
        </div>
      )}

      {/* Negotiation Section */}
      {selectedRequest.status === "INSPECTION_PASSED" && (
        <div style={{ marginTop: "16px" }}>
          <h3>Negotiate</h3>
          <Input
            type="number"
            placeholder="Offer Price"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            style={{ width: "200px", marginBottom: "16px" }}
          />
          <Select
            placeholder="Select Auction Type"
            value={offerAuctionType}
            onChange={setOfferAuctionType}
            style={{ width: "200px", marginBottom: "16px" }}
          >
            <Select.Option value="ASCENDING_BID">Ascending Bid</Select.Option>
            <Select.Option value="DESCENDING_BID">Descending Bid</Select.Option>
            <Select.Option value="SEALED_BID">Sealed Bid</Select.Option>
            <Select.Option value="FIXED_PRICE_SALE">
              Fixed Price Sale
            </Select.Option>
          </Select>
          <Button onClick={handleNegotiate} type="primary">
            Submit Offer
          </Button>
        </div>
      )}

      {/* Back to List Button */}
      <Button style={{ marginTop: "16px" }} onClick={onGoBack}>
        Back to Requests
      </Button>
    </div>
  );
};

export default RequestDetails;
