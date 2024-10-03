import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Select, Spin } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios"; // Axios instance for API calls
import RequestDetails from "./RequestDetails"; // Import the new RequestDetails component

const ManageRequest = () => {
  const [auctionRequests, setAuctionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showList, setShowList] = useState(true);
  const [staffList, setStaffList] = useState([]); // Store staff list
  const [assigningRequest, setAssigningRequest] = useState(null); // Request being assigned
  const [selectedStaff, setSelectedStaff] = useState(null); // Selected staff for assignment
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch auction requests from the server
  const fetchRequest = async () => {
    setLoading(true);
    try {
      const response = await api.get("manager/request/getRequest");
      const auctionData = response.data.data;
      console.log(auctionData);
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
      console.error("Error fetching auction request data:", error);
      toast.error("Failed to fetch auction request data");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch staff list for assignment
  const fetchStaff = async () => {
    try {
      const response = await api.get("/manager/request/assign-staff/getStaff");
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
      console.log(selectedStaff);
      const response = await api.post(
        `/manager/request/assign-staff/${assigningRequest.requestId}?accountId=${selectedStaff}`
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
    switch (status) {
      case "INSPECTION_PASSED":
        return "Pass";
      case "INSPECTION_FAILED":
        return "Fail";
      case "INSPECTION_IN_PROGRESS": // Add this case
        return "Checking";
      case "PENDING":
        return "Pending";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase(); // Capitalizes the first letter for other statuses
    }
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
      {loading ? ( // Show loading spinner while fetching data
        <Spin size="large" />
      ) : (
        <>
          {showList ? (
            <>
              <h1>Auction Request Manager</h1>
              <Table
                columns={columns}
                dataSource={auctionRequests}
                pagination={{ pageSize: 10 }} // Add pagination if needed
              />

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
                  Assign a staff member to request ID:{" "}
                  {assigningRequest?.requestId}
                </p>
                <Select
                  placeholder="Select staff"
                  style={{ width: "100%" }}
                  onChange={(value) => setSelectedStaff(value)}
                >
                  {staffList.map((staff) => (
                    <Select.Option
                      key={staff.accountId}
                      value={staff.accountId}
                    >
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
        </>
      )}
    </div>
  );
};

export default ManageRequest;
