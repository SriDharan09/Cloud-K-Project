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

  const branches = useSelector(
    (state) => state.branch.branchDetails.branches || []
  );
  const categories = useSelector(
    (state) => state.category.categoryDetails.categories || []
  );
  const menuItems = useSelector(
    (state) => state.menu.menuDetails.menuItems || []
  );

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
    <div className="px-4 sm:px-6 md:px-10 my-5">
      {/* Categories Carousel */}
      <Carousel
        autoplay
        dots={false}
        slidesToShow={
          window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4
        }
        slidesToScroll={1}
        infinite
        className="mb-6 bg-gray-50 rounded-xl"
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex flex-col items-center justify-center  rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
              selectedCategory === category.id ? "border-2 border-gray-500" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="flex flex-col items-center">
              <img
                src={category.categoryImage}
                alt={category.name}
                className="h-24 w-24 object-cover rounded-full shadow-md"
              />
              <h3 className="lg:text-lg sm:text-xs font-semibold text-center mt-2">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Sorting & Filtering Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Restaurants Near You</h2>
        <div className="flex gap-4 mt-3 sm:mt-0">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBranches.length > 0 ? (
          filteredBranches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onClick={() => navigate(`/order-food/${branch.id}`)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full col-span-full">
            <img
              src="https://via.placeholder.com/300?text=No+Restaurants+Found"
              alt="No Restaurants Found"
              className="h-40 w-40 object-cover mb-4"
            />
            <p className="text-gray-500 text-center">
              No restaurants found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowcaseBranches;
