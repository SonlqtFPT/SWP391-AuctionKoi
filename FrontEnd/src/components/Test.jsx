import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, InputNumber, Modal, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

const Test = () => {
  const [students, setStudents] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = useForm();

  const api = "https://66f500119aa4891f2a23708f.mockapi.io/StudentManager";

  const fetchStudent = async () => {
    const response = await axios.get(api);
    console.log(response.data);
    setStudents(response.data);
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  const handleOpenModal = () => {
    setOpenModel(true);
  };

  const handleCloseModal = () => {
    setOpenModel(false);
  };

  const handleSubmitStudent = async (student) => {
    // xử lý lấy thông tin lấy thằng student trong form
    // => post xuống api
    console.log(student);
    try {
      setSubmitting(true);
      const response = await axios.post(api, student);
      // => thành công
      toast.success("Successfully add new student");
      setOpenModel(false);
      setSubmitting(false);

      //clear dữ liệu cũ
      form.resetFields();

      //lấy lại danh sách mới
      fetchStudent();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add student");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>StudentManager</h1>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Create new student
      </button>
      <Table columns={columns} dataSource={students} />
      {/* nếu open là true => modal hiện, false => modal ẩn đi*/}
      {/*onCancel : antd cung cấp*/}
      <Modal
        confirmLoading={submitting}
        onOk={() => form.submit()}
        title="Create new student"
        open={openModel}
        onCancel={handleCloseModal}
      >
        {/*pop up*/}
        {/*form*/}
        <Form onFinish={handleSubmitStudent} form={form}>
          {/* name  => tên biến */}
          {/*rule => định nghĩa validation*/}

          <Form.Item
            label="Student name"
            name="name"
            rules={[
              {
                required: true,
                message: "Why you no enter name?",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Student code"
            name="code"
            rules={[
              {
                required: true,
                message: "Why you no enter code aye?",
              },
              {
                pattern: "SE\\d{6}$",
                message: "Invalid format!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Student score"
            name="score"
            rules={[
              {
                required: true,
                message: "Why you no enter score huh?",
              },
              {
                type: "number",
                min: 0,
                max: 10,
                message: "Invalid score!",
              },
            ]}
          >
            <InputNumber step={0.5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Test;
