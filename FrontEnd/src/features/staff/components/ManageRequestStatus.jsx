import React, { useEffect, useState } from "react";
import { Button, Select, Table, Modal } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios"; // Axios instance for API calls
import RequestDetails from "../components/RequestDetails"; // Import the RequestDetails component

const ManageRequestStatus = ({ onGoBack }) => {
  const [auctionRequests, setAuctionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showList, setShowList] = useState(true);
  const [statusOptions] = useState([
    { label: "Inspection Passed", value: "INSPECTION_PASSED" },
    { label: "Inspection Failed", value: "INSPECTION_FAILED" },
  ]);
  const [updatingRequest, setUpdatingRequest] = useState(null); // Request being updated
  const [selectedStatus, setSelectedStatus] = useState(null); // Selected status for update
  const accountId = 4; // Default account ID for the staff

  // Fetch auction requests assigned to this staff member
  const fetchRequest = async () => {
    try {
      const response = await api.get(`/staff/list-request/${accountId}`);
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
        varietyName: item.koiFish.variety.varietyName,
      }));

      setAuctionRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching auction request data:", error);
      toast.error("Failed to fetch auction request data");
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []); // Fetch requests on component mount

  // Update the status of a request
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
        setUpdatingRequest(null); // Clear the updating request
        fetchRequest(); // Refresh the data after update
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Show update status modal
  const showUpdateStatusModal = (record) => {
    setUpdatingRequest(record); // Set the request for which status will be updated
    setSelectedStatus(null); // Reset selected status
  };

  // Close the update status modal
  const closeUpdateStatusModal = () => {
    setUpdatingRequest(null);
    setSelectedStatus(null); // Clear selected status when modal is closed
  };

  // Map status to a user-friendly display
  const displayStatus = (status) => {
    switch (status) {
      case "INSPECTION_PASSED":
        return "Pass";
      case "INSPECTION_FAILED":
        return "Fail";
      case "INSPECTION_IN_PROGRESS":
        return "In Progress";
      default:
        return status; // Fallback for any unexpected status
    }
  };

  // Table columns definition
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
      render: (text, record) => displayStatus(record.status), // Display user-friendly status
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        // Show update status button only if the request is in progress
        const isInProgress = record.status === "INSPECTION_IN_PROGRESS";
        return (
          <div>
            <Button onClick={() => handleViewDetail(record)} type="link">
              View Detail
            </Button>
            {isInProgress && (
              <Button
                onClick={() => showUpdateStatusModal(record)}
                type="primary"
              >
                Update Status
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // View auction request details
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowList(false); // Hide the list and show the details
  };

  // Go back to the request list
  const handleGoBack = () => {
    setShowList(true); // Show the list again
    setSelectedRequest(null); // Clear selected request
  };

  return (
    <div>
      {showList ? (
        <>
          <h1>Auction Request Manager</h1>
          <Table columns={columns} dataSource={auctionRequests} />

          {/* Update Status Modal */}
          <Modal
            visible={!!updatingRequest} // Show the modal if updatingRequest is set
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
              value={selectedStatus} // Bind value to selectedStatus
            >
              {statusOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Modal>
        </>
      ) : (
        <>
          <Button onClick={handleGoBack}>Go Back</Button>
          {/* Pass the showUpdateStatusModal function to RequestDetails */}
          <RequestDetails
            selectedRequest={selectedRequest}
            onUpdateStatus={() => showUpdateStatusModal(selectedRequest)} // Use the function directly here
          />
        </>
      )}
    </div>
  );
};

export default ManageRequestStatus;
