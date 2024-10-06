
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Select,
  Input,
  notification,
} from "antd";
import api from "../../../config/axios";


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

  const formatAuctionType = (auctionTypeName) => {
    switch (auctionTypeName) {
      case "DESCENDING_BID":
        return "Descending Bid";
      case "ASCENDING_BID":
        return "Ascending Bid";
      case "SEALED_BID":
        return "Sealed Bid";
      case "FIXED_PRICE_SALE":
        return "Fixed Price Sale";
      default:
        return auctionTypeName;
    }
  };

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
    switch (

    status.toUpperCase() 

    ) {
      case "PENDING":
        return "blue"; // Color for pending status
      case "INSPECTION_IN_PROGRESS":
        return "orange"; // Color for inspection in progress
      case "INSPECTION_PASSED":
        return "green"; // Color for inspection passed
      case "INSPECTION_FAILED":
        return "red"; // Color for inspection failed
      case "PENDING_MANAGER_OFFER":
        return "gold"; // Color for pending manager offer
      case "PENDING_BREEDER_OFFER":
        return "lime"; // Color for pending breeder offer
      case "APPROVE":
        return "cyan"; // Color for approval
      case "REJECT":
        return "magenta"; // Color for rejection
      case "CANCELLED":
        return "volcano"; // Color for cancelled status
      default:
        return "default"; // Default color for unknown status
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

    } catch (error) {
      console.error("Error cancelling request:", error);
      notification.error({
        message: "Error",
        description: "Failed to cancel the request.",
      });
    }
  };

  return (

    <div className="p-6 bg-[#131313] rounded-2xl text-white my-5 mx-5">
      <h2 className="text-2xl font-bold mb-6 text-[#bcab6f]">Request Details</h2>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Left Side: All Information Section */}
        <div className="col-span-2">
          <div className="bg-gray-700 p-4 rounded-lg shadow mb-5">
            <h3 className="text-lg font-semibold mb-4">All Information</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Breeder Info */}
              <div>
                <h4 className="font-semibold text-[#bcab6f]">Breeder Info</h4>
                <p><strong>Breeder ID:</strong> {request.breederId}</p>
                <p><strong>Breeder Name:</strong> {request.breederName}</p>
                <p><strong>Location:</strong> {request.breederLocation}</p>
              </div>

              {/* Koi Info */}
              <div>
                <h4 className="font-semibold text-[#bcab6f]">Koi Info</h4>
                <p><strong>Fish ID:</strong> {request.fishId}</p>
                <p><strong>Size:</strong> {request.size}</p>
                <p><strong>Age:</strong> {request.age}</p>
                <p><strong>Variety:</strong> {request.varietyName}</p>
                <p><strong>Gender:</strong> {request.gender}</p>
              </div>

              {/* Request Info */}
              <div>
                <h4 className="font-semibold text-[#bcab6f]">Request Info</h4>
                <p><strong>Status:</strong>
                  <span className={getStatusColor(request.status)}>
                    {formatStatus(request.status)}
                  </span>
                </p>
                <p><strong>Requested At:</strong> {new Date(request.requestedAt).toLocaleString()}</p>
                <p><strong>Price:</strong> ${request.price}</p>
                <p><strong>Auction Type:</strong> {request.auctionTypeNameBreeder}</p>
              </div>
            </div>
          </div>


          {/* Media Section */}
          <div className="bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Media</h3>
            <div className="flex flex-row justify-between gap-10">
              {/* Image Display */}
              <div className="w-1/2">
                <strong className="text-[#bcab6f]">Image:</strong>
                {request.image ? (
                  <img src={request.image} alt="Koi Fish" className="w-full mt-2 rounded-md" />
                ) : (
                  <div className="flex items-center justify-center bg-gray-800 h-48 rounded-md">
                    <p>No image available.</p>
                  </div>
                )}
              </div>

              {/* Video Display */}
              <div className="w-1/2">
                <strong className="text-[#bcab6f]">Video:</strong>
                {request.videoUrl ? (
                  <video className="w-full h-96 mt-2 rounded-md" controls>
                    <source src={request.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex items-center justify-center bg-gray-800 h-48 rounded-md">
                    <p>No video available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Negotiation Section */}
        {/* Only render the negotiation card when the status is PENDING_MANAGER_OFFER or PENDING_BREEDER_OFFER */}
        {(request.status === "PENDING_MANAGER_OFFER" ||
          request.status === "PENDING_BREEDER_OFFER") && (
            <Card className="bg-gray-700 p-4 rounded-lg shadow mb-6 w-auto h-max">
              <h4 className="text-lg font-semibold mb-4 text-[#bcab6f]">Negotiation</h4>

              {request.status === "PENDING_BREEDER_OFFER" && (
                <>
                  {/* Display Manager's Offer */}
                  <div style={{ marginBottom: "16px" }}>
                    <h3>Manager's Offer</h3>
                    <p>
                      <strong>Offer Price:</strong> ${request.offerPriceManager}
                    </p>
                    <p>
                      <strong>Auction Type:</strong>{" "}
                      {formatAuctionType(request.auctionTypeNameManager)}
                    </p>
                  </div>

                  {/* Negotiation Form */}
                  <Input
                    type="number"
                    placeholder="Your Offer Price"
                    value={offerPrice || ""}
                    onChange={(e) =>
                      setOfferPrice(e.target.value ? Number(e.target.value) : null)
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

                  {/* Actions for Breeder Offer */}
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
                </>
              )}
            </Card>
          )}


      </div>

      <button type="default" onClick={onBack} className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-500">
        Back
      </button>

    </div>
  );
};

export default RequestDetails;
