import React from "react";
import { Card } from "antd";

const BranchList = ({ branches }) => {
  if (!branches || branches.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <h1 className="text-3xl font-bold">No Branches Found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-10 sm:px-10 lg:px-30 my-10">
      <h2 className="text-2xl font-semibold text-center text-black mb-6">
        📍 Popular Branches
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {branches.map((branch, index) => (
          <Card
            key={index}
            hoverable
            className="rounded-lg shadow-md"
            cover={
              <img
                src={branch.mainImage}
                alt={branch.name}
                className="h-48 object-cover rounded-t-lg"
              />
            }
          >
            <h3 className="text-lg font-bold">{branch.name}</h3>
            <p className="text-sm text-gray-600">{branch.address}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BranchList;
