import React from "react";
import { Card, Typography, Image, Rate, Button, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";
import { useModal } from "../../context/ModalContext";

const { Title, Paragraph } = Typography;

const MenuItemCard = ({ item, branchStatus }) => {
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const isUserLogin = useSelector((state) => state.auth.isUserLogin);

  const handleAddToCart = () => {
    if (!isUserLogin) {
      openModal();
      return;
    }
    dispatch(
      addToCart({
        BranchId: item.BranchId,
        branchName: item.Branch?.name || "Unknown Branch",
        MenuItemId: item.id,
        quantity: 1,
        name: item.name,
        price: item.price,
        menuImage: item.menuImage,
        isVeg: item.isVeg,
      })
    );
  };

  const getSpiceLevelIndicator = (level) => {
    switch (level) {
      case "No Spice":
        return { emoji: "🫑", text: "No Spice" };
      case "Mild":
        return { emoji: "🌶️", text: "Mild Spice" };
      case "Medium":
        return { emoji: "🌶️🌶️", text: "Medium Spice" };
      case "Spicy":
        return { emoji: "🌶️🌶️🌶️", text: "Very Spicy" };
      default:
        return { emoji: "❓", text: "Unknown Spice Level" };
    }
  };

  const spiceLevel = getSpiceLevelIndicator(item.spicinessLevel);

  return (
    <Card
      className="border-none shadow-none border-b pb-3 w-full"
      bodyStyle={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
      }}
    >
      {/* Left Section: Details */}
      <div className="flex-1 pr-3">
        <div
          className={`absolute top-2 left-2 w-3 h-3 rounded-full ${
            item.isVeg ? "bg-green-500" : "bg-red-500"
          }`}
        />

        <div className="flex items-baseline gap-2">
          <Title level={5} className="mb-0 text-sm md:text-base font-medium">
            {item.name}
          </Title>
          <Tooltip title="Special Dish">
            {item.isSpecial && (
              <span className="cursor-pointer text-yellow-500 text-xs">⭐</span>
            )}
          </Tooltip>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-1">
          <span className="font-semibold mb-2 text-sm md:text-base">
            ₹
            {item.discountPrice ? (
              <>
                <span className="line-through text-gray-400 mr-2">
                  ₹{item.price}
                </span>
                <span className="text-red-500">₹{item.discountPrice}</span>
              </>
            ) : (
              item.price
            )}
          </span>
          <Rate
            allowHalf
            defaultValue={item.rating || 4.0}
            disabled
            className="text-[10px] md:text-sm"
          />
        </div>

        <div className="flex gap-2 mt-1 text-xs py-2 font-semibold">
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">
            {item.Category?.name || "🍽️ Cuisine"}
          </span>
          <Tooltip title={spiceLevel.text}>
            <span className="cursor-pointer bg-red-100 text-red-600 px-2 py-1 rounded-lg">
              {spiceLevel.emoji}
            </span>
          </Tooltip>
        </div>

        <div className="text-gray-500 text-xs mt-2">
          <span>Serving: {item.servingSize}</span>
        </div>

        <Paragraph className="text-gray-500 text-xs mt-1 mb-0 hidden md:block">
          {item.description.length > 50
            ? item.description.slice(0, 50) + "..."
            : item.description}
        </Paragraph>
      </div>

      {/* Right Section: Image & Add Button */}
      <div className="flex flex-col items-center w-20 md:w-24">
        <Image
          src={item.menuImage}
          alt={item.name}
          className="rounded-md object-cover"
          width={80}
          height={80}
          preview={{ src: item.menuImage }}
        />
        <Tooltip
          title={branchStatus === "closed" ? "Branch is closed now" : ""}
        >
          <span className="w-full">
            <Button
              type="primary"
              className={`bg-green-500 border-none text-white text-xs rounded-md px-2 py-1 mt-2 w-full ${
                branchStatus === "closed" ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={branchStatus === "closed" ? undefined : handleAddToCart}
              size="small"
            >
              ADD
            </Button>
          </span>
        </Tooltip>
        <span className="text-gray-400 text-xs mt-1">
          {item.isSpecial ? "Chef's Special" : "Customisable"}
        </span>
      </div>
    </Card>
  );
};

export default MenuItemCard;
