import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import expensesReducer from "./slices/expensesSlice";
import revenueReducer from "./slices/revenueSlice";
import categoriesReducer from "./slices/categoriesSlice";
import usersReducer from "./slices/admin/usersSlice";
import topStatsReducer from "./slices/topStats";
import { emptySplitApi } from "./slices/api/emptySplitApi";

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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
