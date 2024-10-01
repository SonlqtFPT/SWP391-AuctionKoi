import React, { useEffect, useState } from "react";
import { Button, Select, Table, Modal } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import RequestDetails from "../components/RequestDetails";

const ManageRequestStatus = ({ onGoBack }) => {
  const [auctionRequests, setAuctionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showList, setShowList] = useState(true);
  const [updatingRequest, setUpdatingRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const accountId = 4;

  const fetchRequest = async () => {
    try {
      const response = await api.get(`/staff/list-request/${accountId}`);
      const auctionData = response.data.data;

      // Map the response data to a suitable format for display
      const formattedRequests = auctionData.map((item) => ({
        requestId: item.requestId,
        status: item.status,
        fishId: item.koiFish.fishId,
        gender: item.koiFish.gender,
        age: item.koiFish.age,
        size: item.koiFish.size,
        price: item.koiFish.price,
        auctionTypeName: item.koiFish.auctionTypeName,
        mediaUrl: item.koiFish.media.imageUrl,
        videoUrl: item.koiFish.media.videoUrl,
        varietyName: item.koiFish.variety.varietyName,
        breederId: item.breeder.breederId,
        breederName: item.breeder.breederName,
        breederLocation: item.breeder.location,
        staff: {
          accountId: item.staff.accountId,
          email: item.staff.email,
          firstName: item.staff.firstName,
          lastName: item.staff.lastName,
          phoneNumber: item.staff.phoneNumber,
          role: item.staff.role,
        },
      }));

      setAuctionRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching auction request data:", error);
      toast.error("Failed to fetch auction request data");
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  const handleUpdateStatus = async () => {
    if (!updatingRequest || !selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      const response = await api.patch(
        `/staff/request/${updatingRequest.requestId}/status`,
        {
          requestStatus: selectedStatus,
        }
      );

      if (response.status === 200) {
        toast.success("Status updated successfully");
        setUpdatingRequest(null);
        fetchRequest();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const showUpdateStatusModal = (record) => {
    setUpdatingRequest(record);
    setSelectedStatus(null);
  };

  const closeUpdateStatusModal = () => {
    setUpdatingRequest(null);
    setSelectedStatus(null);
  };

  // Utility function to display statuses
  const displayStatus = (status) => {
    switch (status) {
      case "INSPECTION_PASSED":
        return "Pass";
      case "INSPECTION_FAILED":
        return "Not Pass";
      case "INSPECTION_IN_PROGRESS":
        return "In Progress";
      default:
        return status; // Fallback for any unexpected status
    }
  };

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
      title: "Breeder Name",
      dataIndex: "breederName",
      key: "breederName",
    },
    {
      title: "Breeder Location",
      dataIndex: "breederLocation",
      key: "breederLocation",
    },
    {
      title: "Fish Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Fish Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Fish Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Fish Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Auction Type",
      dataIndex: "auctionTypeName",
      key: "auctionTypeName",
    },
    {
      title: "Variety",
      dataIndex: "varietyName",
      key: "varietyName",
    },
    {
      title: "Image",
      dataIndex: "mediaUrl",
      key: "mediaUrl",
      render: (image) => <img src={image} alt="" width={200} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => displayStatus(record.status), // Display user-friendly status
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button onClick={() => handleViewDetail(record)} type="link">
            View Detail
          </Button>
          {record.status === "INSPECTION_IN_PROGRESS" && (
            <Button
              onClick={() => showUpdateStatusModal(record)}
              type="primary"
            >
              Update Status
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowList(false);
  };

  const handleGoBack = () => {
    setShowList(true);
    setSelectedRequest(null);
  };

  return (
    <div>
      {showList ? (
        <>
          <h1>Auction Request Manager</h1>
          <Table columns={columns} dataSource={auctionRequests} />

          {/* Update Status Modal */}
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
              <Select.Option value="INSPECTION_PASSED">
                Inspection Passed
              </Select.Option>
              <Select.Option value="INSPECTION_FAILED">
                Inspection Failed
              </Select.Option>
            </Select>
          </Modal>
        </>
      ) : (
        <>
          <Button onClick={handleGoBack}>Go Back</Button>
          <RequestDetails
            selectedRequest={selectedRequest}
            onUpdateStatus={() => showUpdateStatusModal(selectedRequest)}
          />
        </>
      )}
    </div>
  );
};

export default ManageRequestStatus;
