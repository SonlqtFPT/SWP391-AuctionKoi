import { useEffect, useState } from "react";
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
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../protectedRoutes/AuthContext";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Option } = Select;

const BreederRequest = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingDetails, setViewingDetails] = useState(false); // New state for viewing request details
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("requestId");
  const [dateRange, setDateRange] = useState(null);
  const navigate = useNavigate(); // Khởi tạo navigate

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      console.log(token);
      const storedData = localStorage.getItem("accountData");
      const accountData = JSON.parse(storedData);
      const accountId = accountData.accountId;
      const response = await api.get(`/breeder/request/${accountId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched requests data:", response.data.data);

      const requestData = response.data.data.map((item) => ({
        requestId: item.requestId,
        status: item.status,
        requestedAt: item.requestedAt,
        auctionTypeNameManager: item.auctionTypeName,
        auctionTypeNameBreeder: item.koiFish.auctionTypeName,
        fishId: item.koiFish.fishId,
        breederId: item.breeder.breederId,
        breederName: item.breeder.breederName,
        breederLocation: item.breeder.location,
        price: item.koiFish.price,
        offerPriceManager: item.offerPrice,
        age: item.koiFish.age,
        size: item.koiFish.size,
        gender: item.koiFish.gender,
        varietyName: item.koiFish.variety.varietyName,
        image: item.koiFish.media.imageUrl,
        videoUrl: item.koiFish.media.videoUrl,
        staff: item.staff,
      }));

      requestData.sort(
        (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
      );

      console.log("Processed request data:", requestData);

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
    navigate(`/breeder/viewdetail/${request.requestId}`); // Chuyển đến trang viewdetail và truyền requestId
  };

  // New function to handle going back to the request list
  const handleBackToRequests = () => {
    setViewingDetails(false); // Reset viewing details state
    fetchRequests(); // Optionally refetch requests to refresh the list
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="relative">
          {/* Conditionally render search bar only when not viewing details */}
          {!viewingDetails && (
            <Space className="mx-5 mt-5">
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
          )}

          {viewingDetails ? (
            <div>
              <RequestDetails
                request={selectedRequest}
                onBack={handleBackToRequests} // Go back to the requests list
              />
            </div>
          ) : (
            <div className="overflow-x-auto bg-amber-500 shadow-md rounded-lg my-5 mx-5 bg-cover">
              <Table
                dataSource={filteredRequests}
                columns={[
                  {
                    title: <span className="text-black">Request ID</span>,
                    dataIndex: "requestId",
                    key: "requestId",
                    sorter: (a, b) => a.requestId - b.requestId,
                    render: (text) => (
                      <span className="text-blue-500">{text}</span>
                    ),
                    className:
                      "text-gray-200 text-left px-4 py-2 font-semibold",
                  },
                  {
                    title: <span className="text-black">Fish ID</span>,
                    dataIndex: "fishId",
                    key: "fishId",
                    sorter: (a, b) => a.fishId - b.fishId,
                    render: (text) => (
                      <span className="font-bold text-orange-500">{text}</span>
                    ),
                    className:
                      "text-gray-200 text-left px-4 py-2 font-semibold",
                  },
                  {
                    title: <span className="text-black">Auction Type</span>,
                    dataIndex: "auctionTypeNameBreeder",
                    key: "auctionTypeNameBreeder",
                    render: (text) => (
                      <span className="text-yellow-500">
                        {formatAuctionType(text)}
                      </span>
                    ),
                    className:
                      "text-gray-200 text-left px-4 py-2 font-semibold",
                  },
                  {
                    title: <span className="text-black">Status</span>,
                    dataIndex: "status",
                    key: "status",
                    sorter: (a, b) =>
                      a.status.localeCompare(b.status, undefined, {
                        sensitivity: "base",
                      }),
                    render: (status) => (
                      <Tag color={getStatusColor(status)}>
                        {formatStatus(status)}
                      </Tag>
                    ),
                    className:
                      "text-gray-400 text-left px-4 py-2 font-semibold",
                  },
                  {
                    title: <span className="text-black">Created At</span>,
                    dataIndex: "requestedAt",
                    key: "requestedAt",
                    sorter: (a, b) =>
                      new Date(a.requestedAt) - new Date(b.requestedAt),
                    render: (date) => <span>{formatDate(date)}</span>, // Apply formatDate here
                    className:
                      "text-gray-400 text-left px-4 py-2 font-semibold",
                  },
                  {
                    title: "Actions",
                    key: "actions",
                    render: (record) => (
                      <Button onClick={() => handleViewDetails(record)}>
                        View Details
                      </Button>
                    ),
                  },
                ]}
                rowKey="requestId"
                pagination={{
                  pageSize: 10,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BreederRequest;
