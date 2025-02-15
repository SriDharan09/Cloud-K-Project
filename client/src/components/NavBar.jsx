import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Button } from "antd";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Brand Logo - Links to Home */}
      <Link to="/" className="text-xl font-bold text-gray-800">🍽️ VRS Catering</Link>

      {/* Search Bar */}
      <div className="hidden md:flex items-center">
        <Input
          placeholder="Search for dishes..."
          className="w-72"
          prefix={<SearchOutlined />}
        />
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        <Link to="/offers">
          <Button type="text">Offers</Button>
        </Link>
        <Link to="/help">
          <Button type="text">Help</Button>
        </Link>
        <Link to="/login">
          <Button type="text" icon={<UserOutlined />}>Sign In</Button>
        </Link>
        <Link to="/cart">
          <Button type="text" icon={<ShoppingCartOutlined />} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
