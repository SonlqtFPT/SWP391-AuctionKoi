import React, { useEffect, useState } from "react";
import { Button, Table, Spin, Tag } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const ViewTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get("/transaction/get-all-transaction", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const transactionData = response.data.data;

      // Sort by date descending to show newest transactions first
      const sortedTransactions = transactionData.sort(
        (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
      );

      setTransactions(sortedTransactions);
    } catch (error) {
      toast.error("Failed to fetch transaction data");
    } finally {
      setLoading(false);
    }
  };

  function formatPrice(price) {
    if (price === null || price === undefined) {
      return "N/A";
    }

    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  const formatStatus = (status) => {
    switch (status) {
      case "REFUND":
        return "Refund";
      case "PAYMENT_FOR_BREEDER":
        return "Payment For Breeder";
      case "DEPOSIT":
        return "Deposit";
      case "INVOICE_PAYMENT":
        return "Invoice Payment";
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Columns configuration
  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      sorter: (a, b) => a.transactionId - b.transactionId,
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.transactionDate) - new Date(b.transactionDate),
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => formatStatus(type),
      sorter: (a, b) => a.transactionType.localeCompare(b.transactionType),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatPrice(amount),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "SUCCESS" ? "green" : "volcano"}>{status}</Tag>
      ),
      sorter: (a, b) => a.paymentStatus.localeCompare(b.paymentStatus),
    },
    {
      title: "User",
      key: "user",
      render: (_, record) => {
        if (record.koiBreeder) {
          return `Breeder: ${record.koiBreeder.breederId} - ${record.koiBreeder.breederName}`;
        } else if (record.member && record.member.account) {
          const { accountId, firstName, lastName } = record.member.account;
          return `User: ${accountId} - ${firstName} ${lastName}`;
        } else {
          return "N/A";
        }
      },
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <h1 className="text-left font-bold text-2xl my-5">
            Transaction Manager
          </h1>
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="transactionId"
          />
        </>
      )}
    </div>
  );
};

export default ViewTransaction;
