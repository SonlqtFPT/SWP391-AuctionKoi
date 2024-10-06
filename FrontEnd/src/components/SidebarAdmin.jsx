import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  BellOutlined,
  LogoutOutlined,
  FormOutlined,
  CarOutlined,
  AuditOutlined,
  EyeOutlined, // For viewing auctions
  PlusOutlined, // For creating auctions
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Logo from "../assets/logo/PrestigeKoi_White.png"; // Assuming the logo path is correct

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Dashboard", "1", <HomeOutlined />),
  getItem("Profile", "2", <UserOutlined />),
  getItem("Manage Request", "3", <FormOutlined />),

  // "Manage Auction" with dropdown items "View Auction" and "Create Auction"
  getItem("Manage Auction", "sub1", <AuditOutlined />, [
    getItem("View Auction", "4", <EyeOutlined />),
    getItem("Create Auction", "5", <PlusOutlined />),
  ]),

  getItem("Manage Transport", "6", <CarOutlined />),
  getItem("View Transaction", "7", <FileOutlined />),
  getItem("Notifications", "8", <BellOutlined />, [], "5"),
  getItem("Logout", "9", <LogoutOutlined />),
];

const SidebarAdmin = ({ setActiveComponent }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuClick = (e) => {
    // Use e.key to determine which item was clicked
    switch (e.key) {
      case "1":
        setActiveComponent("Dashboard");
        break;
      case "2":
        setActiveComponent("Profile");
        break;
      case "3":
        setActiveComponent("Manage Request");
        break;
      case "4":
        setActiveComponent("View Auction");
        break;
      case "5":
        setActiveComponent("Create Auction");
        break;
      case "6":
        setActiveComponent("Manage Transport");
        break;
      case "7":
        setActiveComponent("View Transaction");
        break;
      case "8":
        setActiveComponent("Notifications");
        break;
      case "9":
        setActiveComponent("Logout");
        break;
      default:
        setActiveComponent("Dashboard");
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={220}
      style={{ backgroundColor: "#c74743" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "64px",
          backgroundColor: "#c74743",
          padding: "16px 0",
        }}
      >
        <img
          src={Logo}
          alt="Koi Logo"
          style={{ height: "40px", width: "auto", objectFit: "contain" }}
        />
        {!collapsed && (
          <p style={{ color: "#fff", marginTop: "8px", fontWeight: "bold" }}>
            Admin Dashboard
          </p>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
        style={{ backgroundColor: "#c74743", color: "#fff" }}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default SidebarAdmin;
