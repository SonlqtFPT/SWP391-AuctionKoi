/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Table,
  Upload,
} from "antd";
import Title from "antd/es/skeleton/Title";
import axios from "axios";
import Modal from "antd/es/modal/Modal";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../utils/file";
//import toast, { Toaster } from "react-hot-toast";
//import './App.css'

function App() {
  const [fishes, setFishes] = useState([]);
  const [openModal, setOpenModal] = useState(false); //mặc định là đóng
  const [submitting, setSubmitting] = useState(false); //Khi submitting là true thì sẽ ko cho ng dùng submit nữa để tránh spam
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageList, setImageList] = useState([]); //danh sách hình ảnh
  const [videoList, setVideoList] = useState([]); // Danh sách video
  const [mediaId, setMediaId] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [fishId, setFishId] = useState(null);
  const [breederId, setBreederId] = useState(1); // Tạo state cho breederId
  const [dealingModalVisible, setDealingModalVisible] = useState(false); // State for dealing modal
  const [dealingPrice, setDealingPrice] = useState(0); // State for dealing price
  const [dealingAuctionType, setDealingAuctionType] = useState(""); // State for dealing auction type

  const post_fish_api = "http://localhost:8080/breeder/request/addRequest";
  const get_fish_api = `http://localhost:8080/breeder/request/${breederId}`; // Sử dụng biến breederId
  const patch_fish_api = "http://localhost:8080/breeder/request/cancel";
  const put_fish_api = "http://localhost:8080/breeder/request/update";
  const post_confirm_api =
    "http://localhost:8080/breeder/request/negotiation/accept/";
  const post_deal_api =
    "http://localhost:8080/breeder/request/negotiation/send-negotiation";

  // Lấy api
  const fetchFish = async () => {
    try {
      const response = await axios.get(get_fish_api);
      console.log("Data received from backend:", response.data);
      // Access the 'data' property from the response
      const fishData = response.data.data.map((request) => ({
        requestId: request.requestId,
        fishId: request.koiFish.fishId,
        varietyName: request.koiFish.variety.varietyName, // Assuming varietyName is in koiFish
        age: request.koiFish.age,
        gender: request.koiFish.gender,
        size: request.koiFish.size,
        price: request.koiFish.price,
        auctionTypeName: request.koiFish.auctionTypeName,
        status: request.status,
        mediaId: request.koiFish.media.mediaId,
        image: request.koiFish.media.imageUrl, // Accessing image URL here
        video: request.koiFish.media.videoUrl, // Accessing video URL here
      }));
      fishData.sort((a, b) => b.requestId - a.requestId);
      setFishes(fishData);
    } catch (error) {
      console.error("Error fetching fish data:", error);
    }
  };

  //chạy load api vào list cá
  useEffect(() => {
    fetchFish();
  }, [breederId]); // Thêm breederId vào dependency array

  const columns = [
    {
      title: "ID",
      dataIndex: "fishId",
      key: "fishId",
    },
    {
      title: "varietyName",
      dataIndex: "varietyName",
      key: "varietyName",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Auction Type",
      dataIndex: "auctionTypeName",
      key: "auctionTypeName",
      render: (auctionTypeName) => {
        let displayValue;

        switch (auctionTypeName) {
          case "FIXED_PRICE_SALE":
            displayValue = "Fixed Price Sale";
            break;
          case "SEALED_BID":
            displayValue = "Sealed Bid";
            break;
          case "ASCENDING_BID":
            displayValue = "Ascending Bid";
            break;
          case "DESCENDING_BID":
            displayValue = "Descending Bid";
            break;
          default:
            displayValue = auctionTypeName; // Hoặc có thể là "N/A" nếu không có giá trị
        }

        return <span>{displayValue}</span>; // Chỉ hiển thị một giá trị
      },
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => {
        const imagesToRender = Array.isArray(image) ? image : [image]; //Nếu là mảng thì sẽ đc gán giá trị của image đó còn không thì sẽ gán 1 mảng mới chỉ có 1 image
        return (
          <div>
            {imagesToRender.map((img, index) => (
              <Image key={index} src={img} width={200} height={200} />
            ))}
          </div>
        );
      },
    },
    {
      title: "Video",
      dataIndex: "video",
      key: "video",
      render: (video) => {
        const videosToRender = Array.isArray(video) ? video : [video]; // Nếu là mảng thì sẽ đc gán giá trị của video đó còn không thì sẽ gán 1 mảng mới chỉ có 1 video
        return (
          <div>
            {videosToRender.map((vid, index) => (
              <video key={index} width="200" height="200" controls>
                <source src={vid} type="video/mp4" />{" "}
                {/* Thay đổi type nếu cần */}
                Your browser does not support the video tag.
              </video>
            ))}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return <span>{status || "PENDING"}</span>; // Show "pending" if status is empty
      },
    },
    {
      title: "Action",
      dataIndex: "requestId",
      key: "requestId",
      render: (requestId, fish) => {
        // Check the status and render buttons accordingly
        if (fish.status === "CANCELLED") {
          return null; // Do not render buttons if status is CANCELLED
        }
        if (fish.status === "PENDING") {
          return (
            <div>
              <Button
                onClick={() => handleOpenModalWithData(fish)}
                type="primary"
                style={{ marginRight: "5px" }} // Add margin for spacing
              >
                Update
              </Button>
              <Popconfirm
                title="Are you sure you want to cancel this request?"
                description="Are you sure you want to delete this request?"
                onConfirm={() => handleDeleteFish(requestId)}
              >
                <Button danger type="primary" style={{ marginRight: "5px" }}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          );
        }
        if (fish.status === "PENDING_NEGOTIATION") {
          return (
            <div>
              <Popconfirm
                title="Are you sure you want to cancel this request?"
                description="Are you sure you want to delete this request?"
                onConfirm={() => handleDeleteFish(requestId)}
              >
                <Button danger type="primary" style={{ marginRight: "5px" }}>
                  Delete
                </Button>
              </Popconfirm>
              <Button
                onClick={() => handleConfirm(requestId)} // Đảm bảo requestId được truyền đúng
                type="primary"
                style={{
                  marginRight: "5px",
                  backgroundColor: "green",
                  borderColor: "green",
                }}
              >
                Confirm
              </Button>
              <Button
                onClick={() => handleDealing(requestId)} // Pass fish to handleDealing
                type="default"
                style={{
                  marginRight: "5px",
                  backgroundColor: "orange",
                  borderColor: "orange",
                }}
              >
                Dealing
              </Button>
            </div>
          );
        }
        return null; // Default case, no buttons
      },
    },
  ];

  const handleDealing = (requestId) => {
    setRequestId(requestId); // Lưu requestId
    setDealingModalVisible(true); // Mở modal
  };

  // Function to handle dealing submission
  const handleDealingSubmit = async () => {
    // Tạo đối tượng chứa dữ liệu cần gửi
    const dealData = {
      price: dealingPrice, // Giá mà người dùng đã nhập
      auctionTypeName: dealingAuctionType, // Loại đấu giá mà người dùng đã chọn
    };

    try {
      // Gửi dữ liệu đến API với requestId trong đường dẫn
      const response = await axios.post(
        `${post_deal_api}/${requestId}`,
        dealData
      );
      const message = response.data.message; // Lấy message từ response
      toast.success(message); // Hiển thị thông báo thành công

      // Đóng modal và reset các giá trị
      setDealingModalVisible(false);
      setDealingPrice(0); // Reset giá
      setDealingAuctionType(""); // Reset loại đấu giá
      fetchFish();
    } catch (error) {
      toast.error("Submission failed!"); // Hiển thị thông báo lỗi
      console.error("Error submitting deal data:", error); // Log lỗi
    }
  };

  const handleConfirm = async (requestId) => {
    console.log("Request ID:", requestId); // Kiểm tra giá trị requestId
    const response = await axios.post(`${post_confirm_api}/${requestId}`);
    toast(response.data.message);
    fetchFish();
  };

  const handleVideoChange = ({ fileList: newVideoList }) =>
    setVideoList(newVideoList);

  const handleDeleteFish = async (requestId) => {
    try {
      console.log("Request ID to cancel:", requestId);
      const response = await axios.patch(`${patch_fish_api}/${requestId}`);
      const message = response.data.message; // Lấy message từ response
      toast(message); // Hiển thị thông báo
      fetchFish(); // Fetch updated data
    } catch (error) {
      toast.error("Cancellation failed!!!");
      console.error("Error cancelling request:", error); // Log the error for debugging
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    form.resetFields();
    setImageList([]);
    setVideoList([]);
  };

  const handleOpenModalWithData = (fish) => {
    console.log("Fish data to open modal:", fish); // Kiểm tra dữ liệu cá
    form.setFieldsValue({
      fishId: fish.fishId,
      varietyName: fish.varietyName,
      gender: fish.gender,
      age: fish.age,
      size: fish.size,
      price: fish.price,
      auctionTypeName: fish.auctionTypeName,
      mediaId: fish.mediaId,
      imageUrl: fish.image, // Đảm bảo trường này được điền
      videoUrl: fish.video, // Đảm bảo trường này được điền
    });
    // Lưu mediaId vào state
    setMediaId(fish.mediaId); // Lưu mediaId từ fish vào state
    setRequestId(fish.requestId);
    setFishId(fish.fishId);
    // Kiểm tra giá trị video trước khi mở modal
    console.log("Video URL to set in modal:", fish.video);
    setImageList([{ url: fish.image }]);
    setVideoList([{ url: fish.video }]); // Đảm bảo video được thiết lập
    setOpenModal(true); // Mở modal
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmitFish = async (fish) => {
    setSubmitting(true);

    // Upload hình ảnh song song và chỉ upload nếu cần (nếu file chưa có URL)
    const imageUrls = await Promise.all(
      imageList.map(async (file) => {
        if (file.originFileObj) {
          return uploadFile(file.originFileObj); // Upload file mới
        }
        return file.url; // Nếu đã có URL, không upload lại
      })
    );
    fish.image = imageUrls.join(","); // Kết hợp các URL ảnh thành chuỗi

    // Giữ video cũ nếu không có video mới
    let videoUrl = fish.video; // Giữ video cũ
    if (videoList.length > 0) {
      const file = videoList[0]; // Chỉ lấy video đầu tiên
      if (file.originFileObj) {
        videoUrl = await uploadFile(file.originFileObj); // Upload video mới
      } else {
        videoUrl = file.url; // Nếu đã có URL, không upload lại
      }
    }

    fish.video = videoUrl; // Gán video mới hoặc giữ video cũ
    // Create the object to post in the correct format
    const putData = {
      accountId: 1,
      koiFish: {
        fishId: fishId,
        varietyName: fish.varietyName,
        gender: fish.gender,
        age: fish.age,
        size: fish.size,
        price: fish.price,
        auctionTypeName: fish.auctionTypeName,
        media: {
          mediaId: mediaId,
          imageUrl: fish.image,
          videoUrl: fish.video,
        },
      },
    };

    const postData = {
      accountId: 1,
      koiFish: {
        fishId: fish.fishId,
        varietyName: fish.varietyName,
        gender: fish.gender,
        age: fish.age,
        size: fish.size,
        price: fish.price,
        auctionTypeName: fish.auctionTypeName,
        media: {
          imageUrl: fish.image,
          videoUrl: fish.video,
        },
      },
    };

    console.log("Submitting data to API1 :", JSON.stringify(postData, null, 2));
    try {
      if (requestId) {
        // Update existing request
        console.log("requestId:", requestId);
        console.log(
          "Submitting data to API1 :",
          JSON.stringify(putData, null, 2)
        );
        const response = await axios.put(
          `${put_fish_api}/${requestId}`,
          putData
        );
        const message = response.data.message; // Lấy message từ response
        toast.success(message); // Hiển thị thông báo
      } else {
        // Create new request
        console.log("Xai roi:");
        console.log(
          "Submitting data to API1 :",
          JSON.stringify(postData, null, 2)
        );
        const response = await axios.post(post_fish_api, postData);
        const message = response.data.message; // Lấy message từ response
        toast.success(message); // Hiển thị thông báo
      }

      // Fetch updated data after successful creation
      fetchFish(); // Fetch updated data after successful creation
      handleCloseModal();
      form.resetFields();
      setImageList([]);
      setVideoList([]);
    } catch (error) {
      toast.error("Submission failed!");
      console.error("Error submitting fish data:", error);
    } finally {
      setSubmitting(false);
    }
  };

  //UPLOAD IMAGE
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
  const handleChange = ({ fileList: newFileList }) => setImageList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div>
      <div
        style={{
          backgroundColor: "#1A1C26",
          padding: "3px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "white" }}>Request List</h1>
        <Button type="primary" onClick={handleOpenModal}>
          Create a Request
        </Button>
      </div>
      <Table columns={columns} dataSource={fishes}></Table>
      <Modal
        confirmLoading={submitting}
        onOk={() => form.submit()}
        title="Request Information"
        open={openModal}
        onCancel={handleCloseModal}
      >
        <Form onFinish={handleSubmitFish} form={form}>
          {/* Thông tin fishId đc ẩn dùng để đảm bảo khi update thì có thể giữ lại fishId để không cần tạo mới fishId*/}
          {/* <Form.Item name="fishId" hidden>
            <Input />
          </Form.Item> */}
          {/* Điền thông tin varietyName */}
          <Form.Item
            label="varietyName"
            name={"varietyName"}
            key={"varietyName"}
            rules={[
              {
                required: true,
                message: "Please choose varietyName of koi fish",
              },
            ]}
          >
            <Select>
              <Select.Option value="Kohaku">Kohaku</Select.Option>
            </Select>
          </Form.Item>

          {/* Điền thông tin Age */}
          <Form.Item
            label="Age"
            name={"age"}
            key={"age"}
            rules={[
              { required: true, message: "Please enter age of fish" },
              { type: "number", min: 0, message: "Invalid age" },
            ]}
          >
            <InputNumber />
          </Form.Item>

          {/* Điền thông tin Gender */}
          <Form.Item
            label="Gender"
            name={"gender"}
            key={"gender"}
            rules={[
              { required: true, message: "Please choose gender of fish" },
            ]}
          >
            <Select>
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
              <Select.Option value="UNKNOWN">Unknown</Select.Option>
            </Select>
          </Form.Item>

          {/* Điền thông tin Size */}
          <Form.Item
            label="Size"
            name={"size"}
            key={"size"}
            rules={[
              { required: true, message: "Please enter size of fish" },
              { type: "number", min: 0, message: "Invalid size" },
            ]}
          >
            <InputNumber />
          </Form.Item>

          {/* Điền thông tin price */}
          <Form.Item
            label="Price"
            name={"price"}
            key={"price"}
            rules={[
              { required: true, message: "Please enter price of fish" },
              { type: "number", min: 0, message: "Invalid price" },
            ]}
          >
            <InputNumber
              suffix="vnd"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          {/* Chọn auctionType */}
          <Form.Item
            label="Auction Type"
            name={"auctionTypeName"}
            rules={[
              { required: true, message: "Please select an auction type" },
            ]}
          >
            <Select>
              <Select.Option value="FIXED_PRICE_SALE">
                Fixed Price Sale
              </Select.Option>
              <Select.Option value="SEALED_BID">Sealed Bid</Select.Option>
              <Select.Option value="ASCENDING_BID">Ascending Bid</Select.Option>
              <Select.Option value="DESCENDING_BID">
                Descending Bid
              </Select.Option>
            </Select>
          </Form.Item>

          {/* Đăng ảnh cá */}
          <Form.Item
            label="Image"
            name={"imageUrl"}
            key={"imageUrl"}
            rules={[
              { required: true, message: "" },
              {
                validator: (_, value) => {
                  if (imageList.length === 0) {
                    return Promise.reject(
                      new Error("Please upload at least 1 picture")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={imageList}
              onPreview={handlePreview}
              onChange={handleChange}
              accept="image/*"
            >
              {imageList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>

          {/* Trường của video */}
          <Form.Item
            label="Video"
            name={"videoUrl"}
            key={"videoUrl"}
            rules={[
              { required: true, message: "Please upload at 1 video" },
              {
                validator: (_, value) => {
                  if (videoList.length === 0) {
                    return Promise.reject(
                      new Error("Please upload at 1 video")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload" // Thay đổi URL upload video
              listType="picture-card"
              fileList={videoList}
              onPreview={handlePreview}
              onChange={handleVideoChange}
              accept="video/*" // Chỉ cho phép upload video
            >
              {videoList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
      <Modal
        title="Dealing Information"
        open={dealingModalVisible}
        onOk={handleDealingSubmit}
        onCancel={() => setDealingModalVisible(false)}
      >
        <Form>
          <Form.Item
            label="Price"
            rules={[{ required: true, message: "Please enter the price" }]}
          >
            <InputNumber
              value={dealingPrice}
              onChange={(value) => setDealingPrice(value)}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Auction Type"
            rules={[
              { required: true, message: "Please select an auction type" },
            ]}
          >
            <Select
              value={dealingAuctionType}
              onChange={(value) => setDealingAuctionType(value)}
            >
              <Select.Option value="FIXED_PRICE_SALE">
                Fixed Price Sale
              </Select.Option>
              <Select.Option value="SEALED_BID">Sealed Bid</Select.Option>
              <Select.Option value="ASCENDING_BID">Ascending Bid</Select.Option>
              <Select.Option value="DESCENDING_BID">
                Descending Bid
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;
