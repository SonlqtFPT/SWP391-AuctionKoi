import { useState, useEffect } from "react";
import { Button, Card, Select, Input, notification } from "antd";
import api from "../../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";

const RequestDetails = () => {
  const { requestId } = useParams(); // Lấy requestId từ URL
  const [request, setRequest] = useState(); // Khởi tạo state cho request
  const [offerPrice, setOfferPrice] = useState(null);
  const [offerAuctionType, setOfferAuctionType] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const fetchRequestDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`request/get/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequest(response.data.data); // Giả sử response.data.data chứa thông tin yêu cầu
      console.log("API detail: ", response.data.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  if (!request) return <p>Loading...</p>; // Hiển thị loading nếu chưa có dữ liệu

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
    switch (status) {
      case "INSPECTION_PASSED":
        return "Confirming";
      case "INSPECTION_FAILED":
        return "Canceled";
      case "INSPECTION_IN_PROGRESS":
        return "Assigned";
      case "PENDING":
        return "Requesting";
      case "PENDING_NEGOTIATION":
        return "Negotiating";
      case "PENDING_MANAGER_OFFER":
        return "Confirming";
      case "PENDING_BREEDER_OFFER":
        return "Negotiating";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      case "APPROVE":
        return "Registered";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
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
        return "gold";
      case "PENDING_BREEDER_OFFER":
        return "lime";
      case "COMPLETED":
        return "geekblue";
      case "CANCELLED":
        return "volcano";
      case "APPROVE":
        return "green";
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

    console.log("Chạy nè", request.requestId);

    console.log("Chạy nè", offerPrice);

    console.log("Chạy nè", offerAuctionType);
    try {
      const response = await api.post(
        `/breeder/request/negotiation/send-negotiation/${request.requestId}`,
        {
          price: offerPrice,
          auctionTypeName: offerAuctionType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Chạy nè");
      console.log(response);
      notification.success({
        message: "Success",
        description: "Offer submitted successfully!",
      });
      fetchRequestDetails();
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
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        `/breeder/request/negotiation/accept/${request.requestId}`,
        {}, // No request body, so an empty object is passed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      notification.success({
        message: "Success",
        description: "Offer accepted successfully!",
      });
      fetchRequestDetails();
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
      // Retrieve the access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      // Make the API request with the access token in the headers
      const response = await api.post(
        `/manager/request/cancel/${request.requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include access token
          },
        }
      );

      notification.success({
        message: "Success",
        description: "Request cancelled successfully!",
      });
      console.log(response);
      fetchRequestDetails();
    } catch (error) {
      console.error("Error cancelling request:", error);
      notification.error({
        message: "Error",
        description: "Failed to cancel the request.",
      });
    }
  };

  const handlePageBack = () => {
    navigate("/breeder/profile/view-request");
  };

  const handleUpdate = () => {
    navigate(`/breeder/update-request/${requestId}`);
  };
  return (
    <div>
      <Header />
      <div className=" bg-[#131313] text-white pt-10 h-screen">
        <button
          type="default"
          onClick={handlePageBack}
          className="bg-red-600 text-white rounded-lg px-4 py-2 mb-3 hover:bg-red-500 mt-20 ml-10"
        >
          Back
        </button>
        <h2 className="text-3xl font-extrabold mb-6 text-[#bcab6f] text-center">
          Request Details
        </h2>

        <div className="flex flex-col gap-9 mb-8 divide-y">
          {/* Left Side: All Information Section */}
          <div className="col-span-2">
            <div className="p-3 mb-5">
              <div className="grid grid-cols-3 gap-4">
                {/* Breeder Info */}
                <div className="bg-gray-900 hover:bg-gray-800 rounded-2xl  my-4 border-2 border-[#bcab6f] py-4 pl-10 outline outline-offset-4 mx-2">
                  <p>
                    <strong>Breeder ID:</strong> {request.breeder.breederId}
                  </p>
                  <p>
                    <strong>Breeder Name:</strong> {request.breeder.breederName}
                  </p>
                  <p>
                    <strong>Location:</strong> {request.breeder.location}
                  </p>
                  <h4 className="font-extrabold text-2xl text-[#bcab6f] mt-6">
                    Breeder Info
                  </h4>
                </div>

                {/* Koi Info */}
                <div className="bg-gray-900 hover:bg-gray-800 rounded-2xl my-4 border-2 border-[#bcab6f] py-4 pl-6 outline outline-offset-4 mx-2">
                  <div className="grid grid-cols-2">
                    <p>
                      <strong>Fish ID:</strong> {request.koiFish.fishId}
                    </p>
                    <p>
                      <strong>Size:</strong> {request.koiFish.size} cm
                    </p>
                    <p>
                      <strong>Age:</strong> {request.koiFish.age}
                    </p>
                    <p>
                      <strong>Variety:</strong>{" "}
                      {request.koiFish.variety.varietyName}
                    </p>
                    <p>
                      <strong>Gender:</strong> {request.koiFish.gender}
                    </p>
                  </div>
                  <h5 className="font-extrabold text-2xl text-[#bcab6f] mt-6">
                    Koi Info
                  </h5>
                </div>

                {/* Request Info */}
                <div className="bg-gray-900 hover:bg-gray-800 rounded-2xl text-balance my-4 border-2 border-[#bcab6f] py-4 pl-10 outline outline-offset-4 mx-2">
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={getStatusColor(request.status)}>
                      {formatStatus(request.status)}
                    </span>
                  </p>
                  <p>
                    <strong>Requested At:</strong>{" "}
                    {new Date(request.requestedAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Price:</strong> {request.koiFish.price} vnđ
                  </p>
                  <p>
                    <strong>Auction Type:</strong>{" "}
                    {request.koiFish.auctionTypeName}
                  </p>
                  <h6 className="font-extrabold text-2xl text-[#bcab6f]">
                    Request Info
                  </h6>
                </div>
              </div>
              {request.status === "PENDING" && (
                <div className="mt-4 ml-4 py-2 mx-0 flex items-center gap-5">
                  <h9 className="font-mono text-[#bcab6f]">
                    If you have any issue, please update your request or cancel
                    it.
                  </h9>
                  <button
                    type="default"
                    onClick={handleCancel}
                    className="bg-red-600 rounded-lg px-4 py-2 hover:bg-red-500"
                  >
                    Cancel Request
                  </button>
                  <button
                    type="default"
                    onClick={handleUpdate}
                    className="bg-blue-400 rounded-lg px-4 py-2 hover:bg-blue-300"
                  >
                    Update Request
                  </button>
                </div>
              )}
            </div>

            {/* Negotiation Section */}
            {/* Only render the negotiation card when the status is PENDING_MANAGER_OFFER or PENDING_BREEDER_OFFER */}
            {(request.status === "PENDING_MANAGER_OFFER" ||
              request.status === "PENDING_BREEDER_OFFER") && (
              <Card className="bg-gray-900 hover:bg-gray-800 rounded-2xl  my-4 border-2 border-[#bcab6f] py-4 pl-10 outline outline-offset-4 outline-white mx-60">
                <h7 className="font-extrabold text-2xl text-[#bcab6f]">
                  Negotiation
                </h7>

                {request.status === "PENDING_BREEDER_OFFER" && (
                  <>
                    {/* Display Manager's Offer */}
                    <div style={{ marginBottom: "16px" }}>
                      <h8 className="text-white font-semibold underline underline-offset-1">
                        Manager's Offer
                      </h8>
                      <p className="text-white font-semibold">
                        <strong>Offer Price:</strong> ${request.offerPrice}
                      </p>
                      <p className="text-white font-semibold">
                        <strong>Auction Type:</strong>{" "}
                        {formatAuctionType(request.auctionTypeName)}
                      </p>
                    </div>

                    {/* Negotiation Form */}
                    <Input
                      type="number"
                      placeholder="Your Offer Price"
                      value={offerPrice || ""}
                      onChange={(e) =>
                        setOfferPrice(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="text-black w-48 mb-4 mr-4 px-3 py-2 border-2 border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500" // Thay đổi bg-gray-200 thành bg-white
                      style={{ backgroundColor: "white" }} // Đảm bảo màu nền là trắng
                    />
                    <Select
                      placeholder="Select Auction Type"
                      value={offerAuctionType || undefined}
                      onChange={setOfferAuctionType}
                      style={{
                        width: "200px",
                        marginBottom: "16px",
                        height: "38px",
                      }}
                      className="pr-5"
                    >
                      <Select.Option value="ASCENDING_BID">
                        Ascending Bid
                      </Select.Option>
                      <Select.Option value="DESCENDING_BID">
                        Descending Bid
                      </Select.Option>
                      <Select.Option value="SEALED_BID">
                        Sealed Bid
                      </Select.Option>
                      <Select.Option value="DIRECT_SALE">
                        Direct Sale
                      </Select.Option>
                    </Select>
                    <Button type="primary" onClick={handleNegotiate}>
                      Submit Offer
                    </Button>

                    {/* Actions for Breeder Offer */}
                    <div className="mt-4">
                      <h9 className="font-mono text-[#bcab6f]">
                        Note! Clicking Accept Offer only if you have confirmed
                        your deal with us.
                      </h9>
                      <button
                        type="primary"
                        onClick={handleAccept}
                        className="bg-red-600 font-bold rounded-lg px-4 py-2 hover:bg-red-500 mx-4"
                      >
                        Accept Offer
                      </button>
                      <button
                        type="default"
                        onClick={handleCancel}
                        className="bg-slate-400 rounded-lg px-4 py-2 hover:bg-slate-300"
                      >
                        Cancel Offer
                      </button>
                    </div>
                  </>
                )}
              </Card>
            )}
          </div>

          {/* Media Section */}
          <div>
            <div className="flex flex-row justify-between gap-5 p-3">
              {/* Image Display */}
              <div className="">
                <strong className="text-[#bcab6f] font-extrabold text-2xl">
                  Image:
                </strong>
                {request.koiFish.media.imageUrl ? (
                  <img
                    src={request.koiFish.media.imageUrl}
                    alt="Koi Fish"
                    className="w-80 h-80"
                  />
                ) : (
                  <div className="flex items-center justify-center bg-gray-800 h-48 rounded-md">
                    <p>No image available.</p>
                  </div>
                )}
              </div>

              {/* Video Display */}
              <div className="w-1/2">
                <strong className="text-[#bcab6f] font-extrabold text-2xl">
                  Video:
                </strong>
                {request.koiFish.media.videoUrl ? (
                  <video className="w-full h-96 mt-2 rounded-md" controls>
                    <source
                      src={request.koiFish.media.videoUrl}
                      type="video/mp4"
                    />
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
      </div>
      <Footer />
    </div>
  );
};

export default RequestDetails;
