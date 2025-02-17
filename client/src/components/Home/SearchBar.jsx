import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const placeholderTexts = [
  "Search for dishes...",
  "Find your favorite restaurant...",
  "Explore delicious menus...",
  "Discover new flavors...",
];

const SearchBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % placeholderTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-72">
      {/* Search Input */}
      <Input
        className="w-72 h-10 pl-10"
        prefix={<SearchOutlined className="text-gray-500" />}
        placeholder=""
      />

      {/* Animated Placeholder Text */}
      <div className="absolute inset-0 flex items-center pl-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gray-400"
          >
            {placeholderTexts[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar;
