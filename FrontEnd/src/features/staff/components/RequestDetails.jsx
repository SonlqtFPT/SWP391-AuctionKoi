import React from "react";
import { Image, Button } from "antd";

// Component to display auction request details for staff
const RequestDetails = ({ selectedRequest, onUpdateStatus }) => {
  if (!selectedRequest) return <p>No request selected.</p>;

  const formatStatus = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
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
        <strong>Variety Name:</strong> {selectedRequest.varietyName}
      </p>

      {/* Media */}
      <Image src={selectedRequest.image} alt="Fish Image" width={200} />
      <p>
        <strong>Price:</strong> ${selectedRequest.price}
      </p>

      {/* Update Status Button */}
      {selectedRequest.status === "INSPECTION_IN_PROGRESS" && (
        <Button onClick={onUpdateStatus} type="primary">
          Update Status
        </Button>
      )}
    </div>
  );
};

export default RequestDetails;
