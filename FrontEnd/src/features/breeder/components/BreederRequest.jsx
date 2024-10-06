import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spin,
  Tag,
  Input,
  DatePicker,
  Select,
  Space,
} from "antd"; // Add Select component for dropdown
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import RequestDetails from "../components/RequestDetails";
import AddBreederRequest from "../components/AddBreederRequest"; // Import the AddBreederRequest component
import api from "../../../config/axios";
import { toast } from "react-toastify";
import {
  FaIdBadge,
  FaFish,
  FaCalendarAlt,
  FaGavel,
  FaInfoCircle,
} from "react-icons/fa"; // Import relevant icons

const { RangePicker } = DatePicker; // Use Antd's RangePicker for date selection
const { Option } = Select; // Use Antd's Select Option

const BreederRequest = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]); // For storing filtered requests
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingRequest, setAddingRequest] = useState(false); // State for adding request
  const [viewingDetails, setViewingDetails] = useState(false); // New state for viewing request details
  const [search, setSearch] = useState(""); // State for search input
  const [searchField, setSearchField] = useState("requestId"); // State for search field selection
  const [dateRange, setDateRange] = useState(null); // Separate state for date range if 'Created At' is selected

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const breederId = 1; // Assuming you want to fetch requests for this breeder
      const response = await api.get(`/breeder/request/${breederId}`);

      const requestData = response.data.data.map((item) => ({
        requestId: item.requestId,
        status: item.status,
        requestedAt: item.requestedAt,
        auctionTypeNameManager: item.auctionTypeName,
        auctionTypeNameBreeder: item.koiFish.auctionTypeName,
        fishId: item.koiFish.fishId,
        breederId: item.breeder.breederId,
        breederName: item.breeder.breederName,
        breederLocation: item.breeder.location, // include breeder location
        price: item.koiFish.price,
        offerPriceManager: item.offerPrice, // include offer price
        age: item.koiFish.age, // include age
        size: item.koiFish.size, // include size
        varietyName: item.koiFish.variety.varietyName, // include variety name
        image: item.koiFish.media.imageUrl, // include image URL
        videoUrl: item.koiFish.media.videoUrl, // include video URL
      }));

      setRequests(requestData);
      setFilteredRequests(requestData); // Initially set filtered data to full data
    } catch (error) {
      toast.error("Failed to fetch breeder requests");
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request); // This now contains all details
    setViewingDetails(true); // Set state to indicate we're viewing details
    setRequests([]); // Clear the request list when viewing details
  };

  const handleBackToRequests = () => {
    setAddingRequest(false); // Set addingRequest to false to show the requests
    setViewingDetails(false); // Reset viewing details state
    fetchRequests(); // Optionally refetch requests to refresh the list
  };

  // Filter logic based on search criteria
  const handleSearch = () => {
    const filtered = requests.filter((item) => {
      switch (searchField) {
        case "requestId":
          return search === "" || item.requestId.toString().includes(search);
        case "fishId":
          return search === "" || item.fishId.toString().includes(search);
        case "auctionTypeNameBreeder":
          return (
            search === "" ||
            item.auctionTypeNameBreeder
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        case "status":
          return (
            search === "" ||
            item.status.toLowerCase().includes(search.toLowerCase())
          );
        case "requestedAt":
          return (
            !dateRange ||
            (new Date(item.requestedAt) >= dateRange[0] &&
              new Date(item.requestedAt) <= dateRange[1])
          );
        default:
          return true;
      }
    });
    setFilteredRequests(filtered); // Update the filtered requests
  };

  // Reset search inputs and show all data
  const resetSearch = () => {
    setSearch(""); // Clear search input
    setDateRange(null); // Reset date range
    setFilteredRequests(requests); // Reset to the full request list
  };

  const columns = [
    {
      title: (
        <span className="flex items-center">
          <FaIdBadge className="mr-2" /> Request ID
        </span>
      ),
      dataIndex: "requestId",
      key: "requestId",
      sorter: (a, b) => a.requestId - b.requestId,
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
    },
    {
      title: (
        <span className="flex items-center">
          <FaCalendarAlt className="mr-2" /> Created At
        </span>
      ),
      dataIndex: "requestedAt",
      key: "requestedAt",
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.requestedAt) - new Date(b.requestedAt),
    },
    {
      title: (
        <span className="flex items-center">
          <FaGavel className="mr-2" /> Auction Type
        </span>
      ),
      dataIndex: "auctionTypeNameBreeder",
      key: "auctionTypeNameBreeder",
    },
    {
      title: (
        <span className="flex items-center">
          <FaInfoCircle className="mr-2" /> Status
        </span>
      ),
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={getStatusColor(text)}>{formatStatus(text)}</Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => handleViewDetails(record)}>View Details</Button>
      ),
    },
  ];

  const formatStatus = (status) => {
    switch (status) {
      case "APPROVE":
        return "Approved";
      case "PENDING":
        return "Pending";
      case "PENDING_MANAGER_OFFER":
        return "Waiting For Manager Approve";
      case "PENDING_BREEDER_OFFER":
        return "Waiting For Breeder Approve";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

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

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <h1>Breeder Requests</h1>
          <Space style={{ marginBottom: 16 }}>
            {/* Dropdown to select search field */}
            <Select
              value={searchField}
              onChange={(value) => setSearchField(value)}
              style={{ width: 200 }}
            >
              <Option value="requestId">Request ID</Option>
              <Option value="fishId">Fish ID</Option>
              <Option value="auctionTypeNameBreeder">Auction Type</Option>
              <Option value="status">Status</Option>
              <Option value="requestedAt">Created At</Option>
            </Select>

            {/* Conditionally render input field or date picker based on selected search field */}
            {searchField === "requestedAt" ? (
              <RangePicker
                onChange={(dates) => setDateRange(dates)}
                format="YYYY-MM-DD"
                placeholder={["Start Date", "End Date"]}
              />
            ) : (
              <Input
                placeholder={`Search by ${searchField}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
              />
            )}

            {/* Search Button */}
            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
            >
              Search
            </Button>

            {/* Reset Button */}
            <Button onClick={resetSearch} icon={<ReloadOutlined />}>
              Reset
            </Button>
          </Space>

          {addingRequest ? (
            <AddBreederRequest onBack={handleBackToRequests} /> // Render AddBreederRequest
          ) : viewingDetails ? (
            <div
              style={{
                marginTop: "20px",
                border: "1px solid #d9d9d9",
                padding: "20px",
              }}
            >
              <RequestDetails
                request={selectedRequest}
                onBack={handleBackToRequests} // Go back to the requests list
              />
            </div>
          ) : (
            <Table
              dataSource={filteredRequests} // Use filtered requests for data
              columns={columns}
              rowKey="requestId"
            />
          )}
        </>
      )}
    </div>
  );
};

export default BreederRequest;
