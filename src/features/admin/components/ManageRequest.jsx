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
} from "react-icons/fa";
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
  const [searchField, setSearchField] = useState("requestId");
  const [dateRange, setDateRange] = useState([null, null]);

  // Fetch auction requests
  const fetchRequest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("manager/request/getRequest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const auctionData = response.data.data;
      const formattedRequests = auctionData.map((item) => ({
        requestId: item.requestId,
        status: item.status,
        fishId: item.koiFish.fishId,
        videoUrl: item.koiFish.media.videoUrl,
        image: item.koiFish.media.imageUrl,
        breederId: item.breeder.breederId,
        breederName: item.breeder.breederName,
        breederLocation: item.breeder.location,
        gender: item.koiFish.gender,
        age: item.koiFish.age,
        size: item.koiFish.size,
        price: item.koiFish.price,
        auctionTypeName: formatStatus(item.koiFish.auctionTypeName), // Ensure formatStatus is applied
        varietyName: item.koiFish.variety.varietyName,
        requestedAt: item.requestedAt,
        auctionFinalPrice: item.auctionFinalPrice,
      }));

      formattedRequests.sort(
        (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
      );

      setAuctionRequests(formattedRequests);
      setFilteredRequests(formattedRequests);
    } catch (error) {
      toast.error("Failed to fetch auction request data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/manager/request/assign-staff/getStaff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStaffList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch staff list");
    }
  };

  useEffect(() => {
    fetchRequest();
    fetchStaff();
  }, []);

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowList(false);
  };

  const handleGoBack = () => {
    setShowList(true);
    setSelectedRequest(null);
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();

    const filtered = auctionRequests.filter((request) => {
      switch (searchField) {
        case "requestId":
          return request.requestId.toString().includes(searchValue);
        case "fishId":
          return request.fishId.toString().includes(searchValue);
        case "breederId":
          return request.breederId.toString().includes(searchValue);
        case "breederName":
          return request.breederName.toLowerCase().includes(searchValue);
        case "status":
          return request.status.toLowerCase().includes(searchValue);
        case "auctionTypeName":
          return request.auctionTypeName.toLowerCase().includes(searchValue);
        case "varietyName":
          return request.varietyName.toLowerCase().includes(searchValue);
        default:
          return false;
      }
    });
    setFilteredRequests(filtered);
  };

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
      setFilteredRequests(auctionRequests);
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
          <FaFlag className="mr-2" /> Auction Type
        </span>
      ),
      dataIndex: "auctionTypeName",
      key: "auctionTypeName",
      sorter: (a, b) => a.auctionTypeName.localeCompare(b.auctionTypeName),
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
        <>
          {showList ? (
            <>
              <h1 className="text-left font-bold text-2xl my-5">
                Auction Request Manager
              </h1>
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
                  <Option value="auctionTypeName">Auction Type</Option>
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
