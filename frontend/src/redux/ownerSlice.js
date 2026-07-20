import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    myShopData: null,
  },
  reducers: {
    setGetMyShopData: (state, action) => {
      state.myShopData = action.payload;
    },
  },
});

export const { setGetMyShopData } = ownerSlice.actions;

export default ownerSlice.reducer;