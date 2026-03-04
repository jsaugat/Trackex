import { emptySplitApi } from "./emptySplitApi";

const ORGANIZATION_URL = "/organization";

type OrganizationPayload = {
  _id: string;
  name: string;
  slug: string;
  owner?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

export const organizationApiSlice = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrganization: builder.query<OrganizationPayload, void>({
      query: () => ({
        url: `${ORGANIZATION_URL}/me`,
        method: "GET",
      }),
      providesTags: [{ type: "Organization", id: "ME" }],
    }),
    updateMyOrganization: builder.mutation<
      OrganizationPayload,
      { name?: string; slug?: string }
    >({
      query: (body) => ({
        url: `${ORGANIZATION_URL}/me`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Organization", id: "ME" }],
    }),
  }),
});

export const { useGetMyOrganizationQuery, useUpdateMyOrganizationMutation } =
  organizationApiSlice;
