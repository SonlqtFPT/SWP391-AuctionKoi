import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Select } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios"; // Axios instance for API calls
import RequestDetails from "./RequestDetails"; // Import the new RequestDetails component

const ManageRequest = ({}) => {
  const [auctionRequests, setAuctionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showList, setShowList] = useState(true);
  const [staffList, setStaffList] = useState([]); // Store staff list
  const [assigningRequest, setAssigningRequest] = useState(null); // Request being assigned
  const [selectedStaff, setSelectedStaff] = useState(null); // Selected staff for assignment

  // Fetch auction requests from the server
  const fetchRequest = async () => {
    try {
      const response = await api.get("manager/getRequest");
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

  // Fetch staff list for assignment
  const fetchStaff = async () => {
    try {
      const response = await api.get("/manager/assign-staff/getStaff");
      setStaffList(response.data.data); // Store the staff data
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("Failed to fetch staff list");
    }
  };

  useEffect(() => {
    fetchRequest();
    fetchStaff(); // Fetch staff when component loads
  }, []);

  // Assign staff to a request
  const handleAssignStaff = async (assigningRequest, selectedStaff) => {
    if (!assigningRequest || !selectedStaff) {
      toast.error("Please select a staff member");
      return;
    }

    try {
      const response = await api.post(
        `/manager/assign-staff/${assigningRequest.requestId}?accountId=${selectedStaff}`
      );

      if (response.status === 200) {
        toast.success("Staff assigned successfully");
        fetchRequest(); // Refresh the data after assignment
      } else {
        throw new Error("Failed to assign staff");
      }
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast.error("Failed to assign staff");
    }
  };

  // Show assign modal
  const showAssignModal = (record) => {
    setAssigningRequest(record); // Set the request for which staff will be assigned
  };

  // Close the assign modal
  const closeAssignModal = () => {
    setAssigningRequest(null);
    setSelectedStaff(null); // Clear selected staff when modal is closed
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
      render: (text) => formatStatus(text), // Display status without editing
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button onClick={() => handleViewDetail(record)} type="link">
            View Detail
          </Button>
          {record.status === "PENDING" && ( // Only show the button if status is "PENDING"
            <Button onClick={() => showAssignModal(record)} type="primary">
              Assign Staff
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

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

          {/* Assign Staff Modal */}
          <Modal
            visible={!!assigningRequest}
            title="Assign Staff"
            onCancel={closeAssignModal}
            onOk={() => {
              handleAssignStaff(assigningRequest, selectedStaff);
              closeAssignModal();
            }}
            okText="Assign"
            cancelText="Cancel"
          >
            <p>
              Assign a staff member to request ID: {assigningRequest?.requestId}
            </p>
            <Select
              placeholder="Select staff"
              style={{ width: "100%" }}
              onChange={(value) => setSelectedStaff(value)}
            >
              {staffList.map((staff) => (
                <Select.Option key={staff.accountId} value={staff.accountId}>
                  {staff.firstName} | {staff.lastName} | AccountID :
                  {staff.accountId}
                </Select.Option>
              ))}
            </Select>
          </Modal>
        </>
      ) : (
        <>
          <Button onClick={handleGoBack}>Go Back</Button>
          {/* Pass the necessary props to RequestDetails */}
          <RequestDetails
            selectedRequest={selectedRequest}
            staffList={staffList}
            onAssign={handleAssignStaff} // Pass the assignment handler
            fetchRequest={fetchRequest} // Pass fetchRequest for refreshing
          />
        </>
      )}
    </div>
  );
};

export default ManageRequest;
