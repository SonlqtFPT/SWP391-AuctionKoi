import React, { useState } from "react";
import { Card, Descriptions, Typography, Divider, Button, Input, Form } from "antd";
import { useAuth } from "../../protectedRoutes/AuthContext";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const { Title } = Typography;

const StaffProfile = () => {
    const { userName, role, accessToken, setUserName } = useAuth(); // Get user info from AuthContext
    const [accountData, setAccountData] = useState(JSON.parse(localStorage.getItem("accountData")) || {});
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(accountData);
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

    // Save the updated profile data
    const handleSave = async () => {
        setIsLoading(true); // Start loading
        try {
            const response = await api.post('authenticate/update-profile', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Use token from AuthContext
                },
            });
            const { status, message } = response.data;

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
        <div className="flex justify-center items-center h-auto ">
            <Card
                title={
                    <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>
                        Staff Profile
                    </Title>
                }
                bordered={true}
                style={{
                    width: 500,
                    padding: 20,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                }}
            >
                <Form layout="vertical" onFinish={handleSave}>
                    <Descriptions
                        bordered
                        column={1}
                        size="small"
                        labelStyle={{ fontWeight: 'bold' }}
                        contentStyle={{ padding: '8px 16px' }}
                    >
                        <Descriptions.Item label="Name">{userName}</Descriptions.Item>
                        <Descriptions.Item label="Role">{role}</Descriptions.Item>
                        <Descriptions.Item label="Email">{accountData.email}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number">
                            {isEditing ? (
                                <Form.Item
                                    name="phoneNumber"
                                    rules={[
                                        { required: true, message: "Phone number is required" },
                                        { len: 10, message: "Phone number must be exactly 10 digits" }
                                    ]}
                                    initialValue={editedData.phoneNumber}
                                >
                                    <Input
                                        value={editedData.phoneNumber}
                                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                    />
                                </Form.Item>
                            ) : (
                                accountData.phoneNumber
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="First Name">
                            {isEditing ? (
                                <Form.Item
                                    name="firstName"
                                    rules={[
                                        { required: true, message: "First name is required" },
                                        { pattern: /^[A-Za-z]+$/, message: "First name must contain only letters" }
                                    ]}
                                    initialValue={editedData.firstName}

                                >
                                    <Input
                                        value={editedData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    />
                                </Form.Item>
                            ) : (
                                accountData.firstName
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Name">
                            {isEditing ? (
                                <Form.Item
                                    name="lastName"
                                    rules={[
                                        { required: true, message: "Last name is required" },
                                        { pattern: /^[A-Za-z]+$/, message: "Last name must contain only letters" }
                                    ]}
                                    initialValue={editedData.lastName}

                                >
                                    <Input
                                        value={editedData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    />
                                </Form.Item>
                            ) : (
                                accountData.lastName
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </Form>
                <Divider />
                <div className="flex justify-end">
                    {isEditing && (
                        <Button style={{ marginRight: 10 }} onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="primary"
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

export default StaffProfile;
