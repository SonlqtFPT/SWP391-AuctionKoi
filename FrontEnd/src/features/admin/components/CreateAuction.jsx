import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Steps,
  Button,
  message,
  Form,
  DatePicker,
  Select,
  InputNumber,
  Table,
  Modal,
  Image,
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
    // Ensure the auction state is up-to-date
    const auctionData = {
      auctionTypeName: auction.auctionTypeName,
      startTime: auction.startTime,
      endTime: auction.endTime,
      lots: lots.map((lot) => ({
        fishId: lot.fishId,
        deposit: lot.deposit,
        startingPrice: lot.startingPrice,
        increment: lot.increment,
        startingTime: lot.startingTime.toISOString(),
        endingTime: lot.endingTime.toISOString(),
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
        <AddLots setLots={setLots} auctionTypeName={auction.auctionTypeName} />
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
                {lot.fishId}: Deposit {lot.deposit}, Starting Price{" "}
                {lot.startingPrice}, Increment {lot.increment}, Starting Time{" "}
                {dayjs(lot.startingTime).format("YYYY-MM-DD HH:mm:ss")}, Ending
                Time {dayjs(lot.endingTime).format("YYYY-MM-DD HH:mm:ss")}
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
const AddLots = ({ setLots, auctionTypeName }) => {
  const [fishData, setFishData] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [lotDetails, setLotDetails] = useState({}); // Store lot details for each fish

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
        console.log(fishData);
      } catch (err) {
        console.error("Error fetching fish data", err);
      }
    };

    if (auctionTypeName) {
      fetchFishData(); // Call the function to fetch data only if auctionTypeName is available
    }
  }, [auctionTypeName]);

  const handleAddLot = (fishId) => {
    const currentLot = lotDetails[fishId];
    if (currentLot) {
      setLots((prev) => [...prev, { fishId, ...currentLot }]);
      message.success("Lot added successfully!");
    } else {
      message.error("Please fill in all details before adding the lot.");
    }
  };

  return (
    <>
      <Table
        dataSource={fishData}
        rowKey="fishId"
        columns={[
          {
            title: "Variety",
            dataIndex: "variety",
            key: "variety",
            render: (variety) => variety.varietyName,
          },
          {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
          },
          {
            title: "Action",
            key: "action",
            render: (_, fish) => (
              <Button type="link" onClick={() => setSelectedFish(fish)}>
                View Detail
              </Button>
            ),
          },
          {
            title: "Add Lot",
            key: "addLot",
            render: (_, fish) => (
              <Button onClick={() => handleAddLot(fish.fishId)}>Add Lot</Button>
            ),
          },
        ]}
      />
      <Modal
        title={selectedFish?.variety?.varietyName || "Fish Details"}
        visible={!!selectedFish}
        onCancel={() => setSelectedFish(null)}
      >
        {selectedFish && (
          <>
            <p>Gender: {selectedFish.gender}</p>
            <Image src={selectedFish.media.imageUrl} alt="Fish" width={200} />
          </>
        )}
      </Modal>
    </>
  );
};

export default CreateAuction;
