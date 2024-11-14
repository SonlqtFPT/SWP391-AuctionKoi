import React, { useEffect, useState } from "react";
import { Table, Spin, Tag, Badge, Row, Col } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const ViewTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionCounts, setTransactionCounts] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);

  // Fetch transactions and calculate totals
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
      setFilteredTransactions(sortedTransactions);

      // Calculate count for each transaction type
      const counts = sortedTransactions.reduce((acc, transaction) => {
        const { transactionType } = transaction;
        if (!acc[transactionType]) {
          acc[transactionType] = 0;
        }
        acc[transactionType] += 1;
        return acc;
      }, {});

      setTransactionCounts(counts);
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

  // Handle tag click to filter transactions by type
  const handleFilter = (type) => {
    if (activeFilter === type) {
      setActiveFilter(null);
      setFilteredTransactions(transactions);
    } else {
      setActiveFilter(type);
      setFilteredTransactions(
        transactions.filter((t) => t.transactionType === type)
      );
    }
  };

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
          <Row justify="space-around" gutter={[16, 16]} className="mb-5">
            {[
              "REFUND",
              "PAYMENT_FOR_BREEDER",
              "DEPOSIT",
              "INVOICE_PAYMENT",
            ].map((type) => (
              <Col key={type} xs={12} sm={6} md={6} lg={6}>
                <Badge
                  count={transactionCounts[type] || 0}
                  showZero
                  offset={[10, 0]}
                >
                  <Tag
                    color={activeFilter === type ? "blue" : "default"}
                    onClick={() => handleFilter(type)}
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {formatStatus(type)}
                  </Tag>
                </Badge>
              </Col>
            ))}
          </Row>
          <Table
            columns={columns}
            dataSource={filteredTransactions}
            rowKey="transactionId"
          />
        </>
      )}
    </div>
  );
};

export default ViewTransaction;
