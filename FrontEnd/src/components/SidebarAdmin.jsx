import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  BellOutlined,
  FormOutlined,
  CarOutlined,
  AuditOutlined,
  EyeOutlined, // For viewing auctions
  PlusOutlined, // For creating auctions
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";

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
      default:
        setActiveComponent("Dashboard");
    }
  };

  return (
    <Sider collapsed={collapsed} className="bg-black">
      <div className="flex justify-center items-center flex-col mt-20">
        {!collapsed && (
          <p className="text-white mt-2 font-bold">Admin Dashboard</p>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
        className="bg-[#c74743] text-white"
        onClick={handleMenuClick}
      />

      {/* Full-width button for collapse/expand */}
      <div className="absolute bottom-0 w-full">
        <Button
          type="primary"
          className="w-full my-10"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "Expand" : "Collapse"}
        </Button>
      </div>
    </Sider>
  );
};

export default SidebarAdmin;
