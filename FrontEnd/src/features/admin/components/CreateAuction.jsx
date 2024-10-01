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

const AddLots = ({ setLots }) => {
  const [fishData, setFishData] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null); // Selected fish for viewing details
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [lotDetails, setLotDetails] = useState({}); // State to store details for each fish/lot
  const [currentFishId, setCurrentFishId] = useState(null); // Store current fish ID for adding lot

  // Fetch fish data from API (approved requests)
  useEffect(() => {
    axios
      .get("http://localhost:8080/manager/auction")
      .then((response) => {
        setFishData(response.data.data); // Set the approved fish
      })
      .catch((err) => {
        console.error("Error fetching fish data", err);
      });
  }, []);

  // Open detail modal
  const handleViewDetail = (fish) => {
    setSelectedFish(fish);
    setIsDetailModalVisible(true);
  };

  // Close detail modal
  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedFish(null);
  };

  // Handle change in lot input fields
  const handleInputChange = (field, value) => {
    setLotDetails((prev) => ({
      ...prev,
      [currentFishId]: {
        ...prev[currentFishId],
        [field]: value,
      },
    }));
  };

  // Open modal to add lot
  const openAddLotModal = (fishId) => {
    setCurrentFishId(fishId);
    setIsDetailModalVisible(true);
  };

  // Add lot to the list
  const handleAddLot = () => {
    const currentLot = lotDetails[currentFishId];
    if (
      currentLot &&
      currentLot.deposit &&
      currentLot.startingPrice &&
      currentLot.increment &&
      currentLot.startingTime &&
      currentLot.endingTime
    ) {
      setLots((prev) => [
        ...prev,
        {
          fishId: currentFishId,
          ...currentLot,
        },
      ]);
      // Clear lot details for the added fish
      setLotDetails((prev) => ({ ...prev, [currentFishId]: {} }));
      message.success("Lot added successfully!");
      handleCloseDetailModal(); // Close modal after adding lot
    } else {
      message.error("Please fill in all details before adding the lot.");
    }
  };

  // Table columns for fish data
  const columns = [
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
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Action",
      key: "action",
      render: (text, fish) => (
        <Button onClick={() => handleViewDetail(fish)} type="link">
          View Detail
        </Button>
      ),
    },
    {
      title: "Add Lot",
      key: "addLot",
      render: (text, fish) => (
        <Button onClick={() => openAddLotModal(fish.fishId)}>Add Lot</Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={fishData}
        rowKey="fishId"
        pagination={false}
        style={{ marginBottom: 20 }}
      />

      {selectedFish && (
        <Modal
          title={`${selectedFish.variety.varietyName} Details`}
          visible={isDetailModalVisible}
          onCancel={handleCloseDetailModal}
          footer={null}
        >
          <p>
            <strong>Fish ID:</strong> {selectedFish.fishId}
          </p>
          <p>
            <strong>Gender:</strong> {selectedFish.gender}
          </p>
          <p>
            <strong>Age:</strong> {selectedFish.age} years old
          </p>
          <Image width={200} src={selectedFish.media.imageUrl} alt="Fish" />
        </Modal>
      )}

      {/* Modal for adding lot details */}
      <Modal
        title={`Add Lot for Fish ID: ${currentFishId}`}
        visible={isDetailModalVisible && currentFishId !== null}
        onCancel={handleCloseDetailModal}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Deposit">
            <InputNumber
              value={lotDetails[currentFishId]?.deposit}
              onChange={(value) => handleInputChange("deposit", value)}
            />
          </Form.Item>
          <Form.Item label="Starting Price">
            <InputNumber
              value={lotDetails[currentFishId]?.startingPrice}
              onChange={(value) => handleInputChange("startingPrice", value)}
            />
          </Form.Item>
          <Form.Item label="Increment">
            <InputNumber
              value={lotDetails[currentFishId]?.increment}
              onChange={(value) => handleInputChange("increment", value)}
            />
          </Form.Item>
          <Form.Item label="Starting Time">
            <DatePicker
              showTime
              value={
                lotDetails[currentFishId]?.startingTime
                  ? dayjs(lotDetails[currentFishId].startingTime)
                  : null
              }
              onChange={(value) => handleInputChange("startingTime", value)}
            />
          </Form.Item>
          <Form.Item label="Ending Time">
            <DatePicker
              showTime
              value={
                lotDetails[currentFishId]?.endingTime
                  ? dayjs(lotDetails[currentFishId].endingTime)
                  : null
              }
              onChange={(value) => handleInputChange("endingTime", value)}
            />
          </Form.Item>
          <Button type="primary" onClick={handleAddLot}>
            Add Lot
          </Button>
        </Form>
      </Modal>
    </>
  );
};

const CreateAuction = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [lots, setLots] = useState([]); // State to store the lots

  // Define the onFinish function for form submission
  const onFinish = async (values) => {
    const auctionData = {
      auctionTypeName: values.auctionType,
      startTime: values.startTime ? values.startTime.toISOString() : null,
      endTime: values.endTime ? values.endTime.toISOString() : null,
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

  // Function to handle moving to the next step
  const handleNext = () => {
    form
      .validateFields() // Validate form fields
      .then(() => {
        setCurrent(current + 1); // Move to the next step if validation is successful
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
        // Validation failed, error messages will be shown automatically
      });
  };

  const prev = () => {
    setCurrent(current - 1);
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
              } // Prevent selection of past dates
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
              disabledDate={
                (current) => current && current < dayjs().startOf("day") // Prevent selection of past dates
              }
            />
          </Form.Item>
          <Form.Item
            label="Auction Type"
            name="auctionType"
            rules={[{ required: true, message: "Please select auction type!" }]}
          >
            <Select placeholder="Select Auction Type">
              <Select.Option value="Type 1">
                Type 1 - Fixed Price Sale
              </Select.Option>
              <Select.Option value="Type 2">
                Type 2 - Sealed Auction
              </Select.Option>
              <Select.Option value="Type 3">
                Type 3 - Ascending Bid Auction
              </Select.Option>
              <Select.Option value="Type 4">
                Type 4 - Descending Price Auction
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Add Lots",
      content: <AddLots setLots={setLots} />, // Pass the setLots function to AddLots
    },
    {
      title: "Confirm",
      content: (
        <div>
          <p>
            Please review all the information before finalizing the auction.
          </p>
          <p>Use the form to double-check your auction details.</p>
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
            <Button
              type="primary"
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    onFinish(values); // Call onFinish with form values
                  })
                  .catch((errorInfo) => {
                    console.error("Validation failed:", errorInfo);
                  });
              }}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;
