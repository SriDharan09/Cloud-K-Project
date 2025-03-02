import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrderAsync } from "../redux/slice/orderSlice";
import {
  Button,
  Input,
  Checkbox,
  message,
  Card,
  Radio,
  Typography,
  Divider,
} from "antd";
import { deleteCartAfterOrder } from "../redux/slice/cartSlice";
import BreadcrumbNav from "../components/ordersDependency/BreadcrumbNav";

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile.user);
  const cart = useSelector((state) => state.cart.bucket[id]); // Fetch cart for branch
  const orderStatus = useSelector((state) => state.order.status);

  const [formData, setFormData] = useState({
    customerName: "",
    customerContact: "",
    customerAddress: "",
    notes: "",
    specialInstructions: "",
    paymentMethod: "cash",
  });

  const [autoFill, setAutoFill] = useState(false);

  // Auto-fill profile data
  const handleToggleAutoFill = () => {
    if (!autoFill) {
      setFormData({
        customerName: profile?.username || "",
        customerContact: profile?.phoneNumber || "",
        customerAddress: profile?.address
          ? `${profile.address.street}, ${profile.address.city}, ${profile.address.state}, ${profile.address.zip}`
          : "",
        notes: "",
        specialInstructions: "",
        paymentMethod: "cash",
      });
    } else {
      setFormData({
        customerName: "",
        customerContact: "",
        customerAddress: "",
        notes: "",
        specialInstructions: "",
        paymentMethod: "cash",
      });
    }
    setAutoFill(!autoFill);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle order placement
  const handleOrderPlacement = async () => {
    if (!cart || cart.items.length === 0) {
      return message.error(
        "Your cart is empty. Please add items before proceeding."
      );
    }

    const orderData = {
      BranchId: Number(cart.BranchId),
      items: cart.items,
      ...formData,
      deliveryDistance: 2,
    };

    try {
      const response = await dispatch(createOrderAsync(orderData));

      if (response.payload?.success) {
        dispatch(deleteCartAfterOrder({ BranchId: cart.BranchId }));
        message.success("Order placed successfully!");
        navigate("/order-summary", { state: { orderData: response.payload } });
      } else {
        message.error(response.payload?.message || "Failed to place order.");
      }
    } catch (error) {
      message.error("Error placing order. Please try again.");
    }
  };

  return (
    <>
      <div className="mx-4 mt-2 ">
        <BreadcrumbNav />
      </div>

      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {/* Breadcrumb Navigation */}

        <Title
          level={3}
          className="text-sm! md:text-xl font-semibold text-gray-700"
        >
          Checkout -{" "}
          <span className="font-bold">{cart?.branchName || "Branch"}</span>
        </Title>

        {/* Cart Summary */}
        <Card className="mt-4 shadow-sm">
          <Title level={4} className="text-sm md:text-lg font-medium">
            Order Summary
          </Title>
          {cart?.items?.map((item) => {
            // Access the item details from the frontendItems object using the MenuItemId
            const itemDetails = cart.frontendItems[item.MenuItemId];
            return (
              <div
                key={item.MenuItemId}
                className="flex justify-between text-sm md:text-base py-2 border-b"
              >
                <Text>
                  {itemDetails.name} x {item.quantity}
                </Text>
                <Text strong>₹{itemDetails.price * item.quantity}</Text>
              </div>
            );
          })}
          <div className="mt-2">
            <Text strong>
              Item/s Total: ₹
              {cart?.items?.reduce(
                (sum, item) =>
                  sum +
                  cart.frontendItems[item.MenuItemId].price * item.quantity,
                0
              )}
            </Text>
          </div>
        </Card>

        {/* Auto-Fill Checkbox */}
        <Checkbox
          checked={autoFill}
          onChange={handleToggleAutoFill}
          className="my-4!"
        >
          Auto-Fill details from Profile
        </Checkbox>

        {/* Checkout Form */}
        <Card className="mt-4 shadow-sm">
          <Title level={4} className="text-base md:text-lg font-medium">
            Customer Details
          </Title>

          <Input
            placeholder="Full Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="mb-3!"
          />
          <Input
            placeholder="Phone Number"
            name="customerContact"
            value={formData.customerContact}
            onChange={handleChange}
            className="mb-3!"
          />
          <Input.TextArea
            placeholder="Complete Address"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleChange}
            className="mb-3!"
          />

          <Title level={4} className="text-base md:text-lg font-medium mt-4">
            Additional Notes
          </Title>
          <Input.TextArea
            placeholder="Order Notes (optional)"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="mb-3!"
          />
          <Input.TextArea
            placeholder="Special Instructions (optional)"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            className="mb-3"
          />

          {/* Payment Selection */}
          <Title level={4} className="text-base md:text-lg font-medium mt-4">
            Payment Method
          </Title>
          <Radio.Group
            onChange={(e) =>
              setFormData({ ...formData, paymentMethod: e.target.value })
            }
            value={formData.paymentMethod}
            className="flex gap-4 mt-2"
          >
            <Radio value="cash">Cash on Delivery</Radio>
            <Radio value="online">Online Payment</Radio>
          </Radio.Group>
        </Card>

        {/* Place Order Button */}
        <div className="mt-6 flex flex-col md:flex-row justify-between gap-3">
          <Button
            onClick={() =>
              navigate(
                `/order-food/${cart?.branchName
                  .toLowerCase()
                  .replace(/\s+/g, "-")}-${cart?.BranchId}`
              )
            }
            className="w-full md:w-auto"
          >
            Want to add more?
          </Button>

          <Button
            type="primary"
            className="w-full md:w-auto"
            onClick={handleOrderPlacement}
            loading={orderStatus === "loading"}
          >
            Place Order
          </Button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
