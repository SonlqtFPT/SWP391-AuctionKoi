import { useState } from "react";
import { Card, Descriptions, Divider, Button, Input, Select, Form } from "antd";
import { useAuth } from "../../protectedRoutes/AuthContext";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const { Option } = Select;

const BreederProfileDetails = () => {
  const {
    breederName,
    location,
    userName,
    setUserName,
    setBreederName,
    setLocation,
  } = useAuth();
  const [accountData, setAccountData] = useState({
    ...(JSON.parse(localStorage.getItem("accountData")) || {}),
    breederName: breederName || "",
    location: location || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(accountData);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        "/authenticate/update-breeder-profile",
        editedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { status } = response.data;
      const { message } = response.data;
      console.log(status);
      if (status === 1006) {
        toast.success(message);
        localStorage.setItem("accountData", JSON.stringify(editedData));
        setAccountData(editedData);
        setUserName(`${editedData.firstName} ${editedData.lastName}`);
        setBreederName(editedData.breederName);
        setLocation(editedData.location);
        setIsEditing(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-auto py-8 ">
      <Card
        bordered={false}
        style={{
          maxWidth: 600,
          width: "100%",
          backgroundColor: "#1f1f1f",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
        }}
      >
        <div className="flex items-center justify-center space-x-5">
          <span>
            <img
              src="https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/Divider/diamondLeft.png?raw=true"
              alt="Left Divider"
              className="w-auto transform scale-x-[-1]"
            />
          </span>
          <h1 className="text-center text-[#bcab6f] font-bold my-5 text-2xl">
            BREEDER PROFILE
          </h1>
          <span>
            <img
              src="https://github.com/SonlqtFPT/SWP391-AuctionKoi/blob/phureal/src/assets/Divider/diamondRight.png?raw=true"
              alt="Right Divider"
              className="w-auto"
            />
          </span>
        </div>

        <Form layout="vertical" onFinish={handleSave}>
          <Descriptions
            bordered
            column={1}
            size="small"
            style={{ backgroundColor: "#2b2b2b" }}
          >
            <Descriptions.Item
              label={<span style={{ color: "#999" }}>Name</span>}
            >
              <span style={{ color: "#ffffff" }}>{userName}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ color: "#999" }}>Email</span>}
            >
              <span style={{ color: "#ffffff" }}>{accountData.email}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ color: "#999" }}>Phone Number</span>}
            >
              {isEditing ? (
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Phone number is required" },
                    {
                      len: 10,
                      message: "Phone number must be exactly 10 digits",
                    },
                  ]}
                  initialValue={editedData.phoneNumber}
                  className="mt-4"
                >
                  <Input
                    value={editedData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    style={{
                      backgroundColor: "#333",
                      color: "#fff",
                      borderColor: "#555",
                    }}
                  />
                </Form.Item>
              ) : (
                <span style={{ color: "#ffffff" }}>
                  {accountData.phoneNumber}
                </span>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ color: "#999" }}>First Name</span>}
            >
              {isEditing ? (
                <Form.Item
                  name="firstName"
                  rules={[
                    { required: true, message: "First name is required" },
                    {
                      pattern: /^[A-Za-z]+$/,
                      message: "First name must contain only letters",
                    },
                  ]}
                  initialValue={editedData.firstName}
                  className="mt-4"
                >
                  <Input
                    value={editedData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    style={{
                      backgroundColor: "#333",
                      color: "#fff",
                      borderColor: "#555",
                    }}
                  />
                </Form.Item>
              ) : (
                <span style={{ color: "#ffffff" }}>
                  {accountData.firstName}
                </span>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ color: "#999" }}>Last Name</span>}
            >
              {isEditing ? (
                <Form.Item
                  name="lastName"
                  rules={[
                    { required: true, message: "Last name is required" },
                    {
                      pattern: /^[A-Za-z]+$/,
                      message: "Last name must contain only letters",
                    },
                  ]}
                  initialValue={editedData.lastName}
                  className="mt-4"
                >
                  <Input
                    value={editedData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    style={{
                      backgroundColor: "#333",
                      color: "#fff",
                      borderColor: "#555",
                    }}
                  />
                </Form.Item>
              ) : (
                <span style={{ color: "#ffffff" }}>{accountData.lastName}</span>
              )}
            </Descriptions.Item>
            {/* New fields for breederName and location */}
            <Descriptions.Item
              label={<span style={{ color: "#999" }}>Breeder Name</span>}
            >
              {isEditing ? (
                <Select
                  value={editedData.breederName}
                  onChange={(value) => handleInputChange("breederName", value)}
                  style={{
                    backgroundColor: "#333",
                    color: "#fff",
                    borderColor: "#555",
                    width: "100%",
                  }}
                >
                  <Option value="">Select a breeder</Option>
                  <Option value="Marushin">Marushin</Option>
                  <Option value="NND">NND</Option>
                  <Option value="Saki">Saki</Option>
                  <Option value="Torazo">Torazo</Option>
                  <Option value="Shinoda">Shinoda</Option>
                  <Option value="Maruhiro">Maruhiro</Option>
                  <Option value="Kanno">Kanno</Option>
                  <Option value="Izumiya">Izumiya</Option>
                  <Option value="Isa">Isa</Option>
                  <Option value="Dainichi">Dainichi</Option>
                </Select>
              ) : (
                <span style={{ color: "#ffffff" }}>
                  {accountData.breederName}
                </span>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={<span style={{ color: "#999" }}>Location</span>}
            >
              {isEditing ? (
                <Input
                  value={editedData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  style={{
                    backgroundColor: "#333",
                    color: "#fff",
                    borderColor: "#555",
                  }}
                />
              ) : (
                <span style={{ color: "#ffffff" }}>{accountData.location}</span>
              )}
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ borderColor: "#555" }} />
          <div className="flex justify-end">
            {isEditing && (
              <Button
                className="mr-2 bg-[#bcab6f] border-[#ff4d4f] text-black hover:bg-[#ff4d4f] hover:text-white transition-colors duration-300"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
            <Button
              type="primary"
              className="bg-[#bcab6f] border-[#52c41a] text-black hover:bg-[#52c41a] hover:text-white transition-colors duration-300"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default BreederProfileDetails;
