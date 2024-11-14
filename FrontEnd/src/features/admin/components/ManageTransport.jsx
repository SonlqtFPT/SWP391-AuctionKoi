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
import { FaFish, FaIdCard, FaFlag, FaClock, FaUserPlus } from "react-icons/fa";
import api from "../../../config/axios";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ManageTransport = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [staffList, setStaffList] = useState([]); // Staff list for assigning
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState("invoiceId"); // Default search field
  const [dateRange, setDateRange] = useState([null, null]); // Date range for filtering
  const [selectedInvoice, setSelectedInvoice] = useState(null); // For modal
  const [assigningStaff, setAssigningStaff] = useState(false); // For modal loading
  const [selectedStaffId, setSelectedStaffId] = useState(null); // State for selected staff ID

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/invoice/get-invoices", {
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
        accountId: item.member.account.accountId, // Add this line
      }));
      setInvoices(formattedInvoices);
      setFilteredInvoices(formattedInvoices); // Set filtered invoices initially
    } catch (error) {
      toast.error("Failed to fetch transport invoices");
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff members for assigning
  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/manager/request/assign-staff/getStaff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data);
      setStaffList(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch staff list");
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchStaff(); // Fetch staff for assigning
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

  // Assign staff to an invoice
  const handleAssignStaff = async (invoiceId, accountId) => {
    setAssigningStaff(true);
    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        `/invoice/manager/assign-staff/${invoiceId}/${accountId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Staff assigned successfully");
      setSelectedInvoice(null); // Close modal after assigning
      fetchInvoices(); // Refresh invoice list
    } catch (error) {
      toast.error("Failed to assign staff");
    } finally {
      setAssigningStaff(false);
    }
  };

  // Open modal to assign staff
  const openAssignStaffModal = (invoice) => {
    setSelectedInvoice(invoice);
  };

  // Close the modal
  const closeAssignStaffModal = () => {
    setSelectedInvoice(null);
  };

  // Table columns
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
          <FaUserPlus className="mr-2" /> Member ID
        </span>
      ),
      dataIndex: "accountId",
      key: "accountId",
      sorter: (a, b) => a.accountId - b.accountId,
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
      title: (
        <span className="flex items-center">
          <FaUserPlus className="mr-2" /> Action
        </span>
      ),
      key: "action",
      render: (text, record) =>
        record.status === "PAID" ? (
          <Button type="link" onClick={() => openAssignStaffModal(record)}>
            Assign Staff
          </Button>
        ) : null, // Hide the button if status is not "PAID"
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
      case "DELIVERY_IN_PROGRESS":
        return "Delivering";
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

      {/* Assign Staff Modal */}
      {selectedInvoice && (
        <Modal
          title="Assign Staff"
          visible={!!selectedInvoice}
          onCancel={closeAssignStaffModal}
          onOk={() =>
            handleAssignStaff(selectedInvoice.invoiceId, selectedStaffId)
          } // Define selectedStaffId when selected
          confirmLoading={assigningStaff}
        >
          <Select
            placeholder="Select Staff"
            style={{ width: "100%" }}
            onChange={(value) => setSelectedStaffId(value)}
          >
            {staffList.map((staff) => (
              <Option key={staff.accountId} value={staff.accountId}>
                ID: {staff.accountId} - {staff.firstName} {staff.lastName}
              </Option>
            ))}
          </Select>
        </Modal>
      )}
    </>
  );
};

export default ManageTransport;
