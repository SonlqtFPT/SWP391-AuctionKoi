import { Button, Card, Descriptions, Divider, Form, Input } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../protectedRoutes/AuthContext";
import api from "../../../config/axios";
import { Link } from "react-router-dom";

const MemberProfileDetails = () => {
  // Get data and setter functions from AuthContext
  const { userName, role, setUserName } = useAuth();
  const [accountData, setAccountData] = useState(
    JSON.parse(localStorage.getItem("accountData")) || {}
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(accountData);

  const token = localStorage.getItem("accessToken");
  console.log(token);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const data = {
    firstName: editedData.firstName,
    lastName: editedData.lastName,
    phoneNumber: editedData.phoneNumber,
  };

  const handleSave = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await api.post("authenticate/update-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { status } = response.data;
      const { message } = response.data;
      if (status === 1007) {
        toast.success(message);

        // Update localStorage with the new accountData
        localStorage.setItem("accountData", JSON.stringify(editedData));

        // Update the accountData state with the edited data
        setAccountData(editedData);

        // Update userName in AuthContext to reflect the change across the app
        setUserName(`${editedData.firstName} ${editedData.lastName}`);

        setIsEditing(false);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="flex justify-center items-center h-auto">
      <Card
        bordered={true}
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
            MEMBER PROFILE
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
              label={<span style={{ color: "#999" }}>Role</span>}
            >
              <span style={{ color: "#ffffff" }}>{role}</span>
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
          </Descriptions>
        </Form>
        <Divider style={{ borderColor: "#555" }} />
        <div className="flex justify-end">
          <button className="font-bold bg-amber-500 hover:bg-amber-400 rounded-md mx-2 px-2">
            <Link to="/member/profile/update-password">Update Password</Link>
          </button>
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
            className="bg-[#bcab6f]  text-black  hover:text-white transition-colors duration-300"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? "Saving..." : isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MemberProfileDetails;
