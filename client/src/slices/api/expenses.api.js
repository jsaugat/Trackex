import { emptySplitApi } from "./emptySplitApi";
const BASE_URL = "/expenses";

export const expensesApiSlice = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    //? Get All Expenses
    getAllExpenses: builder.query({
      query: () => `${BASE_URL}`,
      providesTags: ["Expense"],
    }),

    //? Add Expense
    createExpense: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Expense", "TopStats"],
    }),

    //? Update Expense
    updateExpense: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BASE_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Expense", "TopStats"],
    }),

    //? Delete Expense
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense", "TopStats"],
    }),
  }),
});

export const {
  useCreateExpenseMutation,
  useGetAllExpensesQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApiSlice;
