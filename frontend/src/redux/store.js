import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import ownerSlice from "./ownerSlice";
import cartSlice from "./cartSlice";
import wishlistSlice from "./wishlistSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    owner: ownerSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
  },
});

export default store;