import { emptySplitApi } from "./emptySplitApi";

export type AuditLogFilters = {
  action?: string;
  entity?: string;
  actorId?: string;
  from?: string;
  to?: string;
};

export type GetAuditLogsParams = AuditLogFilters & {
  page?: number;
  limit?: number;
};

export const auditLogsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query({
      query: (params: GetAuditLogsParams = {}) => {
        const { page = 1, limit = 20, ...filters } = params;
        return {
          url: "audit-logs",
          method: "GET",
          params: {
            page,
            limit,
            ...filters,
          },
        };
      },
      providesTags: [{ type: "AuditLog", id: "LIST" }],
    }),
  }),
});

export const { useLazyGetAuditLogsQuery } = auditLogsApi;
