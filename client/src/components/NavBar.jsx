import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  MenuOutlined,
  CloseOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Input, Button, Avatar, Drawer, Dropdown, Spin } from "antd";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../context/ModalContext";
import logo from "../assets/images/logo.png";
import SearchBar from "./Home/SearchBar";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { markAsReadAsync } from "../redux/slice/notificationSlice";
import ProfileSidebar from "./Home/ProfileSidebar";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Navbar = () => {
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpenMobile, setNotifOpenMobile] = useState(false);
  const menuRef = useRef(null);
  const [notifOpenDesktop, setNotifOpenDesktop] = useState(false);

  const cart = useSelector((state) => state.cart.bucket);
  const isUserLoggedIn = useSelector((state) => state.auth.isUserLogin);
  const user = useSelector((state) => state.auth.user);
  const notifications =
    useSelector((state) => state.notification.notifications) || [];
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  const cartItemCount = Object.keys(cart).length;

  const totalItems = Object.values(cart).reduce((total, branch) => {
    return total + branch.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleNotificationClick = (id) => {
    dispatch(markAsReadAsync(id));
  };

  const notificationItems =
    Array.isArray(notifications) && notifications.length > 0
      ? notifications.map((notif) => ({
          key: notif.id,
          label: (
            <div
              className={`p-2 border-b border-gray-200 cursor-pointer ${
                notif.is_read ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => handleNotificationClick(notif.id)}
            >
              <h4 className="font-semibold">{notif.title}</h4>
              <p className="text-sm text-gray-600">{notif.message}</p>
              <span className="text-xs text-gray-400">
                {new Date(notif.sent_at).toLocaleString()}
              </span>
            </div>
          ),
        }))
      : [
          {
            key: "no-data",
            label: (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ),
          },
        ];
  const closeMenu = () => {
    setMenuOpen(false);
  };

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
          {isUserLoggedIn && (
            <Dropdown
              menu={{ items: notificationItems }}
              trigger={["click"]}
              open={notifOpenMobile}
              onOpenChange={setNotifOpenMobile}
              overlayClassName="w-60 max-h-96 overflow-auto bg-white shadow-lg rounded-lg"
            >
              <StyledBadge badgeContent={unreadCount} color="error">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  onClick={() => setNotifOpenMobile(!notifOpenMobile)}
                />
              </StyledBadge>
            </Dropdown>
          )}
          <Link to="/cart">
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={cartItemCount} color="primary">
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
            <>
              <Dropdown
                menu={{ items: notificationItems }}
                trigger={["click"]}
                open={notifOpenDesktop}
                onOpenChange={setNotifOpenDesktop}
                overlayClassName="w-80 max-h-96 overflow-auto bg-white shadow-lg rounded-lg"
              >
                <StyledBadge badgeContent={unreadCount} color="error">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    onClick={() => setNotifOpenDesktop(!notifOpenDesktop)}
                  />
                </StyledBadge>
              </Dropdown>

              <Avatar
                src={user?.profileImage || undefined}
                icon={!user?.profileImage && <UserOutlined />}
                className="cursor-pointer"
                size="large"
                onClick={() => setProfileOpen(true)}
              />
            </>
          ) : (
            <Button onClick={openModal} type="text" icon={<UserOutlined />}>
              Sign In
            </Button>
          )}

          <Link to="/cart">
            <IconButton aria-label="cart">
              <StyledBadge badgeContent={cartItemCount} color="primary">
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
            ref={menuRef}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 left-0 w-full bg-white p-5 shadow-2xl md:hidden flex flex-col items-center gap-4 rounded-t-2xl border-t border-gray-600 backdrop-blur-lg"
          >
            <Link to="/offers" onClick={closeMenu}>
              <Button type="text">Offers</Button>
            </Link>
            <Link to="/help" onClick={closeMenu}>
              <Button type="text">Help</Button>
            </Link>

            {isUserLoggedIn ? (
              <Avatar
                src={user?.profileImage || undefined}
                icon={!user?.profileImage && <UserOutlined />}
                className="cursor-pointer"
                size="large"
                onClick={() => {
                  setProfileOpen(true);
                  closeMenu();
                }}
              />
            ) : (
              <Button
                onClick={() => {
                  openModal();
                  closeMenu();
                }}
                type="text"
                icon={<UserOutlined />}
              >
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
