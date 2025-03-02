import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, Empty, message, List, Typography } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slice/cartSlice";

const { Title, Text } = Typography;

const CartPage = () => {
  const cart = useSelector((state) => state.cart.bucket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cart]);

  const calculateTotal = (branch) => {
    return branch.items.reduce(
      (sum, item) =>
        sum +
        (branch.frontendItems[item.MenuItemId]?.price || 0) * item.quantity,
      0
    );
  };

  const handleUpdateQuantity = (BranchId, MenuItemId, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ BranchId, MenuItemId, quantity }));
    }
  };

  const handleRemoveItem = (BranchId, MenuItemId) => {
    dispatch(removeFromCart({ BranchId, MenuItemId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    message.success("Cart cleared successfully!");
  };

  return (
    <div className="p-4 md:p-6">
      <Title level={3} className="text-center mb-4 text-lg md:text-2xl">
        Your Cart
      </Title>

      {Object.keys(cart).length === 0 ? (
        <div className="flex flex-col items-center justify-start min-h-screen p-6">
          <Empty
            className="my-6"
            description="Your cart is empty. Start adding items!"
          />
          <p className="text-lg text-gray-700 mb-4">
            Don’t worry! Explore our wide variety of restaurants.
          </p>
          <Button
            type="primary"
            className="mt-2 w-full md:w-auto"
            onClick={() => navigate("/order-food")}
          >
            Browse Restaurants
          </Button>
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Why Choose Us?
            </h3>
            <ul className="list-disc list-inside mt-2 text-gray-600">
              <li>Fast Delivery</li>
              <li>Wide Range of Choices</li>
              <li>Secure Payments</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(cart).map((branch) => (
            <Card
              key={branch.BranchId}
              className="shadow-md rounded-lg p-3 md:p-4"
            >
              <Title
                level={4}
                className="mb-3 text-sm text-gray-500! sm:text-base md:text-lg"
                style={{ fontSize: "14px" }}
              >
                From <span className="font-bold">{branch.branchName}</span>
              </Title>

              <List
                dataSource={branch.items}
                renderItem={(item) => {
                  const details = branch.frontendItems[item.MenuItemId] || {};
                  return (
                    <List.Item className="flex items-center justify-between border-b py-2">
                      <div className="flex items-center gap-3 w-full">
                        {/* Bigger Image */}
                        <img
                          src={
                            details.menuImage ||
                            "https://via.placeholder.com/60"
                          }
                          alt={details.name}
                          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-md"
                        />
                        {/* Text Details - Name + Price */}
                        <div className="flex-1">
                          <Text strong className="text-sm md:text-base block">
                            {details.name}
                          </Text>
                          <p className="text-gray-600 text-xs md:text-sm">
                            ₹{details.price} x {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Quantity + Remove Buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          icon={<MinusOutlined />}
                          type="text"
                          className="p-1 text-xs md:text-sm"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleUpdateQuantity(
                              branch.BranchId,
                              item.MenuItemId,
                              item.quantity - 1
                            )
                          }
                        />
                        <Text strong className="text-xs md:text-sm">
                          {item.quantity}
                        </Text>
                        <Button
                          icon={<PlusOutlined />}
                          type="text"
                          className="p-1 text-xs md:text-sm"
                          onClick={() =>
                            handleUpdateQuantity(
                              branch.BranchId,
                              item.MenuItemId,
                              item.quantity + 1
                            )
                          }
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          type="text"
                          danger
                          className="p-1 text-xs md:text-sm"
                          onClick={() =>
                            handleRemoveItem(branch.BranchId, item.MenuItemId)
                          }
                        />
                      </div>
                    </List.Item>
                  );
                }}
              />

              <div className="mt-4">
                <Text strong className="text-sm md:text-base">
                  Subtotal: ₹{calculateTotal(branch)}
                </Text>
                <p className="text-gray-600 text-xs md:text-sm">Taxes: ₹{10}</p>
                <p className="text-gray-600 text-xs md:text-sm">
                  Delivery Fee: ₹2
                </p>
                <Title level={4} className="mt-2 text-base md:text-lg">
                  Grand Total: ₹{(calculateTotal(branch) + 10 + 2).toFixed(2)}
                </Title>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/order-food")}
                >
                  Continue Shopping
                </Button>
                <Button
                  danger
                  className="w-full sm:w-auto"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
                <Button
                  type="primary"
                  className="w-full sm:w-auto"
                  onClick={() => navigate(`/cart/${branch.BranchId}`)}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
