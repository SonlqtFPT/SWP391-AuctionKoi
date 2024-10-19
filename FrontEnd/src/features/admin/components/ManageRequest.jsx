import React, { useEffect, useState } from "react";
import { Button, Table, Spin, Tag, Input, Select, DatePicker } from "antd";
import { toast } from "react-toastify";
import {
  FaFish,
  FaIdCard,
  FaFlag,
  FaClock,
  FaCog,
  FaEye,
} from "react-icons/fa"; // Removed FaHandshake import
import api from "../../../config/axios";
import RequestDetails from "./RequestDetails";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ManageRequest = () => {
  const [auctionRequests, setAuctionRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showList, setShowList] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState("requestId"); // Default search field
  const [dateRange, setDateRange] = useState([null, null]); // Date range for filtering

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
        videoUrl: item.koiFish.media.videoUrl,
        image: item.koiFish.media.imageUrl,
        breederId: item.breeder.breederId,
        breederName: item.breeder.breederName,
        breederLocation: item.breeder.location, // Include breeder location
        gender: item.koiFish.gender,
        age: item.koiFish.age,
        size: item.koiFish.size,
        price: item.koiFish.price,
        auctionTypeName: item.koiFish.auctionTypeName,
        varietyName: item.koiFish.variety.varietyName,
        requestedAt: item.requestedAt,
      }));
      setAuctionRequests(formattedRequests);
      setFilteredRequests(formattedRequests); // Set filtered requests initially
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

  // Handle search
  const handleSearch = (value) => {
    const filtered = auctionRequests.filter((request) => {
      if (searchField === "requestedAt" && dateRange[0] && dateRange[1]) {
        const requestDate = new Date(request.requestedAt);
        return requestDate >= dateRange[0] && requestDate <= dateRange[1];
      } else {
        return request[searchField]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    });
    setFilteredRequests(filtered);
  };

  // Handle date range change
  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates[0] && dates[1]) {
      const filtered = auctionRequests.filter((request) => {
        const requestDate = new Date(request.requestedAt);
        return (
          requestDate >= dates[0].startOf("day") &&
          requestDate <= dates[1].endOf("day")
        );
      });
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(auctionRequests); // Reset to all if no date is selected
    }
  };

  // Table columns
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
          <FaClock className="mr-2" /> Created At
        </span>
      ),
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (text) => formatDate(text),
      sorter: (a, b) => new Date(a.requestedAt) - new Date(b.requestedAt),
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
          <FaCog className="mr-2" /> Action
        </span>
      ),
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button onClick={() => handleViewDetail(record)} type="link">
            <FaEye className="mr-1" /> View Detail
          </Button>

        </div>
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
      case "PENDING_NEGOTIATION":
        return "Negotiating";
      case "PENDING_MANAGER_OFFER":
        return "Waiting For Manager Approve"; // New status
      case "PENDING_BREEDER_OFFER":
        return "Waiting For Breeder Approve"; // New status
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  // Determine the color for the status tag
  const getStatusColor = (status) => {

    switch (
      status.toUpperCase() // Ensure status is case-insensitive
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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
              <div className="flex items-center mb-4">
                <Select
                  defaultValue="requestId"
                  style={{ width: 150, marginRight: 10 }}
                  onChange={(value) => setSearchField(value)}
                >
                  <Option value="requestId">Request ID</Option>
                  <Option value="fishId">Fish ID</Option>
                  <Option value="breederId">Breeder ID</Option>
                  <Option value="status">Status</Option>
                  <Option value="requestedAt">Created At</Option>
                  <Option value="breederName">Breeder Name</Option>
                </Select>

                {searchField === "requestedAt" ? (
                  <RangePicker
                    onChange={handleDateChange}
                    style={{ marginRight: 10 }}
                  />
                ) : (
                  <Search
                    placeholder="Search..."
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                  />
                )}
              </div>
              <Table
                columns={columns}
                dataSource={filteredRequests}
                rowKey="requestId"
              />
            </>
          ) : (
            <RequestDetails
              request={selectedRequest}
              onBack={handleGoBack}
              staffList={staffList}
              fetchRequest={fetchRequest}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ManageRequest;