import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchDetails } from "../redux/slice/branchSlice";
import { fetchCategoryDetails } from "./../redux/slice/categorySlice";
import { fetchMenuDetails } from "./../redux/slice/menuSlice";
import Navbar from "./../components/NavBar";
import HeroSection from "./../components/HeroSection";
import BranchList from "./../components/BranchList";
import CategoryList from "./../components/CategoryList";
import MenuList from "./../components/MenuList";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { Modal } from "antd";
import Login from "./Login";


const Home = () => {
  const dispatch = useDispatch();
  const branchDetails = useSelector((state) => state.branch.branchDetails);
  const categoryDetails = useSelector((state) => state.category.categoryDetails);
  const menuDetails = useSelector((state) => state.menu.menuDetails);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBranchDetails());
    dispatch(fetchCategoryDetails());
    dispatch(fetchMenuDetails());
  }, [dispatch]);

  return (
    <>
      <Navbar openModal={() => setIsModalOpen(true)} /> {/* Pass openModal to Navbar */}
      <HeroSection />
      <BranchList branches={branchDetails.branches} />
      <CategoryList categories={categoryDetails.categories} />
      <MenuList menuItems={menuDetails.menuItems} />
      <Testimonials />
      <Footer />

      {/* Login/Signup Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={500}
        className="absolute inset-0 flex items-center w-90! justify-center backdrop-blur-[4px] bg-white/20 text-black z-10"
      >
        <Login closeModal={() => setIsModalOpen(false)} isModalOpen={isModalOpen} />
      </Modal>

    </>
  );
};

export default Home;
