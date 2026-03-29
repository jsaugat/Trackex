import { emptySplitApi } from "./emptySplitApi";
const USERS_URL = "/auth";

export const authApiSlice = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    guestLogin: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/guest`,
        method: "POST",
      }),
    }),
    verifyLoginOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, data }) => ({
        url: `${USERS_URL}/reset-password/${token}`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getProfile: builder.query<any, void>({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGuestLoginMutation,
  useVerifyLoginOtpMutation,
  useLogoutMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
  useGetProfileQuery,
} = authApiSlice;
