import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { Input, Button, Avatar, Drawer } from "antd";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../context/ModalContext";
import logo from "../assets/images/logo.png";
import SearchBar from "./Home/SearchBar";
import { useSelector } from "react-redux";
import ProfileSidebar from "./Home/ProfileSidebar"; // Import sidebar component

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Navbar = () => {
  const { openModal } = useModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isUserLoggedIn = useSelector((state) => state.auth.isUserLogin);
  const user = useSelector((state) => state.auth.user); // Assuming user details exist in Redux

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white/80 backdrop-blur-sm animate-fade-in shadow-xl border-t border-gray-300 transition-all duration-300 md:top-0 md:bottom-auto">
      <div className="px-6 py-1 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={logo}
            className="h-10 w-10 sm:h-12 lg:mx-14 sm:w-12 md:h-14 md:w-14 object-contain"
            alt="Ck"
          />
        </Link>

        {/* Hamburger & Cart for Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/cart">
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={5} color="primary">
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <SearchBar />

          <Link to="/offers">
            <Button type="text">Offers</Button>
          </Link>
          <Link to="/help">
            <Button type="text">Help</Button>
          </Link>

          {isUserLoggedIn ? (
            <Avatar
              src={user?.profileImage || undefined}
              icon={!user?.profileImage && <UserOutlined />}
              className="cursor-pointer"
              size="large"
              onClick={() => setProfileOpen(true)}
            />
          ) : (
            <Button onClick={openModal} type="text" icon={<UserOutlined />}>
              Sign In
            </Button>
          )}

          <Link to="/cart">
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={5} color="primary">
                <ShoppingCartIcon />
              </StyledBadge>
            </IconButton>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation with Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 left-0 w-full bg-white p-4 shadow-lg md:hidden flex flex-col items-center gap-4"
          >
            <Link to="/offers">
              <Button type="text">Offers</Button>
            </Link>
            <Link to="/help">
              <Button type="text">Help</Button>
            </Link>
            {isUserLoggedIn ? (
              <Avatar
                src={user?.profileImage || undefined}
                icon={!user?.profileImage && <UserOutlined />}
                className="cursor-pointer"
                size="large"
                onClick={() => setProfileOpen(true)}
              />
            ) : (
              <Button onClick={openModal} type="text" icon={<UserOutlined />}>
                Sign In
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Sidebar */}
      <ProfileSidebar
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
