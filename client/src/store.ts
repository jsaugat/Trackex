import { configureStore } from "@reduxjs/toolkit";
// Persist
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import expensesReducer from "./slices/expensesSlice";
import revenueReducer from "./slices/revenueSlice";
import categoriesReducer from "./slices/categoriesSlice";
import usersReducer from "./slices/admin/usersSlice";
import topStatsReducer from "./slices/topStats";
import { emptySplitApi } from "./slices/api/emptySplitApi";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"], // Only persist the token
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    topStats: topStatsReducer,
    expenses: expensesReducer,
    revenue: revenueReducer,
    categories: categoriesReducer,
    auth: persistedAuthReducer,
    users: usersReducer,
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
        ],
      },
    }).concat(emptySplitApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
