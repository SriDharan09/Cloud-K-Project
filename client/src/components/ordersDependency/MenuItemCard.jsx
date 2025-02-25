import React from "react";
import { Card, Typography, Image, Rate, Button } from "antd";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";

const { Title, Paragraph } = Typography;

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        BranchId: item.BranchId,
        MenuItemId: item.id,
        quantity: 1, // Default to 1 when adding
        name: item.name,
        price: item.price,
        menuImage: item.menuImage,
        isVeg: item.isVeg,
      })
    );
  };

  return (
    <Card
      className="border-none shadow-none border-b pb-4 w-full"
      bodyStyle={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left Section: Text Details */}
      <div className="flex flex-col flex-1 pr-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              item.isVeg ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <Title level={5} className="mb-0 font-semibold">
            {item.name}
          </Title>
        </div>

        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="font-semibold text-base">₹{item.price}</span>
          {item.discount && (
            <span className="text-green-600 text-xs font-medium">
              {item.discount}% OFF USE SWIGGYIT
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <Rate allowHalf defaultValue={item.rating || 4.5} disabled className="text-yellow-500 text-xs" />
          <span className="text-xs text-gray-500">({item.reviews} ratings)</span>
        </div>

        <Paragraph className="text-gray-500 text-xs mt-1">
          {item.description.length > 60 ? item.description.slice(0, 60) + "..." : item.description}{" "}
          <span className="text-blue-500 cursor-pointer">more</span>
        </Paragraph>
      </div>

      {/* Right Section: Image & Add Button */}
      <div className="flex flex-col items-center w-28">
        <Image src={item.menuImage} alt={item.name} className="rounded-md object-cover w-24 h-24" preview={false} />
        <Button type="primary" className="bg-green-500 border-none text-white text-xs rounded-lg px-3 mt-2" onClick={handleAddToCart} size="small">
          ADD
        </Button>
        <span className="text-gray-400 text-xs">Customisable</span>
      </div>
    </Card>
  );
};

export default MenuItemCard;
