import React from "react";

const testimonials = [
  { id: 1, name: "Alice", review: "Amazing food and fast delivery!" },
  { id: 2, name: "Bob", review: "Great quality and taste!" },
];

const Testimonials = () => {
  return (
    <div className="container mx-auto p-4 px-30 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-semibold text-black mb-4">
        ⭐ Testimonials
      </h2>
      {testimonials.map((testimony) => (
        <div
          key={testimony.id}
          className="p-4 border rounded-md mb-2 bg-gray-200"
        >
          <p className="text-black">“{testimony.review}”</p>
          <p className="text-gray-500">- {testimony.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
