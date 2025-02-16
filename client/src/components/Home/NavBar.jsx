import React from "react";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input, Button } from "antd";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Navbar = ({ openModal }) => {
  return (
    <nav className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Brand Logo - Links to Home */}
      <Link to="/" className="text-xl font-bold text-gray-800">
        🍽️ Cloud-K
      </Link>

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
        <Link>
          <Button onClick={openModal} type="text" icon={<UserOutlined />}>
            Sign In
          </Button>
        </Link>
        <Link to="/cart">
          <IconButton aria-label="cart">
            <StyledBadge badgeContent={5} color="primary">
              <ShoppingCartIcon />
            </StyledBadge>
          </IconButton>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
