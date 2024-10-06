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
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import RequestDetails from "../components/RequestDetails";
import AddBreederRequest from "../components/AddBreederRequest";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import {
  FaIdBadge,
  FaFish,
  FaCalendarAlt,
  FaGavel,
  FaInfoCircle,
} from "react-icons/fa";

const { RangePicker } = DatePicker;
const { Option } = Select;

const BreederRequest = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingRequest, setAddingRequest] = useState(false);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("requestId");
  const [dateRange, setDateRange] = useState(null);

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
        auctionTypeNameBreeder: formatAuctionType(item.koiFish.auctionTypeName),
        auctionTypeNameManager: formatAuctionType(item.auctionTypeName),
        fishId: item.koiFish.fishId,
        breederId: item.breeder.breederId,
        breederName: item.breeder.breederName,
        breederLocation: item.breeder.location,
        price: item.koiFish.price,
        offerPriceManager: item.offerPrice,
        age: item.koiFish.age,
        size: item.koiFish.size,
        varietyName: item.koiFish.variety.varietyName,
        image: item.koiFish.media.imageUrl,
        videoUrl: item.koiFish.media.videoUrl,
      }));

      setRequests(requestData);
      setFilteredRequests(requestData);
    } catch (error) {
      toast.error("Failed to fetch breeder requests");
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format auction type names for display
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

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setViewingDetails(true);
    setRequests([]); // Clear requests while viewing details
  };

  const handleBackToRequests = () => {
    setAddingRequest(false);
    setViewingDetails(false);
    fetchRequests();
  };

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
    setFilteredRequests(filtered);
  };

  const resetSearch = () => {
    setSearch("");
    setDateRange(null);
    setFilteredRequests(requests);
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
    switch (status.toUpperCase()) {
      case "PENDING":
        return "blue";
      case "INSPECTION_IN_PROGRESS":
        return "orange";
      case "INSPECTION_PASSED":
        return "green";
      case "INSPECTION_FAILED":
        return "red";
      case "PENDING_MANAGER_OFFER":
        return "gold";
      case "PENDING_BREEDER_OFFER":
        return "lime";
      case "APPROVE":
        return "cyan";
      case "REJECT":
        return "magenta";
      case "CANCELLED":
        return "volcano";
      default:
        return "default";
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

            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
            >
              Search
            </Button>

            <Button onClick={resetSearch} icon={<ReloadOutlined />}>
              Reset
            </Button>
          </Space>

          {addingRequest ? (
            <AddBreederRequest onBack={handleBackToRequests} />
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
                onBack={handleBackToRequests}
              />
            </div>
          ) : (
            <Table
              dataSource={filteredRequests}
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
