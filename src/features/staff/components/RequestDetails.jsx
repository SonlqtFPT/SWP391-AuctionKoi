import React, { useState } from "react";
import { Image, Button, Modal, Select } from "antd";

// Component to display auction request details
const RequestDetails = ({
  selectedRequest,
  staffList,
  onAssign,
  fetchRequest,
  onUpdateStatus,
  showUpdateStatusModal,
  updatingRequest,
  closeUpdateStatusModal,
  selectedStatus,
  setSelectedStatus,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  if (!selectedRequest) return <p>No request selected.</p>;

  // Format the status
  const formatStatus = (status) => {
    switch (status) {
      case "CONFIRMING":
        return "Confirming";
      case "Cancled":
        return "Canceled";
      case "ASSIGNED":
        return "Assigned";
      case "NEGOTIATING":
        return "Negotiating";
      case "WAITING_FOR_PAYMENT":
        return "Waiting For Payment";
      case "PAID":
        return "Paid";
      case "CANCELLED":
        return "Cancelled";
      case "REGISTERED":
        return "Registered";
      case "ASCENDING_BID":
        return "Ascending Bid";
      case "SEALED_BID":
        return "Sealed Bid";
      case "FIXED_PRICE_SALE":
        return "Fixed Price Sale";
      case "DESCENDING_BID":
        return "Descending Bid";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  // Determine the color for the status tag
  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMING":
        return "orange";
      case "INSPECTION_FAILED":
        return "red";
      case "ASSIGNED":
        return "orange";
      case "REQUESTING":
        return "blue";
      case "NEGOTIATING":
        return "orange";
      case "WAITING_FOR_PAYMENT":
        return "gold";
      case "PAID":
        return "green";
      case "COMPLETED":
        return "geekblue";
      case "CANCELED":
        return "volcano";
      case "REGISTERED":
        return "green";
      default:
        return "default";
    }
  };

  const handleAssign = async () => {
    if (selectedStaff) {
      await onAssign(selectedRequest, selectedStaff);
      setIsModalVisible(false);
      setSelectedStaff(null);
      fetchRequest();
    } else {
      alert("Please select a staff member.");
    }
  };

  return (
    <div className="space-y-8 mt-4">
      {/* First Section: Request Info, Breeder Info, Fish Info, Staff Info */}
      <div className="grid grid-cols-3 gap-4">
        {/* Request Info & Breeder Info */}
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
        </div>

        {/* Variety Info & Fish Info */}
        <div className="space-y-4 bg-slate-300 rounded-2xl p-4">
          {selectedRequest.koiFish && (
            <>
              <p>
                <strong>Fish ID:</strong> {selectedRequest.koiFish.fishId}
              </p>
              <p>
                <strong>Gender:</strong> {selectedRequest.koiFish.gender}
              </p>
              <p>
                <strong>Age:</strong> {selectedRequest.koiFish.age} years old
              </p>
              <p>
                <strong>Size:</strong> {selectedRequest.koiFish.size} cm
              </p>
              <p>
                <strong>Price:</strong> {selectedRequest.koiFish.price} (vnd)
              </p>
              <p>
                <strong>Auction Type:</strong>{" "}
                {selectedRequest.koiFish.auctionTypeName}
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

        {/* Staff Info & Buttons */}
        <div className="space-y-4 bg-slate-300 rounded-2xl p-4">
          {selectedRequest.staff && (
            <>
              <h3 className="text-lg font-semibold">Assigned Staff</h3>
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
                <strong>Role:</strong> {selectedRequest.staff.role}
              </p>
            </>
          )}

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
                onOk={onUpdateStatus}
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
                </Select>
              </Modal>
            </>
          )}
        </div>
      </div>

      {/* Second Section: Media Info */}
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
