import React, { useState } from "react";
import { Image, Button, Modal, Select } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios"; // Ensure the axios instance is imported

// Component to display auction request details
const RequestDetails = ({
  selectedRequest,
  onBack,
  fetchRequest,
  showUpdateStatusModal,
  updatingRequest,
  closeUpdateStatusModal,
  selectedStatus,
  setSelectedStatus,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  if (!selectedRequest) return <p>No request selected.</p>;

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

  // Function to update status
  const handleUpdateStatus = async () => {
    if (!updatingRequest?.requestId || !selectedStatus) {
      toast.error("Please select a valid status");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.patch(
        `/staff/request/${updatingRequest.requestId}/status`,
        {
          requestStatus: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        }
      );

      console.log(response); // Debugging: Check the response from the API

      if (response.status === 200) {
        toast.success("Status updated successfully");
        await fetchRequest(); // Refresh the request data
        closeUpdateStatusModal(); // Close modal on success
        onBack();
      } else {
        toast.error("Failed to update status: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error.response?.data); // Log server error
      toast.error(
        "Failed to update status: " + error.response?.data.message ||
          "An unexpected error occurred."
      );
    }
  };

  // Format the status
  const formatStatus = (status) => {
    const statusMap = {
      CONFIRMING: "Confirming",
      CANCELED: "Canceled",
      ASSIGNED: "Assigned",
      NEGOTIATING: "Negotiating",
      WAITING_FOR_PAYMENT: "Waiting For Payment",
      PAID: "Paid",
      REGISTERED: "Registered",
      ASCENDING_BID: "Ascending Bid",
      SEALED_BID: "Sealed Bid",
      FIXED_PRICE_SALE: "Fixed Price Sale",
      DESCENDING_BID: "Descending Bid",
    };
    return (
      statusMap[status] || status.charAt(0) + status.slice(1).toLowerCase()
    );
  };

  return (
    <div className="space-y-8 mt-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-4 bg-slate-300 rounded-2xl p-4">
          <h2 className="text-xl font-bold">Auction Request Details</h2>
          <p>
            <strong>Request ID:</strong> {selectedRequest.requestId}
          </p>
          <p>
            <strong>Request Status:</strong>{" "}
            {formatStatus(selectedRequest.status)}
          </p>

          {selectedRequest.breeder && (
            <>
              <p>
                <strong>Breeder ID:</strong> {selectedRequest.breeder.breederId}
              </p>
              <p>
                <strong>Breeder Name:</strong>{" "}
                {selectedRequest.breeder.breederName}
              </p>
              <p>
                <strong>Location:</strong> {selectedRequest.breeder.location}
              </p>
            </>
          )}
          <h2 className="text-xl font-bold">Actions</h2>
          {selectedRequest.status === "ASSIGNED" && (
            <>
              <Button
                type="primary"
                onClick={() => showUpdateStatusModal(selectedRequest)}
              >
                Update Status
              </Button>
              <Modal
                visible={!!updatingRequest}
                title="Update Request Status"
                onCancel={closeUpdateStatusModal}
                onOk={handleUpdateStatus}
                okText="Update"
                cancelText="Cancel"
              >
                <p>
                  Update the status for request ID: {updatingRequest?.requestId}
                </p>
                <Select
                  placeholder="Select status"
                  style={{ width: "100%" }}
                  onChange={(value) => setSelectedStatus(value)}
                  value={selectedStatus}
                >
                  <Select.Option value="CONFIRMING">Pass</Select.Option>
                  <Select.Option value="CANCELED">Fail</Select.Option>
                  {/* Add other statuses as needed */}
                </Select>
              </Modal>
            </>
          )}
        </div>

        <div className="space-y-4 bg-slate-300 rounded-2xl p-4">
          <h2 className="text-xl font-bold">Fish Details</h2>
          {selectedRequest.koiFish && (
            <>
              <p>
                <strong>Fish ID:</strong> {selectedRequest.koiFish.fishId}
              </p>
              <p>
                <strong>Gender:</strong>{" "}
                {formatStatus(selectedRequest.koiFish.gender)}
              </p>
              <p>
                <strong>Age:</strong> {selectedRequest.koiFish.age} years old
              </p>
              <p>
                <strong>Size:</strong> {selectedRequest.koiFish.size} cm
              </p>
              <p>
                <strong>Price:</strong>{" "}
                {formatPrice(selectedRequest.koiFish.price)}
              </p>
              <p>
                <strong>Auction Type:</strong>{" "}
                {formatStatus(selectedRequest.koiFish.auctionTypeName)}
              </p>
              {selectedRequest.koiFish.variety && (
                <>
                  <p>
                    <strong>Variety ID:</strong>{" "}
                    {selectedRequest.koiFish.variety.varietyId}
                  </p>
                  <p>
                    <strong>Variety Name:</strong>{" "}
                    {selectedRequest.koiFish.variety.varietyName}
                  </p>
                </>
              )}
            </>
          )}
        </div>

        <div className="space-y-4 bg-slate-300 rounded-2xl p-4">
          <h2 className="text-xl font-bold">Assigned Staff</h2>
          {selectedRequest.staff && (
            <>
              <p>
                <strong>Staff ID:</strong> {selectedRequest.staff.accountId}
              </p>
              <p>
                <strong>Name:</strong> {selectedRequest.staff.firstName}{" "}
                {selectedRequest.staff.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedRequest.staff.email}
              </p>
              <p>
                <strong>Phone Number:</strong>{" "}
                {selectedRequest.staff.phoneNumber}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                {formatStatus(selectedRequest.staff.role)}
              </p>
            </>
          )}
        </div>
      </div>

      {selectedRequest.koiFish && selectedRequest.koiFish.media && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold">Image: </h3>
            <Image
              width={100}
              src={selectedRequest.koiFish.media.imageUrl}
              alt="Auction Request"
              className="mt-4"
            />
          </div>
          <div className="mt-4">
            {selectedRequest.koiFish.media.videoUrl ? (
              <>
                <h4 className="font-bold">Video: </h4>
                <video width="150" controls className="mt-2">
                  <source
                    src={selectedRequest.koiFish.media.videoUrl}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </>
            ) : (
              <p>No video available for this auction request.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
