import { useEffect, useState } from "react";
import { Button, Select, Table, Modal, Tag } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import RequestDetails from "../components/RequestDetails";
import {
  FaFish,
  FaIdCard,
  FaFlag,
  FaClock,
  FaCog,
  FaEye,
} from "react-icons/fa";

const ManageRequestStatus = () => {
  const storedData = localStorage.getItem("accountData");
  const accountData = JSON.parse(storedData);
  const accountId = accountData.accountId;
  const [auctionRequests, setAuctionRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showList, setShowList] = useState(true);
  const [updatingRequest, setUpdatingRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const fetchRequest = async () => {
    try {
      console.log(accountId ? accountId : "none");
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/staff/list-request/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });

      const auctionData = response.data.data;
      console.log(response);
      console.log(auctionData);

      const formattedRequests = auctionData.map((item) => ({
        requestId: item.requestId,
        status: item.status,
        fishId: item.koiFish.fishId,
        breederId: item.breeder.breederId,
        breederName: item.breeder.breederName,
        mediaUrl: item.koiFish.media.imageUrl,
        staff: item.staff,
        koiFish: item.koiFish,
        varietyName: item.koiFish.variety.varietyName,
        requestedAt: item.requestedAt,
      }));
      const sortedRequests = formattedRequests.sort(
        (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
      );

      setAuctionRequests(sortedRequests);
    } catch (error) {
      console.error("Error fetching auction request data:", error);
      toast.error("Failed to fetch auction request data");
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

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

  const handleUpdateStatus = async () => {
    if (!updatingRequest?.requestId || !selectedStatus) {
      toast.error("Please select a valid status");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.patch(
        `/staff/request/${updatingRequest.requestId}/status`,
        {
          requestStatus: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        }
      );

      console.log(response); // Debugging: Check the response from the API

      if (response.status === 200) {
        toast.success("Status updated successfully");
        await fetchRequest();
        closeUpdateStatusModal(); // Close modal on success
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error.response?.data); // Log server error
      toast.error("Failed to update status");
    }
  };

  const showUpdateStatusModal = (record) => {
    setUpdatingRequest(record);
    setSelectedStatus(null); // Reset selected status when showing modal
  };

  const closeUpdateStatusModal = () => {
    setUpdatingRequest(null);
    setSelectedStatus(null); // Reset selected status on close
  };

  const displayStatus = (status) => {
    switch (status) {
      case "INSPECTION_PASSED":
        return "Pass";
      case "INSPECTION_FAILED":
        return "Not Pass";
      case "INSPECTION_IN_PROGRESS":
        return "In Progress";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: (
        <span className="flex items-center">
          <FaIdCard className="mr-2" /> Request ID
        </span>
      ),
      dataIndex: "requestId",
      key: "requestId",
      sorter: (a, b) => a.requestId - b.requestId,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <span className="flex items-center">
          <FaFish className="mr-2" /> Fish ID
        </span>
      ),
      dataIndex: "fishId",
      key: "fishId",
      sorter: (a, b) => a.fishId - b.fishId,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <span className="flex items-center">
          <FaFish className="mr-2" /> Fish Type
        </span>
      ),
      dataIndex: "varietyName",
      key: "varietyName",
      sorter: (a, b) => a.varietyName.localeCompare(b.varietyName),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <span className="flex items-center">
          <FaFish className="mr-2" /> Breeder
        </span>
      ),
      key: "breeder",
      render: (text, record) => (
        <span className="flex items-center">
          <FaFish className="mr-2" />
          ID: {record.breederId} - {record.breederName}
        </span>
      ),
      sorter: (a, b) => a.breederId - b.breederId,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <span className="flex items-center">
          <FaFlag className="mr-2" /> Status
        </span>
      ),
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={getStatusColor(text)}>{formatStatus(text)}</Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <span className="flex items-center">
          <FaClock className="mr-2" /> Created At
        </span>
      ),
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (text) => new Date(text).toLocaleString(), // Format date as needed
      sorter: (a, b) => new Date(a.requestedAt) - new Date(b.requestedAt),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button onClick={() => handleViewDetail(record)} type="link">
            View Detail
          </Button>
          {record.status === "ASSIGNED" && (
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
          <h1 className="text-left font-bold text-2xl my-5">
            Staff Request Manager
          </h1>
          <Table columns={columns} dataSource={auctionRequests} />

          {/* Update Status Modal */}
          <Modal
            visible={!!updatingRequest}
            title="Update Request Status"
            onCancel={closeUpdateStatusModal}
            onOk={handleUpdateStatus} // No need to pass parameters; handled internally
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
              <Select.Option value="CONFIRMING">Pass</Select.Option>
              <Select.Option value="CANCELED">Fail</Select.Option>
            </Select>
          </Modal>
        </>
      ) : (
        <>
          <Button onClick={handleGoBack}>Go Back</Button>
          <RequestDetails
            selectedRequest={selectedRequest}
            fetchRequest={fetchRequest}
            showUpdateStatusModal={showUpdateStatusModal} // Pass this for status modal
            updatingRequest={updatingRequest} // Pass this state to the modal in RequestDetails
            closeUpdateStatusModal={closeUpdateStatusModal} // Close modal callback
            selectedStatus={selectedStatus} // Status for the modal
            setSelectedStatus={setSelectedStatus} // Set status function for modal
            onBack={handleGoBack}
          />
        </>
      )}
    </div>
  );
};

export default ManageRequestStatus;
