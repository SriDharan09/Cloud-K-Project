import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchDetails } from "../redux/slice/branchSlice";
import { fetchCategoryDetails } from "./../redux/slice/categorySlice";
import { fetchMenuDetails } from "./../redux/slice/menuSlice";
import HeroSection from "./../components/Home/HeroSection";
import BranchList from "./../components/Home/BranchList";
import CategoryList from "./../components/Home/CategoryList";
import MenuList from "./../components/Home/MenuList";
import Testimonials from "./../components/Home/Testimonials";
import HomeSkeleton from "../components/Skeleton/HomeSkeleton";

const Home = () => {
  const dispatch = useDispatch();
  const branchDetails = useSelector((state) => state.branch.branchDetails);
  const categoryDetails = useSelector(
    (state) => state.category.categoryDetails
  );
  const menuDetails = useSelector((state) => state.menu.menuDetails);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      await dispatch(fetchBranchDetails());
      await dispatch(fetchCategoryDetails());
      await dispatch(fetchMenuDetails());
      setTimeout(() => setLoading(false), 1000);
    }

    fetchData();
  }, [dispatch]);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <HeroSection />
      <BranchList branches={branchDetails.branches} />
      <CategoryList categories={categoryDetails.categories} />
      <MenuList menuItems={menuDetails.menuItems} />
      <Testimonials />
    </>
  );
};

export default Home;
