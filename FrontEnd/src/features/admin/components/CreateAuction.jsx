import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Steps,
  Button,
  message,
  Form,
  DatePicker,
  Select,
  Table,
  InputNumber,
} from "antd";
import dayjs from "dayjs"; // Use dayjs for date management

const { Step } = Steps;

const CreateAuction = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [auction, setAuction] = useState({
    auctionTypeName: null,
    startTime: null,
    endTime: null,
    lots: [],
  });
  const [lots, setLots] = useState([]); // State to store the lots

  // Function to handle moving to the next step
  const handleNext = () => {
    form
      .validateFields() // Validate form fields
      .then((values) => {
        if (current === 0) {
          // Step 1: Update auctionTypeName, startTime, and endTime
          setAuction((prevAuction) => ({
            ...prevAuction,
            auctionTypeName: values.auctionType,
            startTime: values.startTime ? values.startTime.toISOString() : null,
            endTime: values.endTime ? values.endTime.toISOString() : null,
          }));
        }
        // Proceed to the next step
        setCurrent(current + 1);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  // Function to handle previous step
  const prev = () => {
    setCurrent(current - 1);
  };

  // Final form submission
  const onFinish = async () => {
    const auctionData = {
      auctionTypeName: auction.auctionTypeName,
      startTime: auction.startTime,
      endTime: auction.endTime,
      lots: lots.map((lot) => ({
        fishId: lot.fishId,
        startingPrice: lot.startingPrice,
        increment: lot.increment,
      })),
    };

    try {
      console.log("Auction Data:", auctionData); // For debugging
      const response = await axios.post(
        "http://localhost:8080/manager/createAuction",
        auctionData
      );

      message.success("Auction created successfully!");
      form.resetFields();
      setCurrent(0);
      setLots([]); // Clear lots after submission
    } catch (error) {
      console.error("Failed to create auction", error);
      message.error("Failed to create auction");
    }
  };

  // Step definitions
  const steps = [
    {
      title: "Create Auction",
      content: (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[{ required: true, message: "Please select start time!" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              defaultValue={dayjs()} // Set to current time
            />
          </Form.Item>
          <Form.Item
            label="End Time"
            name="endTime"
            rules={[{ required: true, message: "Please select end time!" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>
          <Form.Item
            label="Auction Type"
            name="auctionType"
            rules={[{ required: true, message: "Please select auction type!" }]}
          >
            <Select placeholder="Select Auction Type">
              <Select.Option value="FIXED_PRICE_SALE">
                Type 1 - Fixed Price Sale
              </Select.Option>
              <Select.Option value="SEALED_BID">
                Type 2 - Sealed Auction
              </Select.Option>
              <Select.Option value="ASCENDING_BID">
                Type 3 - Ascending Bid Auction
              </Select.Option>
              <Select.Option value="DESCENDING_BID">
                Type 4 - Descending Price Auction
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Add Lots",
      content: (
        <AddLots
          setLots={setLots}
          auctionTypeName={auction.auctionTypeName}
          lots={lots}
        />
      ),
    },
    {
      title: "Confirm",
      content: (
        <div>
          <p>
            Please review all the information before finalizing the auction.
          </p>
          <ul>
            {lots.map((lot, index) => (
              <li key={index}>
                Fish ID: {lot.fishId}, Starting Price: {lot.startingPrice},
                Increment: {lot.increment}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{ marginTop: 20 }}>
        <div>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          <Button type="primary" disabled={current === 0} onClick={prev}>
            Previous
          </Button>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={onFinish}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// AddLots Component for Step 2
const AddLots = ({ setLots, auctionTypeName, lots }) => {
  const [fishData, setFishData] = useState([]);

  // Fetch fish data from API based on auctionTypeName
  useEffect(() => {
    const fetchFishData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/manager/get-fish-auction",
          {
            auctionTypeName: auctionTypeName, // Pass auction type from Step 1
          }
        );
        setFishData(response.data.data); // Assuming response structure matches your specification
      } catch (err) {
        console.error("Error fetching fish data", err);
      }
    };

    if (auctionTypeName) {
      fetchFishData(); // Call the function to fetch data only if auctionTypeName is available
    }
  }, [auctionTypeName]);

  const handleAddRemoveLot = (fish) => {
    const existingIndex = lots.findIndex((lot) => lot.fishId === fish.fishId);
    if (existingIndex === -1) {
      // Add lot if it doesn't exist
      const newLot = {
        fishId: fish.fishId,
        startingPrice: fish.price, // Use the price from the fetched data
        increment: 0, // Initialize increment to 0
      };
      setLots((prev) => [...prev, newLot]);
      message.success("Lot added successfully!");
    } else {
      // Remove lot if it exists
      setLots((prev) => prev.filter((lot) => lot.fishId !== fish.fishId));
      message.success("Lot removed successfully!");
    }
  };

  const handleIncrementChange = (fishId, value) => {
    setLots((prev) =>
      prev.map((lot) =>
        lot.fishId === fishId ? { ...lot, increment: value } : lot
      )
    );
  };

  const handleIncrement = (fishId, operation) => {
    setLots((prev) =>
      prev.map((lot) => {
        if (lot.fishId === fishId) {
          const newIncrement =
            operation === "increase" ? lot.increment + 1 : lot.increment - 1;
          return { ...lot, increment: Math.max(0, newIncrement) }; // Prevent negative increment
        }
        return lot;
      })
    );
  };

  return (
    <>
      <Table
        dataSource={fishData}
        rowKey="fishId"
        columns={[
          {
            title: "Fish ID",
            dataIndex: "fishId",
            key: "fishId",
          },
          {
            title: "Variety",
            dataIndex: "variety",
            key: "variety",
            render: (variety) => <span>{variety.varietyName}</span>, // Correctly rendering the variety name
          },
          {
            title: "Starting Price",
            dataIndex: "price", // Change to "price" from the API response
            key: "price",
            render: (price) => <span>{price}</span>, // Display starting price as read-only
          },
          {
            title: "Increment",
            key: "increment",
            render: (text, record) => {
              const existingLot = lots.find(
                (lot) => lot.fishId === record.fishId
              );
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    onClick={() => handleIncrement(record.fishId, "decrease")}
                    disabled={!existingLot || existingLot.increment <= 0}
                  >
                    -
                  </Button>
                  <InputNumber
                    min={0}
                    value={existingLot ? existingLot.increment : 0} // Show the current increment value
                    onChange={(value) =>
                      handleIncrementChange(record.fishId, value)
                    } // Update the increment
                    style={{ margin: "0 8px" }}
                  />
                  <Button
                    onClick={() => handleIncrement(record.fishId, "increase")}
                  >
                    +
                  </Button>
                </div>
              );
            },
          },
          {
            title: "Action",
            key: "action",
            render: (text, record) => (
              <Button type="primary" onClick={() => handleAddRemoveLot(record)}>
                {lots.some((lot) => lot.fishId === record.fishId)
                  ? "Remove Lot"
                  : "Add Lot"}
              </Button>
            ),
          },
        ]}
      />
    </>
  );
};

export default CreateAuction;
