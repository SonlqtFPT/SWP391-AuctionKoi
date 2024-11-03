import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Row,
  Col,
  Tag,
  Select,
  Input,
  Modal,
  notification,
  Image,
} from "antd";
import api from "../../../config/axios";
import { FaFish, FaFlag } from "react-icons/fa"; // Importing required icons
import confirm from "antd/es/modal/confirm";

const RequestDetails = ({ request, onBack, staffList, fetchRequest }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [offerPrice, setOfferPrice] = useState(null);
  const [offerAuctionType, setOfferAuctionType] = useState(null);
  const [localOfferPrice, setLocalOfferPrice] = useState(request.price);
  const defaultAuctionType = "ASCENDING_BID"; // Giá trị mặc định nếu không có giá trị hợp lệ
  const auctionTypes = [
    "ASCENDING_BID",
    "DESCENDING_BID",
    "SEALED_BID",
    "FIXED_PRICE_SALE",
  ];

  // Kiểm tra và gán giá trị mặc định cho localOfferAuctionType
  const initialAuctionType =
    request && auctionTypes.includes(request.auctionTypeName)
      ? request.auctionTypeName
      : defaultAuctionType;

  const [localOfferAuctionType, setLocalOfferAuctionType] =
    useState(initialAuctionType);

  useEffect(() => {
    if (request) {
      console.log("Request Object:", request);
      setOfferPrice(request.price);
      setOfferAuctionType(request.auctionTypeName);
      setLocalOfferPrice(request.price);
      setLocalOfferAuctionType(request.auctionTypeName);
      const auctionType = auctionTypes.includes(request.auctionTypeName)
        ? request.auctionTypeName
        : defaultAuctionType;
      setLocalOfferAuctionType(auctionType);
    }
  }, [request]);

  if (!request) return <p>No request selected.</p>;

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

  const handleAcceptRequest = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log(request.requestId);
      const response = await api.patch(
        `/manager/request/accept/${request.requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log request and response
      console.log("Request Body: ", {});
      console.log("Request Headers: ", {
        Authorization: `Bearer ${token}`,
      });
      console.log("Response: ", response);
      notification.success({
        message: "Success",
        description: "Request accepted successfully!",
      });
      fetchRequest();
      onBack();
    } catch (error) {
      console.error("Error accepting request:", error);
      notification.error({
        message: "Error",
        description: "Failed to accept the request.",
      });
    }
  };

  const handleCancelRequest = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        `/manager/request/cancel/${request.requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log request and response
      console.log("Request Body: ", {});
      console.log("Request Headers: ", {
        Authorization: `Bearer ${token}`,
      });
      console.log("Response: ", response);
      notification.success({
        message: "Success",
        description: "Request accepted successfully!",
      });
      fetchRequest();
      onBack();
    } catch (error) {
      console.error("Error accepting request:", error);
      notification.error({
        message: "Error",
        description: "Failed to accept the request.",
      });
    }
  };

  const handleCompletePayment = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(
        `/manager/manager/complete-payment-for-breeder?requestAuctionId=${request.requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log request and response
      console.log("RequestAuctionId: ", request.requestId);
      console.log("Request Headers: ", {
        Authorization: `Bearer ${token}`,
      });
      console.log("Response: ", response);
      notification.success({
        message: "Success",
        description: "Payment completed successfully!",
      });
      fetchRequest(); // Call to refresh the request data
      onBack();
    } catch (error) {
      console.error("Error completing payment:", error);
      notification.error({
        message: "Error",
        description: "Failed to complete the payment.",
      });
    }
  };

  const handleNegotiate = async () => {
    // Kiểm tra giá trị offerPrice trước khi gửi
    if (!offerAuctionType || offerPrice === null) {
      notification.error({
        message: "Error",
        description: "Please select auction type and enter offer price.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const body = {
        price: localOfferPrice,
        auctionTypeName: localOfferAuctionType,
      };

      const response = await api.post(
        `/request/negotiation/${request.requestId}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log request and response
      console.log("Request Body: ", body);
      console.log("Request Headers: ", {
        Authorization: `Bearer ${token}`,
      });
      console.log("Response: ", response);
      notification.success({
        message: "Success",
        description: "Offer submitted successfully!",
      });
      fetchRequest();
      onBack();
    } catch (error) {
      console.error("Error submitting negotiation offer:", error);
      notification.error({
        message: "Error",
        description: "Failed to submit the offer.",
      });
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedStaff) {
      notification.error({
        message: "Error",
        description: "Please select a staff member.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("accessToken"); // Correct token key
      const response = await api.post(
        `/manager/request/assign-staff/${request.requestId}?accountId=${selectedStaff}`,
        {}, // Empty data object for the POST request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Correct token in header
          },
        }
      );
      console.log(selectedStaff);
      console.log(request.requestId);
      console.log(response);
      notification.success({
        message: "Success",
        description: "Staff assigned successfully!",
      });

      fetchRequest(); // Call to refresh the request data
      onBack();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error assigning staff:", error);
      notification.error({
        message: "Error",
        description: "Failed to assign staff.",
      });
    }
  };

  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
  };

  return (
    <div>
      <Button onClick={onBack} type="default" className="my-6">
        Back
      </Button>
      <h2 className="font-bold text-2xl">Request Details</h2>
      <Row gutter={16} className="my-2 bg-slate-100">
        {/* Left Side: All Information Section */}
        <Col span={16} className="pt-2">
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
                  <strong>Size:</strong> {request.size} cm
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Age:</strong> {request.age} years old
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Variety:</strong> {request.varietyName}
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
                  <strong>Price:</strong> {formatPrice(request.price)}
                </p>
                <p style={{ margin: "0 0 4px" }}>
                  <strong>Auction Type:</strong>{" "}
                  {formatStatus(request.auctionTypeName)}
                </p>
              </Col>
            </Row>
          </Card>

          {/* Staff Assignment and Negotiation Section */}
          <Card className="mb-4">
            <h3>
              <strong>Actions</strong>
            </h3>
            {/* Render the Complete Payment button if the status is WAITING_FOR_PAYMENT */}
            {request.status === "WAITING_FOR_PAYMENT" && (
              <>
                <p>Money to pay : {formatPrice(request.auctionFinalPrice)}</p>
                <Button
                  type="primary"
                  onClick={handleCompletePayment}
                  className="my-2"
                >
                  Complete Payment
                </Button>
              </>
            )}

            {request.status === "REQUESTING" && (
              <>
                <Select
                  placeholder="Select staff"
                  onChange={setSelectedStaff}
                  style={{ width: "300px", marginBottom: "16px" }}
                >
                  {staffList.map((staff) => (
                    <Select.Option
                      key={staff.accountId}
                      value={staff.accountId}
                    >
                      {staff.firstName} {staff.lastName} (ID: {staff.accountId})
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  onClick={() => setIsModalVisible(true)}
                  disabled={!selectedStaff}
                  type="primary"
                  className="bg-red-500 hover:bg-red-700 text-white"
                >
                  Assign
                </Button>

                <Modal
                  title="Confirm Staff Assignment"
                  visible={isModalVisible}
                  onOk={handleAssignStaff}
                  onCancel={() => setIsModalVisible(false)}
                >
                  <p>Are you sure you want to assign this staff member?</p>
                </Modal>
                <br></br>
                <Button
                  onClick={handleCancelRequest}
                  type="primary"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Cancel Request
                </Button>
              </>
            )}

            {request.status === "CONFIRMING" && (
              <>
                <h3>
                  <strong>Negotiate</strong>
                </h3>
                {request.status === "CONFIRMING" && (
                  <>
                    <p>Waiting for Manager Approve</p>
                    <p>Breeder's price offer: {formatPrice(offerPrice)} </p>
                    <p>Breeder's auction type offer: {offerAuctionType}</p>
                  </>
                )}
                <Input
                  type="text" // Change type to text
                  placeholder="Offer Price"
                  value={formatNumber(localOfferPrice) || ""} // Format the display value
                  onChange={(e) => {
                    // Remove dots for internal state
                    const valueWithoutDots = e.target.value.replace(/\./g, ""); // Remove dots from input
                    setLocalOfferPrice(
                      valueWithoutDots ? Number(valueWithoutDots) : null
                    ); // Set number or null
                  }}
                  style={{ width: "200px", marginBottom: "16px" }} // Retain your styles
                />
                <Select
                  placeholder="Select Auction Type"
                  value={localOfferAuctionType || undefined}
                  onChange={(value) => setLocalOfferAuctionType(value)}
                  style={{ width: "200px", marginBottom: "16px" }}
                >
                  <Select.Option value="ASCENDING_BID">
                    Ascending Bid
                  </Select.Option>
                  <Select.Option value="DESCENDING_BID">
                    Descending Bid
                  </Select.Option>
                  <Select.Option value="SEALED_BID">Sealed Bid</Select.Option>
                  <Select.Option value="FIXED_PRICE_SALE">
                    Fixed Price Sale
                  </Select.Option>
                </Select>
                <Button
                  onClick={handleNegotiate}
                  type="primary"
                  className="bg-red-500 hover:bg-red-700 text-white"
                >
                  Submit Offer
                </Button>
                <br></br>
                <Button
                  onClick={handleAcceptRequest}
                  type="primary"
                  className="bg-blue-400 hover:bg-red-700 text-white"
                >
                  Accept Offer
                </Button>
                <Button
                  onClick={handleCancelRequest}
                  type="primary"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Cancel Request
                </Button>
              </>
            )}

            {request.status === "NEGOTIATING" && (
              <p>Waiting for Breeder Negotiate</p>
            )}
          </Card>
        </Col>

        {/* Right Side: Media Section */}
        <Col span={8} className="pt-2">
          <Card title={<strong>Media</strong>} className="mb-4">
            <div className="grid grid-cols-2">
              {/* Video Preview */}
              <div>
                {request.videoUrl ? (
                  <div style={{ marginTop: 16 }}>
                    <strong>Video:</strong>
                    <video width="150" controls>
                      <source src={request.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <p>No video available for this auction request.</p>
                )}
              </div>

              {/* Image Display */}
              <div className="mt-3">
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
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RequestDetails;
