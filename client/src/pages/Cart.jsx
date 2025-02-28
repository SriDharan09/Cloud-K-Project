// CartPage.js
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const CartPage = () => {
  const cart = useSelector((state) => state.cart.bucket);
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Cart</h2>

      {Object.keys(cart).length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        Object.values(cart).map((branch) => (
          <div key={branch.BranchId} className="border p-4 mb-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2">Branch ID: {branch.BranchId}</h3>

            {branch.items.map((item) => {
              const details = branch.frontendItems[item.MenuItemId] || {}; // Fetch UI details
              return (
                <div key={item.MenuItemId} className="flex justify-between border-b p-2">
                  <p>
                    {details.name} - {item.quantity} x ₹{details.price || 0}
                  </p>
                </div>
              );
            })}

            <p className="mt-2">
              <strong>Total Items:</strong> {branch.items.reduce((sum, i) => sum + i.quantity, 0)}
            </p>
            <p>
              <strong>Total Price:</strong> ₹
              {branch.items.reduce((sum, i) => sum + (branch.frontendItems[i.MenuItemId]?.price || 0) * i.quantity, 0)}
            </p>

            <Button
              type="primary"
              className="mt-3"
              onClick={() => navigate(`/cart/${branch.BranchId}`)}
            >
              Proceed to Checkout
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;
