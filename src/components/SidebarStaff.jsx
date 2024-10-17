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
  getItem("Manage Transport", "4", <CarOutlined />),
];

const SidebarStaff = ({ setActiveComponent }) => {
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
        setActiveComponent("Manage Transport");
        break;
      default:
        setActiveComponent("Dashboard");
    }
  };

  return (
    <Sider collapsed={collapsed} className="bg-black flex flex-col">
      <div className="flex justify-center items-center flex-col mt-20">
        {!collapsed && (
          <p className="text-white mt-5 font-bold">Staff Dashboard</p>
        )}
      </div>
      <div className="flex-shrink-0">
        <Button
          type="primary"
          className="w-full my-5"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "Expand" : "Collapse"}
        </Button>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
        className="bg-[#c74743] text-white flex-grow "
        onClick={handleMenuClick}
      />

      {/* Full-width button for collapse/expand */}
    </Sider>
  );
};

export default SidebarStaff;
