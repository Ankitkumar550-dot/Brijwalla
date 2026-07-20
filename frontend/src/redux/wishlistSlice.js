import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: JSON.parse(localStorage.getItem("wishlist")) || [],
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const index = state.items.findIndex((item) => item._id === action.payload._id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
