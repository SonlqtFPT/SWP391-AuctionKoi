import React from "react";
import { Card, Descriptions, Typography, Divider } from "antd";
import { useAuth } from "../../protectedRoutes/AuthContext";

const { Title } = Typography;

const UserProfile = () => {
  const { userName, role } = useAuth(); // Get user info from AuthContext
  const accountData = JSON.parse(localStorage.getItem("accountData")) || {}; // Retrieve account data from local storage

  return (
    <div className="flex justify-center items-center h-auto pt-20 bg-gray-100">
      <Card
        title={
          <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>
            Admin Profile
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
          <Descriptions.Item label="Phone Number">{accountData.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="First Name">{accountData.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{accountData.lastName}</Descriptions.Item>
        </Descriptions>
        <Divider />
      </Card>
    </div>
  );

};

export default UserProfile;
