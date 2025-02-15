import React, { useEffect } from "react";
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

const Home = () => {
  const dispatch = useDispatch();
  const branchDetails = useSelector((state) => state.branch.branchDetails);
  const categoryDetails = useSelector(
    (state) => state.category.categoryDetails
  );
  const menuDetails = useSelector((state) => state.menu.menuDetails);
  console.log(menuDetails.menuItems);

  useEffect(() => {
    dispatch(fetchBranchDetails());
    dispatch(fetchCategoryDetails());
    dispatch(fetchMenuDetails());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <HeroSection />
      <BranchList branches={branchDetails.branches} />
      <CategoryList categories={categoryDetails.categories} />
      <MenuList menuItems={menuDetails.menuItems} />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
