import { emptySplitApi } from "./emptySplitApi";

const INVITATIONS_URL = "/invitations";

export const inviteApiSlice = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/invitations — create invite link (owner/manager)
    createInvitation: builder.mutation<
      { token: string; inviteLink: string },
      { role: "member" | "manager"; email?: string }
    >({
      query: (data) => ({
        url: INVITATIONS_URL,
        method: "POST",
        body: data,
      }),
    }),

    // GET /api/invitations/:token — validate invite (public)
    validateInvitation: builder.query<
      {
        status: "valid" | "used" | "expired";
        orgId?: string;
        orgName?: string;
        role?: string;
        email?: string | null;
        message?: string;
      },
      string
    >({
      query: (token) => ({
        url: `${INVITATIONS_URL}/${token}`,
        method: "GET",
      }),
    }),

    // POST /api/invitations/:token/accept — accept invite (public)
    acceptInvitation: builder.mutation<
      {
        _id: string;
        name: string;
        email: string;
        role: string;
        organization: { _id: string; name: string; slug: string };
        token: string;
      },
      { token: string; name: string; email: string; password: string }
    >({
      query: ({ token, ...body }) => ({
        url: `${INVITATIONS_URL}/${token}/accept`,
        method: "POST",
        body,
      }),
    }),

    // DELETE /api/invitations/:token — revoke invite (owner/manager)
    revokeInvitation: builder.mutation<{ message: string }, string>({
      query: (token) => ({
        url: `${INVITATIONS_URL}/${token}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateInvitationMutation,
  useValidateInvitationQuery,
  useAcceptInvitationMutation,
  useRevokeInvitationMutation,
} = inviteApiSlice;
