// CreateAuction.jsx
import React, { useState } from "react";
import { Steps, Button, message, Form, DatePicker, Select } from "antd";
import dayjs from "dayjs"; // Use dayjs for date management

const { Step } = Steps;

const CreateAuction = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  // Define the onFinish function for form submission
  const onFinish = (values) => {
    console.log("Form values:", values);
    message.success("Auction created successfully!");
    // Reset the form and steps
    form.resetFields();
    setCurrent(0);
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

  // Step definitions
  const steps = [
    {
      title: "Create Auction",
      content: (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Start Time"
            name="startTime"
            rules={[
              { required: true, message: "Please select start time!" },
              {
                validator: (_, value) => {
                  const now = dayjs(); // Current time

                  if (!value || value.isBefore(now)) {
                    return Promise.reject(
                      new Error("Start time cannot be in the past!")
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={
                (current) => current && current < dayjs().startOf("day") // Prevent selection of past dates
              }
              defaultValue={dayjs()} // Set to current time
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
                  const now = dayjs(); // Current time

                  if (value && value.isBefore(now)) {
                    return Promise.reject(
                      new Error("End time cannot be in the past!")
                    );
                  }
                  if (value && startTime && value.isBefore(startTime)) {
                    return Promise.reject(
                      new Error("End time must be after start time!")
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
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
            <Select placeholder="Select auction type">
              <Select.Option value="1">Type 1 - Fixed Price Sale</Select.Option>
              <Select.Option value="2">Type 2 - Blind Auction</Select.Option>
              <Select.Option value="3">
                Type 3 - Ascending Bid Auction
              </Select.Option>
              <Select.Option value="4">
                Type 4 - Descending Price Auction
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Add Lots",
      content: "Here you can add the lots for the auction.",
    },
    {
      title: "Confirm",
      content: (
        <div>
          <p>
            Please review all the information before finalizing the auction.
          </p>
          <p>Use the form to double-check your auction details.</p>
        </div>
      ),
    },
  ];

  const prev = () => {
    setCurrent(current - 1);
  };

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
            <Button
              type="primary"
              onClick={handleNext} // Use handleNext to validate and move to the next step
              style={{ marginLeft: 8 }}
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => form.submit()} // Submit form on final step
              style={{ marginLeft: 8 }}
            >
              Finish
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;
