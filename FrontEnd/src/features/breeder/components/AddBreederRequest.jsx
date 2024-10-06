import React, { useState } from "react";
import { Form, InputNumber, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../../../config/axios"; // Assuming Axios instance is set up properly
import uploadFile from "../../../utils/file"; // Firebase file upload utility

const AddBreederRequest = ({ onBack }) => {
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handles the form submission
  const handleSubmitFish = async (values) => {
    try {
      setLoading(true);

      // Prepare request payload
      const payload = {
        accountId: 2, // Replace with actual account ID
        koiFish: {
          varietyName: values.varietyName,
          gender: values.gender,
          age: values.age,
          size: values.size,
          price: values.price,
          auctionTypeName: values.auctionTypeName,
          media: {
            imageUrl: imageList.length ? imageList[0].url : null,
            videoUrl: videoList.length ? videoList[0].url : null,
          },
        },
      };

      console.log("Submitting payload:", payload); // Log payload to check data being sent

      // Send POST request to API
      const response = await api.post("/breeder/request/addRequest", payload);

      console.log("API response:", response); // Log response to check API feedback

      // Success message
      message.success("Breeder request submitted successfully!");

      // Call onBack to return to the request list
      onBack();
    } catch (error) {
      console.error(
        "Error in submitting request:",
        error.response ? error.response.data : error
      );
      message.error("Failed to submit breeder request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async ({ fileList }) => {
    try {
      if (fileList.length) {
        const uploadFileObj =
          fileList[fileList.length - 1].originFileObj ||
          fileList[fileList.length - 1];
        const imageUrl = await uploadFile(uploadFileObj);

        setImageList((prevList) => [
          ...prevList,
          { ...fileList[fileList.length - 1], url: imageUrl },
        ]);

        // Reset the error state for the image upload
        form.setFields([
          {
            name: "imageUrl",
            errors: [], // Clear any validation errors
          },
        ]);
      } else {
        setImageList([]);
      }
    } catch (error) {
      message.error("Failed to upload image");
      console.error("Image upload error:", error);
    }
  };

  const handleVideoChange = async ({ fileList }) => {
    try {
      if (fileList.length) {
        const uploadFileObj =
          fileList[fileList.length - 1].originFileObj ||
          fileList[fileList.length - 1];
        const videoUrl = await uploadFile(uploadFileObj);

        setVideoList((prevList) => [
          ...prevList,
          { ...fileList[fileList.length - 1], url: videoUrl },
        ]);

        // Reset the error state for the video upload
        form.setFields([
          {
            name: "videoUrl",
            errors: [], // Clear any validation errors
          },
        ]);
      } else {
        setVideoList([]);
      }
    } catch (error) {
      message.error("Failed to upload video");
      console.error("Video upload error:", error);
    }
  };

  return (
    <div>
      <Button onClick={onBack}>Back to Requests List</Button>
      <h1>Add Breeder Request</h1>

      <Form onFinish={handleSubmitFish} form={form} layout="vertical">
        {/* Select Variety Name */}
        <Form.Item
          label="Variety Name"
          name="varietyName"
          rules={[{ required: true, message: "Please choose variety name" }]}
        >
          <Select>
            <Select.Option value="Kohaku">Kohaku</Select.Option>
            <Select.Option value="Sanke">Sanke</Select.Option>
            <Select.Option value="Showa">Showa</Select.Option>
          </Select>
        </Form.Item>

        {/* Age */}
        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: "Please enter age of fish" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        {/* Gender */}
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please choose gender of fish" }]}
        >
          <Select>
            <Select.Option value="MALE">Male</Select.Option>
            <Select.Option value="FEMALE">Female</Select.Option>
            <Select.Option value="UNKNOWN">Unknown</Select.Option>
          </Select>
        </Form.Item>

        {/* Size */}
        <Form.Item
          label="Size (cm)"
          name="size"
          rules={[{ required: true, message: "Please enter size of fish" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        {/* Price */}
        <Form.Item
          label="Price ($)"
          name="price"
          rules={[{ required: true, message: "Please enter price of fish" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        {/* Auction Type */}
        <Form.Item
          label="Auction Type"
          name="auctionTypeName"
          rules={[{ required: true, message: "Please select auction type" }]}
        >
          <Select>
            <Select.Option value="FIXED_PRICE_SALE">
              Fixed Price Sale
            </Select.Option>
            <Select.Option value="SEALED_BID">Sealed Bid</Select.Option>
            <Select.Option value="ASCENDING_BID">Ascending Bid</Select.Option>
            <Select.Option value="DESCENDING_BID">Descending Bid</Select.Option>
          </Select>
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          label="Image"
          name="imageUrl"
          rules={[
            {
              validator: () =>
                imageList.length
                  ? Promise.resolve()
                  : Promise.reject("Please upload at least one image"),
            },
          ]}
        >
          <Upload
            listType="picture-card"
            fileList={imageList}
            onChange={handleImageChange}
            accept="image/*"
            beforeUpload={() => false} // Disable Ant Design's default upload behavior
          >
            {imageList.length < 1 && (
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            )}
          </Upload>
        </Form.Item>

        {/* Video Upload */}
        <Form.Item
          label="Video"
          name="videoUrl"
          rules={[
            {
              validator: () =>
                videoList.length
                  ? Promise.resolve()
                  : Promise.reject("Please upload a video"),
            },
          ]}
        >
          <Upload
            listType="picture-card"
            fileList={videoList}
            onChange={handleVideoChange}
            accept="video/*"
            beforeUpload={() => false} // Disable Ant Design's default upload behavior
          >
            {videoList.length < 1 && (
              <Button icon={<UploadOutlined />}>Upload Video</Button>
            )}
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Request
        </Button>
      </Form>
    </div>
  );
};

export default AddBreederRequest;
