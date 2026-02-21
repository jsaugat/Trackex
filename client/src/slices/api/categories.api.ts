import { emptySplitApi } from "./emptySplitApi";
const BASE_URL = "/category";

export const categoriesApiSlice = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    //? GET ALL Categories
    getCategories: builder.query({
      query: (type) => ({
        url: `${BASE_URL}?type=${type}`, // Include the type query parameter in the URL
        providesTags: ["Category"],
      }),
    }),
    //? CREATE Category
    createCategory: builder.mutation({
      query: ({ type, ...data }) => ({
        url: `${BASE_URL}?type=${type}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category", "TopStats"],
    }),
    //? DELETE Category
    deleteCategory: builder.mutation({
      query: (idToRemove) => ({
        url: `${BASE_URL}/${idToRemove}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "TopStats"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
