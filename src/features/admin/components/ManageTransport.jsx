import React, { useEffect, useState } from "react";
import { Button, Table, Spin, Tag, Input, Select, DatePicker } from "antd";
import { toast } from "react-toastify";
import { FaFish, FaIdCard, FaFlag, FaClock } from "react-icons/fa";
import api from "../../../config/axios";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ManageTransport = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState("invoiceId"); // Default search field
  const [dateRange, setDateRange] = useState([null, null]); // Date range for filtering

  // Fetch invoices from the new API endpoint
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
      toast.error("Failed to fetch transport invoices");
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
  ];

  // Format the status
  const formatStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "PAID":
        return "Paid";
      case "OVERDUE":
        return "Overdue";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  // Determine the color for the status tag
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "blue";
      case "PAID":
        return "green";
      case "OVERDUE":
        return "red";
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
    <div className="mt-20">
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <h1 className="text-left font-bold text-2xl my-5">
            Transport Invoice Manager
          </h1>
          <div className="flex items-center mb-4">
            <Select
              defaultValue="invoiceId"
              style={{ width: 150, marginRight: 10 }}
              onChange={(value) => setSearchField(value)}
            >
              <Option value="invoiceId">Invoice ID</Option>
              <Option value="fishId">Fish ID</Option>
              <Option value="breederName">Breeder Name</Option>
              <Option value="status">Status</Option>
              <Option value="invoiceDate">Invoice Date</Option>
            </Select>

            {searchField === "invoiceDate" ? (
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
            dataSource={filteredInvoices}
            rowKey="invoiceId"
          />
        </>
      )}
    </div>
  );
};

export default ManageTransport;
