import React from "react";
import { Card } from "antd";
import placeHolder from "../../assets/images/Foods_placeHolder.png";

const MenuList = ({ menuItems }) => {
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center py-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          No Dishes Found
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-4">
        🍽️ Top Dishes
      </h2>

      {/* Adjusted Grid Layout for Responsive Behavior */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {menuItems.map((item) => (
          <Card
            key={item.id}
            hoverable
            className="rounded-lg shadow-md"
            cover={
              <img
                alt={item.name}
                src={item.menuImage || placeHolder}
                className="h-32 sm:h-40 md:h-48 object-cover rounded-t-lg"
              />
            }
          >
            <Card.Meta
              title={<span className="text-sm sm:text-base font-bold">{item.name}</span>}
              description={<span className="text-xs sm:text-sm font-semibold text-gray-600">{item.price}</span>}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
