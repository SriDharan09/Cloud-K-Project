import React from "react";
import banner from "../../assets/images/hero_banner.jpg";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[400px] bg-gray-900 flex items-center justify-center text-white">
      {/* Background Image */}
      <img
        src={banner}
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Content */}
      <div className="relative text-center">
        <h1 className="text-4xl font-bold">Delicious Food, Delivered Fast!</h1>
        <p className="mt-2 text-lg">
          Order from your favorite restaurants now.
        </p>
        <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg shadow-md">
          Order Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
