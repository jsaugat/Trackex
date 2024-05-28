import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import expensesReducer from "./slices/expensesSlice.js";
import revenueReducer from "./slices/revenueSlice.js";
import categoriesReducer from "./slices/categoriesSlice.js";
import usersReducer from "./slices/admin/usersSlice.js";
import topStatsReducer from "./slices/topStats.js";
import { emptySplitApi } from "./slices/api/emptySplitApi.js";

export const store = configureStore({
  reducer: {
    topStats: topStatsReducer,
    expenses: expensesReducer,
    revenue: revenueReducer,
    categories: categoriesReducer,
    auth: authReducer,
    users: usersReducer,
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
  devTools: true,
});
