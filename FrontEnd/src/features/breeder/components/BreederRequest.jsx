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
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import uploadFile from "../../../utils/file"; // Adjust this import based on your folder structure

const BreederRequest = () => {
  const [count, setCount] = useState(0);
  const [fishes, setFishes] = useState([]);
  const [openModal, setOpenModal] = useState(false); //mặc định là đóng
  const [submitting, setSubmitting] = useState(false); //Khi submitting là true thì sẽ ko cho ng dùng submit nữa để tránh spam
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageList, setImageList] = useState([]); //danh sách hình ảnh
  const [videoList, setVideoList] = useState([]); // Danh sách video

  const fish_api = "http://localhost:8080/auctionRequest/addRequest";

  // Lấy api
  const fetchFish = async () => {
    console.log("Lỗi nè");
    const response = await axios.get(fish_api);
    console.log("Xem data BE gửi", response.data); //xem data BE gửi
    const sortedFishes = response.data.sort((a, b) => b.fishId - a.fishId); //sắp sếp theo thứ tự giảm dần
    setFishes(response.data); //Lấy danh sách cá vào list cá
  };

  //Từ api chỉ lấy về data cá của fishId truyền vào
  async function fetchFishById(fishId) {
    try {
      const response = await axios.get(`${fish_api}/${fishId}`);
      return response.data; // Trả về dữ liệu cá thể
    } catch (error) {
      console.error("Error fetching fish data:", error);
    }
  }

  //chạy load api vào list cá
  useEffect(() => {
    fetchFish();
  }, []); //dependency array

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
        return <span>{status || "pending"}</span>; // Show "pending" if status is empty
      },
    },
    {
      title: "Update",
      dataIndex: "fishId",
      key: "fishId",
      render: (fishId) => {
        return (
          <Button
            onClick={() => handleOpenModalWithData(fishId)}
            type="primary"
          >
            Update
          </Button>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "fishId",
      key: "fishId",
      render: (fishId) => {
        return (
          <div>
            <Popconfirm
              title="Delete đó"
              description="Are you sure you want to delete this request?"
              onConfirm={() => handleDeleteFish(fishId)}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleVideoChange = ({ fileList: newVideoList }) =>
    setVideoList(newVideoList);

  const handleDeleteFish = async (id) => {
    try {
      // cách này sẽ xóa luôn api
      // await axios.delete(`${fish_api}/${id}`);
      // toast("Delete successfully!!!");
      // fetchFish();

      // Thay vì xóa, cập nhật status thành "cancel"
      await axios.put(`${fish_api}/${id}`, { status: "cancel" });
      toast("Delete successfully!!!");
      fetchFish();
    } catch (error) {
      toast.error("Delete failure!!!");
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    form.resetFields();
    setImageList([]);
    setVideoList([]);
  };

  const handleOpenModalWithData = async (fishId) => {
    const data = await fetchFishById(fishId); // Lấy dữ liệu của cá có fishId trùng khớp
    console.log("Data passed to modal:", data);
    form.setFieldsValue(data); // Điền thông tin cá vào không bao gồm image và video
    //có xử lý các giá trị là null và cũng cập hật ảnh lên
    const existingFiles = Array.isArray(data.image) ? data.image : [data.image]; // Chuyển đổi thành mảng nếu không phải là mảng
    const validFiles = existingFiles
      .filter((img) => img) // Lọc bỏ các giá trị falsy (null, undefined, '', 0, false)
      .map((img) => {
        if (typeof img === "string") {
          // Kiểm tra xem img có phải là chuỗi không
          return {
            uid: img, // unique id
            name: img.split("/").pop(), // tên file từ URL
            status: "done", // trạng thái
            url: img, // URL của ảnh
          };
        }
        return null; // Trả về null nếu không phải là chuỗi
      })
      .filter((file) => file !== null); // Lọc bỏ các giá trị null
    setImageList(validFiles); // Cập nhật fileList

    //Giống như của image nhưng mà là video
    const existingVideoFiles = Array.isArray(data.video)
      ? data.video
      : [data.video]; // Chuyển đổi thành mảng nếu không phải là mảng
    const validVideoFiles = existingVideoFiles
      .filter((vid) => vid) // Lọc bỏ các giá trị falsy
      .map((vid) => ({
        uid: vid, // unique id
        name: vid.split("/").pop(), // tên file từ URL
        status: "done", // trạng thái
        url: vid, // URL của video
      }))
      .filter((file) => file !== null);
    setVideoList(validVideoFiles); // Cập nhật fileList video

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmitFish = async (fish) => {
    console.log(fish);
    // Tạo đối tượng dữ liệu theo định dạng yêu cầu
    const postData = {
      accountId: 1, // Thay đổi giá trị này nếu cần
      koiFish: {
        varietyName: fish.varietyName,
        gender: fish.gender,
        age: fish.age,
        size: fish.size,
        price: fish.price,
        media: {
          imageUrl: "", // Chưa có giá trị, sẽ cập nhật sau
          videoUrl: "", // Chưa có giá trị, sẽ cập nhật sau
        },
      },
    };
    //Upload image
    if (imageList.length > 0) {
      const urls = await Promise.all(
        //Promise.all sẽ nhận 1 mảng các Promise và trả về Promise mới
        imageList.map(async (file) => {
          //fileList.map(...): Phương thức map được sử dụng để lặp qua từng phần tử trong mảng fileList.
          if (file.originFileObj) {
            const url = await uploadFile(file.originFileObj);
            return url;
          }
          return file.url;
        })
      );
      fish.image = urls; // Lưu trữ tất cả URL ảnh
    }

    //Upload video
    if (videoList.length > 0) {
      const videoUrls = await Promise.all(
        videoList.map(async (file) => {
          if (file.originFileObj) {
            const url = await uploadFile(file.originFileObj);
            return url;
          }
          return null;
        })
      );
      // fish.video = videoUrls; // Lưu trữ tất cả URL video
      fish.video = videoUrls.filter((url) => url !== null); // Lưu trữ tất cả URL video, loại bỏ null
    } else {
      // Nếu không có video mới, giữ nguyên video cũ
      const existingFish = await fetchFishById(fish.fishId);
      fish.video = existingFish.video; // Giữ lại video cũ
    }
    //xử lý thông tin thằng fish
    //Post xuống API
    console.log("Submmit" + fish);
    console.log("Check data gửi api: " + JSON.stringify(postData, null, 2));

    try {
      setSubmitting(true);
      const newFish = { ...fish, status: "pending" };
      if (fish.fishId) {
        await axios.put(`${fish_api}/${fish.fishId}`, newFish); // Cập nhật thông tin
        //await createAuctionRequest(fish.fishId); // Tạo yêu cầu auctionkoi
        toast.success("Update request successfully!!!");
      } else {
        const response = await axios.post(fish_api, postData); // Tạo mới
        // await createAuctionRequest(response.data.fishId); // Tạo yêu cầu auctionkoi
        toast.success("Create a request successfully!!!");
        setFishes((prevFishes) => [newFish, ...prevFishes]);
      }
      handleCloseModal();
      form.resetFields();
      setImageList([]);
      setVideoList([]);
      fetchFish();
    } catch (error) {
      toast.error("Create failure!!!");
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
      <h1>Breeder Management Request</h1>
      <Button onClick={handleOpenModal}>Create a Request</Button>
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
            rules={[
              { required: true, message: "Please choose gender of fish" },
            ]}
          >
            <Select>
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
              <Select.Option value="UNKOWN">Unkown</Select.Option>
            </Select>
          </Form.Item>

          {/* Điền thông tin Size */}
          <Form.Item
            label="Size"
            name={"size"}
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
            rules={[
              { required: true, message: "Please enter price of fish" },
              { type: "number", min: 0, message: "Invalid price" },
            ]}
          >
            <InputNumber
              suffix="vnd"
              form
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          {/* Đăng ảnh cá */}
          <Form.Item
            label="Image"
            name={"imageUrl"}
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
            rules={[
              { required: true, message: "Please upload at least 1 video" },
              {
                validator: (_, value) => {
                  if (videoList.length === 0) {
                    return Promise.reject(
                      new Error("Please upload at least 1 video")
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
    </div>
  );
};

export default BreederRequest;
