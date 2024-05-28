import { emptySplitApi } from "./emptySplitApi";
const BASE_URL = "/revenue";

export const revenueApiSlice = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    //? CREATE Revenue
    createRevenue: builder.mutation({
      query: (data) => ({
        url: BASE_URL,
        method: "POST",
        body: { revenueEntries: data }, // Update to send data as an array of products
      }),
      invalidatesTags: ["Revenue", "TopStats"],
    }),

    //? GET All Revenue
    getAllRevenue: builder.query({
      query: () => BASE_URL,
      providesTags: ["Revenue"],
    }),

    //? GET Revenue Sum
    getRevenueSum: builder.query({
      query: () => `${BASE_URL}/sum`,
    }),

    //? UPDATE Revenue
    updateRevenue: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Revenue", "TopStats"],
    }),

    //? DELETE Revenue
    deleteRevenue: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Revenue", "TopStats"],
    }),
  }),
});

export const {
  useCreateRevenueMutation,
  useGetAllRevenueQuery,
  useUpdateRevenueMutation,
  useDeleteRevenueMutation,
  useGetRevenueSumQuery,
} = revenueApiSlice;
