import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const CategoryList = ({ categories }) => {
  const controls = useAnimation();

  if (!categories || categories.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-3xl font-bold">No Categories Found</h1>
      </div>
    );
  }

  return (
    <div className="overflow-hidden mx-auto relative w-full bg-gray-100 py-10">
      <h2 className="text-2xl font-semibold text-center text-black mb-6">
        🍔 Categories
      </h2>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex space-x-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }} 
        >
          {categories.concat(categories).map((category, index) => (
            <motion.div
              key={index}
              className="relative w-64 h-40 rounded-lg overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={category.categoryImage}
                alt={category.name}
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay with Blur Effect */}
              <motion.div className="absolute inset-0 flex items-center justify-center backdrop-blur-[4px] text-black text-center opacity-0 hover:opacity-100 transition-all duration-300">
                <div className="backdrop-blur-md p-4 rounded-md">
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryList;
