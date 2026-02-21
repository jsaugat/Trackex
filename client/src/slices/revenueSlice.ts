import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [] };

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  reducers: {
    //? ADD all fetched revenues.
    addFetchedRevenue: (state, action) => {
      state.data = action.payload;
    },
    //? ADD a revenue
    addRevenueLocally: (state, action) => {
      const newRevenue = action.payload;
      state.data?.push(newRevenue);
    },
    //? REMOVE a revenue
    removeRevenueLocally: (state, action) => {
      const idToRemove = action.payload;
      state.data = state.data?.filter((revenue) => revenue.id !== idToRemove);
    },
    //? UPDATE a revenue
    updateRevenueLocally: (state, action) => {
      const updatedRevenue = action.payload;
      const index = state.data.findIndex(
        (revenue) => revenue.id === updatedRevenue.id
      );
      if (index !== -1) {
        state.data[index] = updatedRevenue;
      }
    },
  },
});

export const {
  addRevenueLocally,
  removeRevenueLocally,
  updateRevenueLocally,
  addFetchedRevenue,
} = revenueSlice.actions;

export default revenueSlice.reducer;
