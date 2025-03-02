import React from "react";

const testimonials = [
  { id: 1, name: "Sridhar", review: "Amazing food and fast delivery!" },
  { id: 2, name: "Kumar", review: "Great quality and taste!" },
];

const Testimonials = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-semibold text-black mb-6 text-center">
        ⭐ Customer Testimonials
      </h2>

      <div className="space-y-4">
        {testimonials.map((testimony) => (
          <div
            key={testimony.id}
            className="flex items-center p-4 border rounded-xl bg-white shadow-sm"
          >
            {/* User Initials Circle */}
            <div className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full text-lg font-bold mr-4">
              {testimony.name.charAt(0)}
            </div>

            {/* Testimonial Content */}
            <div>
              <p className="text-gray-700 text-sm sm:text-base">“{testimony.review}”</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">- {testimony.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
