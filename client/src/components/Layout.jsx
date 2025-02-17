import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { Modal } from "antd";
import Login from "../pages/Login";
import { useModal } from "../context/ModalContext";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();

  // Hide Navbar & Footer on 404 page
  const is404 = location.pathname === "/404" || location.pathname === "*";
  console.log(is404);

  const { isModalOpen, closeModal } = useModal();

  return (
    <div className="flex flex-col min-h-screen">
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
        className="absolute inset-0 flex items-center w-90! justify-center backdrop-blur-[4px] bg-white/20 text-black z-10"
      >
        <Login closeModal={closeModal} isModalOpen={isModalOpen} />
      </Modal>
    </div>
  );
};

export default Layout;
