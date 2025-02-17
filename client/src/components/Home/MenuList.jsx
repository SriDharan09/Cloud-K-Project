import React from "react";
import { Card } from "antd";
import placeHolder from "../../assets/images/Foods_placeHolder.png";

const MenuList = ({ menuItems }) => {
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-3xl font-bold">No Dishes Found</h1>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-30">
      <h2 className="text-2xl font-semibold text-black  mb-4">🍽️ Top Dishes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {menuItems.map((item) => (
          <Card
            key={item.id}
            hoverable
            cover={
              <img
                alt={item.menuImage}
                src={item.menuImage || placeHolder }
                className="h-48 object-cover"
              />
            }
          >
            <Card.Meta title={item.name} description={item.price} />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
