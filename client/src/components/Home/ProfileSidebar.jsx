import React from "react";
import { Drawer, Avatar, Button, List } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  HistoryOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  HeartOutlined,
  CreditCardOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector, shallowEqual} from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProfileSidebar = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user, shallowEqual);

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate("/");
  };

  // Menu Items
  const menuItems = [
    { title: "Edit Profile", icon: <EditOutlined />, path: "/profile/edit" },
    {
      title: "Recently Viewed",
      icon: <EyeOutlined />,
      path: "/profile/recently-viewed",
    },
    {
      title: "Order History",
      icon: <HistoryOutlined />,
      path: "/profile/orders",
    },
    {
      title: "My Addresses",
      icon: <EnvironmentOutlined />,
      path: "/profile/addresses",
    },
    { title: "Wishlist", icon: <HeartOutlined />, path: "/profile/wishlist" },
    {
      title: "Saved Cards",
      icon: <CreditCardOutlined />,
      path: "/profile/cards",
    },
    { title: "Settings", icon: <SettingOutlined />, path: "/profile/settings" },
    { title: "Support", icon: <CustomerServiceOutlined />, path: "/support" },
  ];

  return (
    <Drawer
      title="Profile"
      placement="right"
      closable
      onClose={onClose}
      open={open}
      width={320}
      className="custom-drawer"
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Avatar
          src={user?.profileImage || undefined}
          icon={!user?.profileImage && <UserOutlined />}
          className="cursor-pointer border border-gray-300 shadow-md transition-transform transform hover:scale-105"
          size={90}
        />
        <h2 className="text-xl font-semibold">{user?.username || "Guest"}</h2>
        <p className="text-gray-500">{user?.email || ""}</p>
      </motion.div>

      <motion.div
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <List
          itemLayout="horizontal"
          dataSource={menuItems}
          className="profile-menu"
          renderItem={(item) => (
            <List.Item
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all duration-200 hover:scale-105"
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <List.Item.Meta
                avatar={item.icon}
                title={
                  <span className="text-gray-700 font-medium">
                    {item.title}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </motion.div>

      {/* Logout Button Fixed at Bottom */}
      <motion.div
        className="absolute bottom-6 left-0 w-full px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          danger
          className="w-full py-2 text-lg font-semibold shadow-md transition-transform transform hover:scale-105"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </motion.div>
    </Drawer>
  );
};

export default ProfileSidebar;
