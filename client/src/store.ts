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
  key: "auth", // Unique key used in localStorage (or chosen storage) to store this slice's data
  storage, // Specifies the storage engine to use (e.g., localStorage or AsyncStorage in React Native)
  whitelist: ["token"], // Only persist the 'token' field from the auth slice; other fields like userInfo won't be saved
};

// Wrap the auth reducer with persistReducer to enable automatic saving/loading of the 'token' to localStorage by name 'persist:auth'.
// This ensures the authentication token survives page refreshes.
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Configure the store with the persisted auth reducer and other reducers.
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
  // Configure middleware to handle API calls and enable serializableCheck for debugging.
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
