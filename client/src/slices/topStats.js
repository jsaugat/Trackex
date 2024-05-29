import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  topCustomers: [],
  topProductsByQuantity: [],
  topProductsByRevenue: [],
  topCategoriesByRevenue: [],
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
    setTopCategoriesByRevenue: (state, action) => {
      state.topCategoriesByRevenue = action.payload;
    },
  },
});

export const { setTopCustomers, setTopProductsByQuantity, setTopProductsByRevenue, setTopCategoriesByRevenue } =
  topStatsSlice.actions;

export default topStatsSlice.reducer;
