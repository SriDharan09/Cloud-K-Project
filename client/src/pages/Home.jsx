import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchDetails } from "../redux/slice/branchSlice";
import { fetchCategoryDetails } from "./../redux/slice/categorySlice";

const Home = () => {
  const dispatch = useDispatch();
  const branchDetails = useSelector((state) => state.branch.branchDetails);

  useEffect(() => {
    dispatch(fetchBranchDetails());
    dispatch(fetchCategoryDetails());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Available Branches
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {branchDetails?.branches?.map((branch) => {
          const imageUrl = branch.mainImage
            ? `${branch.mainImage}`
            : "https://via.placeholder.com/150";

          return (
            <div
              key={branch.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <img
                src={imageUrl}
                alt={branch.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {branch.name}
              </h2>
              <p className="text-gray-600">{branch.address}</p>
              <p className="text-gray-500 text-sm">📞 {branch.phone_number}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
