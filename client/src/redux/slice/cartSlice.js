import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bucket: {}, // Stores cart data based on BranchId
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { BranchId, MenuItemId, name, price, quantity, menuImage, isVeg } =
        action.payload;

      // Initialize branch bucket if it doesn't exist
      if (!state.bucket[BranchId]) {
        state.bucket[BranchId] = {
          BranchId,
          items: [],
          customerName: "",
          customerContact: "",
          customerAddress: "",
          notes: "",
          specialInstructions: "",
          paymentMethod: "",
          deliveryDistance: 0,
          frontendItems: {}, // Stores additional details for UI
        };
      }

      // Check if the item already exists
      const existingItem = state.bucket[BranchId].items.find(
        (i) => i.MenuItemId === MenuItemId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.bucket[BranchId].items.push({
          MenuItemId,
          quantity,
        });
      }

      // Store additional frontend details separately
      state.bucket[BranchId].frontendItems[MenuItemId] = {
        name,
        price,
        menuImage,
        isVeg,
      };
    },

    removeFromCart: (state, action) => {
      const { BranchId, MenuItemId } = action.payload;
      if (state.bucket[BranchId]) {
        state.bucket[BranchId].items = state.bucket[BranchId].items.filter(
          (i) => i.MenuItemId !== MenuItemId
        );

        // Remove additional frontend details
        delete state.bucket[BranchId].frontendItems[MenuItemId];

        if (state.bucket[BranchId].items.length === 0) {
          delete state.bucket[BranchId];
        }
      }
    },

    updateQuantity: (state, action) => {
      const { BranchId, MenuItemId, quantity } = action.payload;
      if (state.bucket[BranchId]) {
        const item = state.bucket[BranchId].items.find(
          (i) => i.MenuItemId === MenuItemId
        );
        if (item) {
          item.quantity = quantity;
        }
      }
    },

    updateCustomerDetails: (state, action) => {
      const { BranchId, ...customerDetails } = action.payload;
      if (state.bucket[BranchId]) {
        state.bucket[BranchId] = {
          ...state.bucket[BranchId],
          ...customerDetails,
        };
      }
    },

    clearCart: (state) => {
      state.bucket = {};
    },

    getCartForOrder: (state, action) => {
      const { BranchId } = action.payload;
      if (state.bucket[BranchId]) {
        return {
          BranchId,
          items: state.bucket[BranchId].items,
          customerName: state.bucket[BranchId].customerName,
          customerContact: state.bucket[BranchId].customerContact,
          customerAddress: state.bucket[BranchId].customerAddress,
          notes: state.bucket[BranchId].notes,
          specialInstructions: state.bucket[BranchId].specialInstructions,
          paymentMethod: state.bucket[BranchId].paymentMethod,
          deliveryDistance: state.bucket[BranchId].deliveryDistance,
        };
      }
      return null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateCustomerDetails,
  clearCart,
  getCartForOrder,
} = cartSlice.actions;
export default cartSlice.reducer;
