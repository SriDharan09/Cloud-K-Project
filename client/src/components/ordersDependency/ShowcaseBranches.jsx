import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchDetails } from "../../redux/slice/branchSlice";
import { fetchCategoryDetails } from "../../redux/slice/categorySlice";
import { fetchMenuDetails } from "../../redux/slice/menuSlice";
import { Select, Carousel, Button } from "antd";
import { useNavigate } from "react-router-dom";
import BranchCard from "./BranchCard";

const { Option } = Select;

const ShowcaseBranches = () => {
  const dispatch = useDispatch();

  const branches = useSelector((state) => state.branch.branchDetails.branches || []);
  const categories = useSelector(
    (state) => state.category.categoryDetails.categories || []
  );
  const menuItems = useSelector((state) => state.menu.menuDetails.menuItems || []);

  useEffect(() => {
    async function fetchData() {
      if (!branches.length) await dispatch(fetchBranchDetails());
      if (!categories.length) await dispatch(fetchCategoryDetails());
      if (!menuItems.length) await dispatch(fetchMenuDetails());
    }
    fetchData();
  }, [dispatch]);

  const [sortOrder, setSortOrder] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Sorting Function
  const sortedBranches = [...branches].sort((a, b) => {
    if (sortOrder === "name") return a.name.localeCompare(b.name);
    if (sortOrder === "deliveryTime") return a.deliveryTime - b.deliveryTime;
    return 0;
  });

  // Get branches offering the selected category
  const categoryBranchIds = selectedCategory
    ? menuItems
        .filter((menu) => menu.CategoryId === selectedCategory)
        .map((menu) => menu.BranchId)
    : [];

  const filteredBranches = selectedCategory
    ? sortedBranches.filter((branch) => categoryBranchIds.includes(branch.id))
    : sortedBranches;

  return (
    <div className="px-10 my-5">
      <Carousel
        autoplay
        dots={false}
        slidesToShow={4}
        slidesToScroll={1}
        infinite
        className="mb-8"
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-4 cursor-pointer"
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="flex flex-col items-center justify-center w-40 h-40">
              <img
                src={category.categoryImage}
                alt={category.name}
                className="h-24 w-24 object-cover rounded-full shadow-md"
              />
              <h3 className="text-lg font-semibold text-center mt-2">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Sorting & Filtering Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Restaurants Near You</h2>
        <div className="flex gap-4">
          <Select
            value={sortOrder}
            onChange={setSortOrder}
            className="w-32"
            placeholder="Sort By"
          >
            <Option value="name">Name</Option>
            <Option value="deliveryTime">Delivery Time</Option>
          </Select>
          <Button
            className="bg-gray-200"
            onClick={() => setSelectedCategory(null)}
          >
            Clear Filter
          </Button>
        </div>
      </div>

      {/* Branch Listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBranches.length > 0 ? (
          filteredBranches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onClick={() => navigate(`/order-food/${branch.id}`)}
            />
          ))
        ) : (
          <p className="text-gray-500">
            No restaurants found for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShowcaseBranches;
