import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranchDetails } from "../redux/slice/branchSlice";
import { fetchMenuDetails } from "../redux/slice/menuSlice";
import { createOrderAsync } from "../redux/slice/orderSlice";
import { Button, Select, Input, message } from "antd";

const Orders = () => {
  const dispatch = useDispatch();
  const { branches } = useSelector((state) => state.branch.branchDetails);
  const { menuItems } = useSelector((state) => state.menu.menuDetails);
  const orderStatus = useSelector((state) => state.order.status);

  const [orderData, setOrderData] = useState({
    BranchId: "",
    items: [],
    customerName: "",
    customerContact: "",
    customerAddress: "",
    notes: "",
    specialInstructions: "",
    paymentMethod: "online",
    deliveryDistance: 0,
  });
  console.log(branches);
  console.log(menuItems);

  useEffect(() => {
    dispatch(fetchBranchDetails());
    dispatch(fetchMenuDetails());
  }, [dispatch]);

  // Handle branch selection
  const handleBranchChange = (value) => {
    setOrderData({ ...orderData, BranchId: value, items: [] });
  };

  // Filter menu items based on the selected branch
  const filteredMenuItems = menuItems?.filter((item) => item.BranchId === orderData.BranchId);

  const handleItemChange = (menuItemId, quantity) => {
    const updatedItems = orderData.items.filter((item) => item.MenuItemId !== menuItemId);
    if (quantity > 0) {
      updatedItems.push({ MenuItemId: menuItemId, quantity });
    }
    setOrderData({ ...orderData, items: updatedItems });
  };

  const handleInputChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!orderData.BranchId || orderData.items.length === 0) {
      return message.error("Please select a branch and at least one menu item.");
    }

    dispatch(createOrderAsync(orderData))
      .then((response) => {
        if (response.payload?.success) {
          message.success("Order placed successfully!");
          setOrderData({
            BranchId: "",
            items: [],
            customerName: "",
            customerContact: "",
            customerAddress: "",
            notes: "",
            specialInstructions: "",
            paymentMethod: "online",
            deliveryDistance: 0,
          });
        } else {
          message.error(response.payload?.message || "Failed to place order.");
        }
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Place an Order</h2>

      {/* Branch Selection */}
      <label className="block text-lg font-semibold">Select Branch</label>
      <Select className="w-full mb-4" onChange={handleBranchChange} value={orderData.BranchId}>
        {branches?.map((branch) => (
          <Select.Option key={branch.id} value={branch.id}>
            {branch.name}
          </Select.Option>
        ))}
      </Select>

      {/* Menu Items Selection */}
      {orderData.BranchId && (
        <>
          <h3 className="text-lg font-semibold mt-4">Select Menu Items</h3>
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <Input
                  type="number"
                  min="0"
                  className="w-20"
                  placeholder="Qty"
                  onChange={(e) => handleItemChange(item.id, parseInt(e.target.value) || 0)}
                />
              </div>
            ))
          ) : (
            <p>No menu items available for this branch.</p>
          )}
        </>
      )}

      {/* Customer Details */}
      <h3 className="text-lg font-semibold mt-4">Customer Details</h3>
      <Input
        placeholder="Customer Name"
        name="customerName"
        value={orderData.customerName}
        onChange={handleInputChange}
        className="mb-2"
      />
      <Input
        placeholder="Contact Number"
        name="customerContact"
        value={orderData.customerContact}
        onChange={handleInputChange}
        className="mb-2"
      />
      <Input
        placeholder="Delivery Address"
        name="customerAddress"
        value={orderData.customerAddress}
        onChange={handleInputChange}
        className="mb-2"
      />
      <Input
        placeholder="Special Instructions"
        name="specialInstructions"
        value={orderData.specialInstructions}
        onChange={handleInputChange}
        className="mb-2"
      />

      {/* Submit Order */}
      <Button type="primary" block onClick={handleSubmit} loading={orderStatus === "loading"}>
        Submit Order
      </Button>
    </div>
  );
};

export default Orders;
