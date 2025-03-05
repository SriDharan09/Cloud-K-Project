import { createSlice } from "@reduxjs/toolkit";
import { resetStore } from "./resetSlice.js";

const initialState = {
  bucket: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const {
        BranchId,
        MenuItemId,
        name,
        branchName,
        price,
        quantity,
        menuImage,
        isVeg,
      } = action.payload;

      if (!state.bucket[BranchId]) {
        state.bucket[BranchId] = {
          BranchId,
          branchName,
          items: [],
          customerName: "",
          customerContact: "",
          customerAddress: "",
          notes: "",
          specialInstructions: "",
          paymentMethod: "",
          deliveryDistance: 0,
          frontendItems: {},
        };
      }

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

    deleteCartAfterOrder: (state, action) => {
      const { BranchId } = action.payload;
      if (state.bucket[BranchId]) {
        delete state.bucket[BranchId];
      }
    },
    extraReducers: (builder) => {
      builder.addCase(resetStore, () => initialState); 
    },
  },
});

export const getCartForOrder = (state, BranchId) => {
  return state.cart.bucket[BranchId]
    ? {
        BranchId,
        items: state.cart.bucket[BranchId].items,
        customerName: state.cart.bucket[BranchId].customerName,
        customerContact: state.cart.bucket[BranchId].customerContact,
        customerAddress: state.cart.bucket[BranchId].customerAddress,
        notes: state.cart.bucket[BranchId].notes,
        specialInstructions: state.cart.bucket[BranchId].specialInstructions,
        paymentMethod: state.cart.bucket[BranchId].paymentMethod,
        deliveryDistance: state.cart.bucket[BranchId].deliveryDistance,
      }
    : null;
};

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateCustomerDetails,
  clearCart,
  deleteCartAfterOrder,
} = cartSlice.actions;

export default cartSlice.reducer;
