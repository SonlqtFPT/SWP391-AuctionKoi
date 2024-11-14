import React, { useEffect, useState } from "react";
import { Button, Table, Spin, Tag } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import ManageAuction from "./ManageAuction";

const ManageRefund = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch refund notifications
  const fetchRefundNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/manager/manager/refund-notificate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const refundData = response.data.data;
      setRefunds(refundData);
    } catch (error) {
      toast.error("Failed to fetch refund notifications");
    } finally {
      setLoading(false);
    }
  };

  // Handle refund action
  const handleRefund = async (lrid) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.get(`/manager/manager/refund?lotRegisterId=${lrid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Refund processed successfully");
      fetchRefundNotifications(); // Refresh the data after refund
    } catch (error) {
      toast.error("Failed to process refund");
    }
  };

  useEffect(() => {
    fetchRefundNotifications();
  }, []);

  // Columns configuration for the refund table
  const columns = [
    {
      title: "Member ID",
      dataIndex: ["member", "account", "accountId"],
      key: "memberId",
    },
    {
      title: "Name",
      dataIndex: ["member", "account"],
      key: "memberName",
      render: (account) => `${account.firstName} ${account.lastName}`,
    },
    {
      title: "Email",
      dataIndex: ["member", "account", "email"],
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: ["member", "account", "phoneNumber"],
      key: "phoneNumber",
    },
    {
      title: "Lot ID",
      dataIndex: ["lot", "lotId"],
      key: "lotId",
    },
    {
      title: "Deposit",
      dataIndex: ["deposit"],
      key: "deposit",
      render: (deposit) =>
        deposit.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "LOSE" ? "volcano" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleRefund(record.lrid)}
          disabled={record.status !== "LOSE"} // Only allow refund if status is "LOSE"
        >
          Refund
        </Button>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <h1 className="text-left font-bold text-2xl my-5">
            Refund Notifications
          </h1>
          <Table columns={columns} dataSource={refunds} rowKey="lrid" />
        </>
      )}
    </div>
  );
};

export default ManageRefund;
