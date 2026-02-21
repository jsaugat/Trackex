import { emptySplitApi } from "../api/emptySplitApi";
const USERS_URL = "/admin/users";

export const usersApiSlice = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    //? GET all Users
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    //? DELETE User
    deleteUser: builder.mutation({
      query: (idToDelete) => ({
        url: `${USERS_URL}/${idToDelete}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    //? UPDATE User
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApiSlice;
