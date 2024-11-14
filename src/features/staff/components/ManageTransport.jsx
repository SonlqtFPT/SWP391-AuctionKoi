import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Spin,
  Tag,
  Input,
  Select,
  DatePicker,
  Modal,
} from "antd";
import { toast } from "react-toastify";
import { FaFish, FaIdCard, FaFlag, FaClock } from "react-icons/fa";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ManageTransport = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState("invoiceId"); // Default search field
  const [dateRange, setDateRange] = useState([null, null]); // Date range for filtering
  const navigate = useNavigate();

  const handleRequestDetailPage = (transportId) => {
    navigate(`/staff/transportdetail/${transportId}`);
  };

  // Fetch delivering invoices from the new API endpoint
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/invoice/staff/list-invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const invoiceData = response.data.data;

      const formattedInvoices = invoiceData.map((item) => ({
        invoiceId: item.invoiceId,
        finalAmount: item.finalAmount,
        invoiceDate: item.invoiceDate,
        dueDate: item.dueDate,
        status: item.status,
        fishId: item.koiFish.fishId,
        breederName: item.koiFish.breederName,
        gender: item.koiFish.gender,
        age: item.koiFish.age,
        size: item.koiFish.size,
        varietyName: item.koiFish.varietyName,
      }));
      setInvoices(formattedInvoices);
      setFilteredInvoices(formattedInvoices); // Set filtered invoices initially
    } catch (error) {
      toast.error("Failed to fetch delivering invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Handle search
  const handleSearch = (value) => {
    const filtered = invoices.filter((invoice) => {
      if (searchField === "invoiceDate" && dateRange[0] && dateRange[1]) {
        const invoiceDate = new Date(invoice.invoiceDate);
        return invoiceDate >= dateRange[0] && invoiceDate <= dateRange[1];
      } else {
        return invoice[searchField]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    });
    setFilteredInvoices(filtered);
  };

  // Handle date range change
  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates[0] && dates[1]) {
      const filtered = invoices.filter((invoice) => {
        const invoiceDate = new Date(invoice.invoiceDate);
        return (
          invoiceDate >= dates[0].startOf("day") &&
          invoiceDate <= dates[1].endOf("day")
        );
      });
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices); // Reset to all if no date is selected
    }
  };

  // Handle status update
  const handleStatusUpdate = async (invoiceId, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.patch(
        `/invoice/staff/update-status/${invoiceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: newStatus,
          },
        }
      );
      toast.success(`Invoice status updated to ${newStatus}`);
      fetchInvoices(); // Refresh the invoice list after the status update
    } catch (error) {
      toast.error("Failed to update invoice status");
    }
  };

  // Table columns
  const columns = [
    {
      title: (
        <span className="flex items-center">
          <FaIdCard className="mr-2" /> Invoice ID
        </span>
      ),
      dataIndex: "invoiceId",
      key: "invoiceId",
      sorter: (a, b) => a.invoiceId - b.invoiceId,
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
          ID: {record.fishId} - {record.breederName}
        </span>
      ),
      sorter: (a, b) => a.breederName.localeCompare(b.breederName),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <span className="flex items-center">
          <FaClock className="mr-2" /> Invoice Date
        </span>
      ),
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      render: (text) => formatDate(text),
      sorter: (a, b) => new Date(a.invoiceDate) - new Date(b.invoiceDate),
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
      title: "Action",
      key: "action",
      render: (text, record) => {
        return (
          <div>
            {record.status === "DELIVERY_IN_PROGRESS" && (
              <Select
                placeholder="Update Status"
                onChange={(value) =>
                  handleStatusUpdate(record.invoiceId, value)
                }
                style={{ width: 180, marginRight: 8 }}
              >
                <Option value="DELIVERED">Delivered</Option>
                <Option value="FAILED">Failed</Option>
                <Option value="CANCELLED">Cancelled</Option>
              </Select>
            )}
            <Button
              type="primary"
              style={{ backgroundColor: "red", borderColor: "red" }}
              onClick={() => handleRequestDetailPage(record.invoiceId)}
            >
              View Detail
            </Button>
          </div>
        );
      },
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
      case "DELIVERY_IN_PROGRESS":
        return "Delivering";
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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Manage Transport Invoices</h1>

      <div className="flex justify-between items-center my-4">
        <div>
          <Search
            placeholder={`Search by ${searchField}`}
            enterButton
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <Select
            defaultValue={searchField}
            onChange={(value) => setSearchField(value)}
            className="ml-2"
          >
            <Option value="invoiceId">Invoice ID</Option>
            <Option value="fishId">Fish ID</Option>
            <Option value="breederName">Breeder Name</Option>
            <Option value="invoiceDate">Invoice Date</Option>
          </Select>
        </div>
        <RangePicker onChange={handleDateChange} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredInvoices}
          rowKey="invoiceId"
        />
      )}
    </>
  );
};

export default ManageTransport;
