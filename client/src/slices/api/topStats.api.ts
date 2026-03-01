import { emptySplitApi } from "./emptySplitApi";
const BASE_URL = "/revenue";

export const topStatsApiSlice = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    //? GET Top Customers
    getTopCustomers: builder.query<any, void>({
      query: () => `${BASE_URL}/top-customers`,
      providesTags: ["TopStats"],
    }),

    //? GET Top Selling Products by Quantity
    getTopSellingProductsByQuantity: builder.query<any, void>({
      query: () => `${BASE_URL}/top-products-by-quantity`,
      providesTags: ["TopStats"],
    }),

    //? GET Top Selling Products by Revenue
    getTopSellingProductsByRevenue: builder.query<any, void>({
      query: () => `${BASE_URL}/top-products-by-revenue`,
      providesTags: ["TopStats"],
    }),
    //? GET Top Selling Categories by Revenue
    getTopSellingCategoriesByRevenue: builder.query<any, void>({
      query: () => `${BASE_URL}/top-categories-by-revenue`,
      providesTags: ["TopStats"],
    }),
  }),
});

export const {
  useGetTopCustomersQuery,
  useGetTopSellingProductsByQuantityQuery,
  useGetTopSellingProductsByRevenueQuery,
  useGetTopSellingCategoriesByRevenueQuery,
} = topStatsApiSlice;
