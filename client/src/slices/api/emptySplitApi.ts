/**
 * make requests to backend for CRUD OPERACTION on transaction or AUTHENTICATION: login, signup, update profile
 */

import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.userInfo?.token;
      // console.log("Token :", token);

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Category", "Revenue", "Expense", "User", "TopStats"],
  endpoints: () => ({}),
});
