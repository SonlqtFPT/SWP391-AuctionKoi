import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Spin } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import RequestDetails from "./RequestDetails";

const ManageRequest = () => {
  const [auctionRequests, setAuctionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showList, setShowList] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch auction requests
  const fetchRequest = async () => {
    setLoading(true);
    try {
      const response = await api.get("manager/request/getRequest");
      const auctionData = response.data.data;
      const formattedRequests = auctionData.map((item) => ({
        requestId: item.requestId,
        status: item.status,
        fishId: item.koiFish.fishId,
        image: item.koiFish.media.imageUrl,
        videoUrl: item.koiFish.media.videoUrl,
        breederId: item.breeder.breederId,
        breederName: item.breeder.breederName,
        gender: item.koiFish.gender,
        age: item.koiFish.age,
        size: item.koiFish.size,
        price: item.koiFish.price,
        auctionTypeName: item.koiFish.auctionTypeName,
        varietyName: item.koiFish.variety.varietyName,
      }));
      setAuctionRequests(formattedRequests);
    } catch (error) {
      toast.error("Failed to fetch auction request data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff members
  const fetchStaff = async () => {
    try {
      const response = await api.get("/manager/request/assign-staff/getStaff");
      setStaffList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch staff list");
    }
  };

  useEffect(() => {
    fetchRequest();
    fetchStaff();
  }, []);

  // View request details
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowList(false);
  };

  // Go back to the request list
  const handleGoBack = () => {
    setShowList(true);
    setSelectedRequest(null);
  };

  // Table columns
  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
    },
    {
      title: "Fish ID",
      dataIndex: "fishId",
      key: "fishId",
    },
    {
      title: "Breeder ID",
      dataIndex: "breederId",
      key: "breederId",
    },
    {
      title: "Breeder Name",
      dataIndex: "breederName",
      key: "breederName",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <img src={image} alt="" width={200} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => formatStatus(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => handleViewDetail(record)} type="link">
          View Detail
        </Button>
      ),
    },
  ];

  // Format the status
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

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {showList ? (
            <>
              <h1>Auction Request Manager</h1>
              <Table
                columns={columns}
                dataSource={auctionRequests}
                pagination={{ pageSize: 10 }}
              />
            </>
          ) : (
            <RequestDetails
              selectedRequest={selectedRequest}
              staffList={staffList}
              onAssign={fetchRequest} // To refresh the request list after assignment
              fetchRequest={fetchRequest} // For refresh in RequestDetails
              onGoBack={handleGoBack} // Function to go back to the list
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManageRequest;
