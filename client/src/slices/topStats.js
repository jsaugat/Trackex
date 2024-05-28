import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  topCustomers: [],
  topProductsByQuantity: [],
  topProductsByRevenue: [],
};

const topStatsSlice = createSlice({
  name: "topStats",
  initialState,
  reducers: {
    setTopCustomers: (state, action) => {
      state.topCustomers = action.payload;
    },
    setTopProductsByQuantity: (state, action) => {
      state.topProductsByQuantity = action.payload;
    },
    setTopProductsByRevenue: (state, action) => {
      state.topProductsByRevenue = action.payload;
    },
  },
});

export const { setTopCustomers, setTopProductsByQuantity, setTopProductsByRevenue } =
  topStatsSlice.actions;

export default topStatsSlice.reducer;
