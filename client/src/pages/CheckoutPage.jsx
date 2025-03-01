import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrderAsync } from "../redux/slice/orderSlice";
import { Button, Input, Checkbox, message } from "antd";
import { deleteCartAfterOrder } from "../redux/slice/cartSlice";
import BreadcrumbNav from "../components/ordersDependency/BreadcrumbNav";

const CheckoutPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile.user);
  const cart = useSelector((state) => state.cart.bucket[id]); // Fetch cart for branch
  console.log(cart.BranchId);

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
        customerName: profile.username || "",
        customerContact: profile.phoneNumber || "",
        customerAddress: `${profile.address.street}, ${profile.address.city}, ${profile.address.state}, ${profile.address.zip}`,
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
        paymentMethod: "",
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
      console.log(orderData);
      const response = await dispatch(createOrderAsync(orderData));
      console.log(response.payload);
      if (response.payload?.success) {
        console.log(cart);
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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Checkout - Branch {cart.BranchId}
      </h2>
      <BreadcrumbNav />

      <Checkbox checked={autoFill} onChange={handleToggleAutoFill}>
        Auto-Fill from Profile
      </Checkbox>

      <div className="mt-4">
        <Input
          placeholder="Name"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className="mb-2"
        />
        <Input
          placeholder="Phone Number"
          name="customerContact"
          value={formData.customerContact}
          onChange={handleChange}
          className="mb-2"
        />
        <Input.TextArea
          placeholder="Address"
          name="customerAddress"
          value={formData.customerAddress}
          onChange={handleChange}
          className="mb-2"
        />
        <Input.TextArea
          placeholder="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="mb-2"
        />
        <Input.TextArea
          placeholder="Special Instructions"
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleChange}
          className="mb-2"
        />

        <Button
          type="primary"
          className="mt-3"
          onClick={handleOrderPlacement}
          loading={orderStatus === "loading"}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
