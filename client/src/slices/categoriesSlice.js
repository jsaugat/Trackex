import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    createCategoryLocally: (state, action) => {
      const newCategory = action.payload;
      state.data.push(newCategory);
    },
    setCategories: (state, action) => {
      state.data = action.payload;
    },
    deleteCategoryLocally: (state, action) => {
      state.data = state.data.filter((c) => c.id !== action.payload);
    },
  },
});

export const { createCategoryLocally, setCategories, deleteCategoryLocally } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
