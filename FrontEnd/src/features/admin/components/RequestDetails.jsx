import React, { useState } from "react";
import { Image, Button, Modal, Select } from "antd";

// Component to display auction request details
const RequestDetails = ({
  selectedRequest,
  staffList,
  onAssign,
  fetchRequest,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  if (!selectedRequest) return <p>No request selected.</p>;

  const formatStatus = (status) => {
    switch (status) {
      case "INSPECTION_PASSED":
        return "Pass";
      case "INSPECTION_FAILED":
        return "Fail";
      case "INSPECTION_IN_PROGRESS":
        return "Checking";
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

  const handleAssign = async () => {
    if (selectedStaff) {
      await onAssign(selectedRequest, selectedStaff); // Pass selected request and staff ID to onAssign
      setIsModalVisible(false); // Close the modal after assignment
      setSelectedStaff(null); // Clear selected staff
      await fetchRequest(); // Refresh the auction requests
    } else {
      alert("Please select a staff member.");
    }
  };

  return (
    <div>
      <h2>Auction Request Details</h2>
      {/* Request Info */}
      <p>
        <strong>Request ID:</strong> {selectedRequest.requestId}
      </p>
      <p>
        <strong>Request Status:</strong> {formatStatus(selectedRequest.status)}
      </p>

      {/* Breeder Info */}
      <p>
        <strong>Breeder ID:</strong> {selectedRequest.breederId}
      </p>
      <p>
        <strong>Breeder Name:</strong> {selectedRequest.breederName}
      </p>

      {/* Fish Info */}
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

      {/* Variety Info */}
      <p>
        <strong>Variety:</strong> {selectedRequest.varietyName}
      </p>

      {/* Media Info */}
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
            <p>Your browser does not support the video playback.</p>
          </video>
        </div>
      ) : (
        <p>No video available for this auction request.</p>
      )}

      {/* Only show Assign button if status is PENDING */}
      {selectedRequest.status === "PENDING" && (
        <>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Assign Staff
          </Button>

          {/* Assign Staff Modal */}
          <Modal
            visible={isModalVisible}
            title="Assign Staff"
            onCancel={() => setIsModalVisible(false)}
            onOk={handleAssign}
            okText="Assign"
            cancelText="Cancel"
          >
            <p>
              Assign a staff member to request ID: {selectedRequest.requestId}
            </p>
            <Select
              placeholder="Select staff"
              style={{ width: "100%" }}
              onChange={(value) => setSelectedStaff(value)}
            >
              {staffList.map((staff) => (
                <Select.Option key={staff.accountId} value={staff.accountId}>
                  {staff.firstName} | {staff.lastName} | AccountID :
                  {staff.accountId}
                </Select.Option>
              ))}
            </Select>
          </Modal>
        </>
      )}
    </div>
  );
};

export default RequestDetails;
