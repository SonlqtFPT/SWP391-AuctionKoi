import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Tag,
  Select,
  Input,
  notification,
  Image,
} from "antd";
import api from "../../../config/axios";
import { FaFish, FaFlag } from "react-icons/fa"; // Importing required icons

const RequestDetails = ({ request, onBack, fetchRequest }) => {
  const [offerPrice, setOfferPrice] = useState(null);
  const [offerAuctionType, setOfferAuctionType] = useState(null);

  useEffect(() => {
    if (request) {
      console.log("Request Object:", request);
      setOfferPrice(request.price); // This can be kept as is since it uses the request's price
      setOfferAuctionType(request.auctionTypeNameBreeder);
    }
  }, [request]);

  if (!request) return <p>No request selected.</p>;

  const formatStatus = (status) => {
    const statusMap = {
      INSPECTION_PASSED: "Passed",
      INSPECTION_FAILED: "Failed",
      INSPECTION_IN_PROGRESS: "Checking",
      PENDING: "Pending",
      PENDING_NEGOTIATION: "Negotiating",
      PENDING_MANAGER_OFFER: "Waiting for Manager Approve",
      PENDING_BREEDER_OFFER: "Waiting for Breeder Approve",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      APPROVE: "Approved",
    };
    return (
      statusMap[status] || status.charAt(0) + status.slice(1).toLowerCase()
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "INSPECTION_PASSED":
        return "green";
      case "INSPECTION_FAILED":
        return "red";
      case "INSPECTION_IN_PROGRESS":
        return "orange";
      case "PENDING":
        return "blue";
      case "PENDING_NEGOTIATION":
        return "purple";
      case "PENDING_MANAGER_OFFER":
        return "cyan";
      case "PENDING_BREEDER_OFFER":
        return "gold";
      case "COMPLETED":
        return "geekblue";
      case "CANCELLED":
        return "volcano";
      case "APPROVE":
        return "cyan";
      default:
        return "default";
    }
  };

  const handleNegotiate = async () => {
    if (!offerAuctionType || offerPrice === null) {
      notification.error({
        message: "Error",
        description: "Please select auction type and enter offer price.",
      });
      return;
    }

    try {
      await api.post(
        `/breeder/request/negotiation/send-negotiation/${request.requestId}`,
        {
          price: offerPrice,
          auctionTypeName: offerAuctionType,
        }
      );
      notification.success({
        message: "Success",
        description: "Offer submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting negotiation offer:", error);
      notification.error({
        message: "Error",
        description: "Failed to submit the offer.",
      });
    }
  };

  const handleAccept = async () => {
    try {
      await api.post(
        `/breeder/request/negotiation/accept/${request.requestId}`
      );
      notification.success({
        message: "Success",
        description: "Offer accepted successfully!",
      });
      fetchRequest();
    } catch (error) {
      console.error("Error accepting offer:", error);
      notification.error({
        message: "Error",
        description: "Failed to accept the offer.",
      });
    }
  };

  const handleCancel = async () => {
    try {
      await api.post(`/manager/request/cancel/${request.requestId}`); // Assuming you have this API
      notification.success({
        message: "Success",
        description: "Request cancelled successfully!",
      });
      fetchRequest();
    } catch (error) {
      console.error("Error cancelling request:", error);
      notification.error({
        message: "Error",
        description: "Failed to cancel the request.",
      });
    }
  };

  return (
    <div>
      <h2>Request Details</h2>
      <Row gutter={16}>
        {/* Left Side: All Information Section */}
        <Col span={16}>
          <Card title={<strong>All Information</strong>} className="mb-4">
            <Row gutter={8}>
              {/* Breeder Info Column */}
              <Col span={8}>
                <h4>
                  <strong>Breeder Info</strong>
                </h4>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Breeder ID:</strong> {request.breederId}
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Breeder Name:</strong> {request.breederName}
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Location:</strong> {request.breederLocation}
                </p>
              </Col>

              {/* Vertical Divider */}
              <Col span={1} style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderLeft: "1px solid #d9d9d9",
                    height: "100%",
                    margin: "0 0 4px",
                  }}
                />
              </Col>

              {/* Koi Info Column */}
              <Col span={7}>
                <h4>
                  <strong>Koi Info</strong>
                </h4>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Fish ID:</strong> {request.fishId}
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Size:</strong> {request.size}
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Age:</strong> {request.age}
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Variety:</strong> {request.varietyName}{" "}
                  {/* Update to use varietyName */}
                </p>
              </Col>

              {/* Vertical Divider */}
              <Col span={1} style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderLeft: "1px solid #d9d9d9",
                    height: "100%",
                    margin: "0 0 4px",
                  }}
                />
              </Col>

              {/* Request Info Column */}
              <Col span={7}>
                <h4>
                  <strong>Request Info</strong>
                </h4>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>
                    <FaFlag /> Status:
                  </strong>{" "}
                  <Tag color={getStatusColor(request.status)}>
                    {formatStatus(request.status)}
                  </Tag>
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Requested At:</strong>{" "}
                  {new Date(request.requestedAt).toLocaleString()}
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Price:</strong> ${request.price}{" "}
                  {/* Fixed this line */}
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Auction Type:</strong>{" "}
                  {request.auctionTypeNameBreeder}
                </p>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Side: Media Section */}
        <Col span={8}>
          <Card title={<strong>Media</strong>} className="mb-4">
            {/* Video Preview */}
            {request.videoUrl ? (
              <div style={{ marginTop: 16 }}>
                <strong>Video:</strong>
                <video width="300" controls>
                  <source src={request.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <p>No video available for this auction request.</p>
            )}

            {/* Image Display */}
            <h4>
              <strong>Image:</strong>
            </h4>
            {request.image ? (
              <Image
                src={request.image}
                alt="Koi Fish"
                style={{ width: 200 }}
              />
            ) : (
              <p>No image available for this auction request.</p>
            )}
          </Card>
        </Col>
      </Row>

      {/* Negotiation Section */}
      <Card className="mb-4">
        <h4>Negotiation</h4>
        {/* Display Manager Offer Price for the Breeder */}
        {request.offerPriceManager !== undefined && (
          <p style={{ marginTop: "16px" }}>
            <strong>Manager Offer Price:</strong> ${request.offerPriceManager}
          </p>
        )}
        {request.auctionTypeNameManager !== undefined && (
          <p style={{ marginTop: "16px" }}>
            <strong>Manager Offer Auction Type:</strong>{" "}
            {request.auctionTypeNameManager}
          </p>
        )}

        {(request.status === "PENDING_MANAGER_OFFER" ||
          request.status === "PENDING_BREEDER_OFFER") && (
          <>
            {request.status === "PENDING_MANAGER_OFFER" && (
              <p>Waiting for Manager Approval</p>
            )}
            {request.status === "PENDING_BREEDER_OFFER" && (
              <p>Waiting for Breeder Approval</p>
            )}
            {(request.status === "PENDING_BREEDER_OFFER" ||
              request.status === "INSPECTION_PASSED") && (
              <>
                <Input
                  type="number"
                  placeholder="Offer Price"
                  value={offerPrice || ""}
                  onChange={(e) =>
                    setOfferPrice(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  style={{ width: "200px", marginBottom: "16px" }}
                />
                <Select
                  placeholder="Select Auction Type"
                  value={offerAuctionType || undefined}
                  onChange={setOfferAuctionType}
                  style={{ width: "200px", marginBottom: "16px" }}
                >
                  <Select.Option value="ASCENDING_BID">
                    Ascending Bid
                  </Select.Option>
                  <Select.Option value="DESCENDING_BID">
                    Descending Bid
                  </Select.Option>
                  <Select.Option value="SEALED_BID">Sealed Bid</Select.Option>
                  <Select.Option value="DIRECT_SALE">Direct Sale</Select.Option>
                </Select>
                <Button type="primary" onClick={handleNegotiate}>
                  Submit Offer
                </Button>
              </>
            )}
            {request.status === "PENDING_BREEDER_OFFER" && (
              <div style={{ marginTop: "16px" }}>
                <Button
                  type="primary"
                  onClick={handleAccept}
                  style={{ marginRight: "8px" }}
                >
                  Accept Offer
                </Button>
                <Button type="default" onClick={handleCancel}>
                  Cancel Offer
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Back Button */}
      <Button type="default" onClick={onBack}>
        Back
      </Button>
    </div>
  );
};

export default RequestDetails;
