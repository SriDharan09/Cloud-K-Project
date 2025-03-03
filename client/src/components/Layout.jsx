import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { Modal } from "antd";
import Login from "../pages/Login";
import { useModal } from "../context/ModalContext";
import { useLocation } from "react-router-dom";
import "../styles/Login.css";

const Layout = ({ children }) => {
  const location = useLocation();

  // Hide Navbar & Footer on 404 page
  const is404 = location.pathname === "/404" || location.pathname === "*";

  const { isModalOpen, closeModal } = useModal();

  return (
    <div className="flex flex-col lg:mt-15 min-h-screen">
      {!is404 && <Navbar />}
      <main className="flex-grow">{children}</main>
      <Footer />
      {/* Login/Signup Modal */}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        width={500}
        className="absolute inset-0 flex items-center w-90! justify-center glass-modal bg-white/70 text-black z-10"
      >
        <Login closeModal={closeModal} isModalOpen={isModalOpen} />
      </Modal>
    </div>
  );
};

export default Layout;
