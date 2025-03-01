import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, Empty, message, List, Typography, Spin } from "antd";
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
    <div className="p-6">
      <Title level={2} className="text-center mb-4">
        Your Cart
      </Title>

      {Object.keys(cart).length === 0 ? (
        <div className="flex flex-col items-center">
          <Empty
            className="my-6"
            description="Your cart is empty. Start adding items!"
          />
          <Button type="primary" onClick={() => navigate("/order-food")}>
            Browse Restaurants
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(cart).map((branch) => (
            <Card key={branch.BranchId} className="shadow-lg rounded-lg p-4">
              <Title level={4} className="mb-3">
                {branch.branchName}
              </Title>

              <List
                dataSource={branch.items}
                renderItem={(item) => {
                  const details = branch.frontendItems[item.MenuItemId] || {};
                  return (
                    <List.Item className="flex justify-between border-b py-3">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            details.menuImage ||
                            "https://via.placeholder.com/60"
                          }
                          alt={details.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <Text strong>{details.name}</Text>
                          <p className="text-gray-600">
                            ₹{details.price} x {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          icon={<MinusOutlined />}
                          type="text"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleUpdateQuantity(
                              branch.BranchId,
                              item.MenuItemId,
                              item.quantity - 1
                            )
                          }
                        />
                        <Text strong>{item.quantity}</Text>
                        <Button
                          icon={<PlusOutlined />}
                          type="text"
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
                <Text strong>Subtotal: ₹{calculateTotal(branch)}</Text>
                <p className="text-gray-600">
                  Taxes: ₹{(calculateTotal(branch) * 0.05).toFixed(2)}
                </p>
                <p className="text-gray-600">Delivery Fee: ₹30</p>
                <Title level={4} className="mt-2">
                  Grand Total: ₹
                  {(calculateTotal(branch) * 1.05 + 30).toFixed(2)}
                </Title>
              </div>

              <div className="flex justify-between mt-4">
                <Button onClick={() => navigate("/")}>Continue Shopping</Button>
                <Button danger onClick={handleClearCart}>
                  Clear Cart
                </Button>
                <Button
                  type="primary"
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
