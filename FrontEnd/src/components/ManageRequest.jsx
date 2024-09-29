import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Modal, Select, Table, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "../config/axios"; // Corrected import statement

const ManageRequest = () => {
  const [kois, setKois] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [openDetailModel, setOpenDetailModel] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [selectedKoi, setSelectedKoi] = useState(null);

  // Renamed function from fetchKoi to fetchRequest
  const fetchRequest = async () => {
    try {
      const response = await api.get("manager/getRequest");
      const koiData = response.data.data; // Access the data array
      console.log(koiData);
      // Map to the desired format for the table
      const formattedKois = koiData.map((item) => ({
        requestId: item.requestId,
        status: item.status,
        fishId: item.koiFish.fishId,
        image: item.koiFish.media.imageUrl,
        videoUrl: item.koiFish.media.videoUrl, // Ensure videoUrl is included
        breederId: item.koiFish.variety.varietyId,
      }));

      setKois(formattedKois);
    } catch (error) {
      console.error("Error fetching koi data:", error);
      toast.error("Failed to fetch koi data");
    }
  };

  useEffect(() => {
    fetchRequest(); // Updated to fetchRequest
  }, []);

  const columns = [
    {
      title: "Request ID",
      dataIndex: "requestId",
      key: "requestId",
    },
    {
      title: "Fish ID",
      dataIndex: "fishId",
      key: "fishId",
    },
    {
      title: "Breeder ID",
      dataIndex: "breederId",
      key: "breederId",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <img src={image} alt="" width={200} />,
    },
    {
      title: "Video",
      dataIndex: "videoUrl", // Add videoUrl column
      key: "videoUrl",
      render: (videoUrl) =>
        videoUrl ? (
          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
            Watch Video
          </a>
        ) : null,
    },
    {
      title: "Action",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <div>
          <Select
            defaultValue={record.status}
            onChange={(value) => handleUpdateStatus(record, value)}
            style={{ width: 120, marginRight: 8 }}
          >
            <Select.Option value="PENDING">Pending</Select.Option>
            <Select.Option value="APPROVED">Approve</Select.Option>
            <Select.Option value="REJECTED">Reject</Select.Option>
          </Select>
          <Button onClick={() => handleViewDetail(record)} type="link">
            View Detail
          </Button>
        </div>
      ),
    },
  ];

  const handleOpenModal = () => {
    setOpenModel(true);
  };

  const handleCloseModal = () => {
    setOpenModel(false);
  };

  const handleUpdateStatus = async (koi, status) => {
    const updatedKoi = { ...koi, status };
    try {
      const response = await api.put(
        `manager/getRequest/${koi.requestId}`,
        updatedKoi
      );
      if (response.status === 200) {
        toast.success("Status updated successfully");
        fetchRequest(); // Updated to fetchRequest
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleViewDetail = (koi) => {
    setSelectedKoi(koi);
    setOpenDetailModel(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModel(false);
    setSelectedKoi(null);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      <h1>Request Manager</h1>
      <button onClick={handleOpenModal}>Create new request</button>
      <Table columns={columns} dataSource={kois} />

      <Modal
        confirmLoading={submitting}
        title="Create new request"
        open={openModel}
        onCancel={handleCloseModal}
      >
        <Form form={form}>
          <Form.Item
            label="Fish ID"
            name="fishId"
            rules={[{ required: true, message: "Please enter Fish ID!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Image" name="image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Request Details"
        open={openDetailModel}
        onCancel={handleCloseDetailModal}
        footer={null}
      >
        {selectedKoi && (
          <div>
            <p>
              <strong>Request ID:</strong> {selectedKoi.requestId}
            </p>
            <p>
              <strong>Fish ID:</strong> {selectedKoi.fishId}
            </p>
            <p>
              <strong>Breeder ID:</strong> {selectedKoi.breederId}
            </p>
            <p>
              <strong>Status:</strong> {selectedKoi.status}
            </p>
            <Image
              width={200}
              src={selectedKoi.image}
              alt="Koi"
              style={{ marginTop: 16 }}
            />
          </div>
        )}
      </Modal>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default ManageRequest;
