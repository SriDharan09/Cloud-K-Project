import React from "react";
import banner from "../../assets/images/hero_banner.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-gray-900 flex items-center justify-center text-white">
      {/* Background Image */}
      <img
        src={banner}
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* Content */}
      <div className="relative text-center px-4 md:px-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold leading-tight">
          Delicious Food, Delivered Fast!
        </h1>
        <p className="mt-2 text-sm sm:text-base md:text-lg font-medium">
          Order from your favorite restaurants now.
        </p>
        <button className="mt-4 px-5 py-2 sm:px-6 sm:py-3 bg-red-500 text-white text-sm sm:text-base rounded-lg shadow-md transition hover:bg-red-600">
          <Link to={"/order-food"}>Order Now</Link>
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
