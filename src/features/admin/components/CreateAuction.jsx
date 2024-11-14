import React, { useState, useEffect } from "react";
import { Steps, Button, message, Form, DatePicker, Select, Table } from "antd";
import dayjs from "dayjs";
import api from "../../../config/axios";

const { Step } = Steps;
const token = localStorage.getItem("accessToken");

function formatPrice(price) {
  // Check if price is null or undefined
  if (price === null || price === undefined) {
    return;
  }

  // Format the price as a string with commas and add the currency symbol
  return price
    .toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0, // Ensures no decimal places are shown
    })
    .replace(/\sđ/, "đ"); // Remove the space before the currency symbol
}

const formatStatus = (status) => {
  switch (status) {
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

const CreateAuction = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [auction, setAuction] = useState({
    startTime: null,
    endTime: null,
    lots: [],
  });
  const [lots, setLots] = useState([]);

  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        // Update auction object with the latest start and end times every time
        setAuction((prevAuction) => ({
          ...prevAuction,
          startTime: values.startTime
            ? dayjs(values.startTime).format("YYYY-MM-DDTHH:mm:ss")
            : prevAuction.startTime,
          endTime: values.endTime
            ? dayjs(values.endTime).format("YYYY-MM-DDTHH:mm:ss")
            : prevAuction.endTime,
        }));

        // Move to the next step
        setCurrent(current + 1);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = async () => {
    if (lots.length === 0) {
      message.error("Please add at least one lot before submitting!");
      return;
    }

    const auctionData = {
      startTime: auction.startTime,
      endTime: auction.endTime,
      lots: lots.map((lot) => ({ fishId: lot.fishId })),
    };

    console.log("Auction Data to Submit:", auctionData);
    const token = localStorage.getItem("accessToken");
    console.log(token);
    try {
      const response = await api.post("/manager/createAuction", auctionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      // Check if response has a custom status code
      if (response.data && response.data.status === 200) {
        console.log("API Response:", response.data); // Log the API response
        message.success("Auction created successfully!");
        form.resetFields();
        setCurrent(0);
        setLots([]);
      } else {
        // Handle custom status codes here
        if (response.data && response.data.message) {
          message.error(response.data.message);
        } else {
          message.error("Unexpected response from server");
        }
      }
    } catch (error) {
      console.error("Failed to create auction", error);

      // Handle overlapping auction times or other errors
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Failed to create auction");
      }
    }
  };

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
              defaultValue={dayjs()}
              className="w-full border border-gold rounded-md"
            />
          </Form.Item>
          <Form.Item
            label="End Time"
            name="endTime"
            rules={[
              { required: true, message: "Please select end time!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startTime = getFieldValue("startTime");
                  if (!value || !startTime || dayjs(value).isAfter(startTime)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("End time must be later than start time!")
                  );
                },
              }),
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              className="w-full border border-gold rounded-md"
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Add Lots",
      content: (
        <AddLots
          setLots={setLots}
          startTime={auction.startTime}
          endTime={auction.endTime}
          lots={lots}
        />
      ),
    },
    {
      title: "Confirm",
      content: (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <p className="text-lg font-bold mb-4">
            Please review all the information before finalizing the auction.
          </p>
          <h2 className="font-semibold">Auction Details:</h2>
          <p>
            Start Time: {dayjs(auction.startTime).format("YYYY-MM-DD HH:mm:ss")}
          </p>
          <p>
            End Time: {dayjs(auction.endTime).format("YYYY-MM-DD HH:mm:ss")}
          </p>
          <h2 className="font-semibold mt-4">Lots:</h2>
          <ul className="list-disc pl-5">
            {lots.map((lot, index) => (
              <li key={index} className="mb-2">
                Fish ID: {lot.fishId}, Starting Price:{" "}
                {formatPrice(lot.startingPrice)}, Auction Type :{" "}
                {formatStatus(lot.auctionTypeName)}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white  flex flex-col items-center pt-28">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full border-2">
        <Steps current={current} className="mb-8" direction="horizontal">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
          {steps[current].content}
        </div>
        <div className="flex justify-between">
          <Button
            type="primary"
            onClick={prev}
            disabled={current === 0}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Previous
          </Button>
          {current < steps.length - 1 && (
            <Button
              type="primary"
              onClick={handleNext}
              className="bg-gold hover:bg-yellow-600 text-black"
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={onFinish}
              className="bg-gold hover:bg-yellow-600 text-black"
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// AddLots Component for Step 2
const AddLots = ({ setLots, lots }) => {
  const [fishData, setFishData] = useState([]);

  useEffect(() => {
    const fetchFishData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await api.get("/manager/getFish", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        console.log(response.data.data);
        setFishData(response.data.data || []);
      } catch (err) {
        console.error("Error fetching fish data", err);
      }
    };

    fetchFishData();
  }, []);

  const handleAddRemoveLot = (fish) => {
    const existingIndex = lots.findIndex((lot) => lot.fishId === fish.fishId);
    if (existingIndex === -1) {
      const newLot = {
        fishId: fish.fishId,
        startingPrice: fish.price,
        auctionTypeName: fish.auctionTypeName,
      };
      setLots((prev) => [...prev, newLot]);
      message.success("Lot added successfully!");
    } else {
      setLots((prev) => prev.filter((lot) => lot.fishId !== fish.fishId));
      message.success("Lot removed successfully!");
    }
  };

  return (
    <>
      {fishData.length === 0 ? (
        <p className="text-red-500">No fishes available for auction</p>
      ) : (
        <Table
          dataSource={fishData}
          rowKey="fishId"
          pagination={false}
          columns={[
            {
              title: "FishID",
              dataIndex: "fishId",
              key: "fishId",
              render: (fishId) => <span>{fishId}</span>,
            },
            {
              title: "Variety",
              dataIndex: "variety",
              key: "variety",
              render: (variety) => <span>{variety.varietyName}</span>,
            },
            {
              title: "Starting Price",
              dataIndex: "price",
              key: "price",
              render: (price) => <span>{formatPrice(price)}</span>,
            },
            {
              title: "Auction Type",
              dataIndex: "auctionTypeName",
              key: "auctionTypeName",
              render: (auctionTypeName) => (
                <span>{formatStatus(auctionTypeName)}</span>
              ),
            },
            {
              title: "Action",
              key: "action",
              render: (text, record) => (
                <Button
                  type="primary"
                  onClick={() => handleAddRemoveLot(record)}
                  className={`${
                    lots.some((lot) => lot.fishId === record.fishId)
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gold hover:bg-yellow-600"
                  } text-white`}
                >
                  {lots.some((lot) => lot.fishId === record.fishId)
                    ? "Remove Lot"
                    : "Add Lot"}
                </Button>
              ),
            },
          ]}
        />
      )}
    </>
  );
};

export default CreateAuction;
