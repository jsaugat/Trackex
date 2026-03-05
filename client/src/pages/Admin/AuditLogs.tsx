import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { useManualInfiniteList } from "@/hooks/useManualInfiniteList";
import {
  useLazyGetAuditLogsQuery,
  type AuditLogFilters,
} from "@/slices/api/auditLogs.api";

const ACTION_OPTIONS = [
  { label: "All actions", value: "" },
  { label: "Transaction Created", value: "transaction.created" },
  { label: "Transaction Updated", value: "transaction.updated" },
  { label: "Transaction Deleted", value: "transaction.deleted" },
  { label: "Role Changed", value: "user.role_changed" },
  { label: "Invite Sent", value: "invite.sent" },
  { label: "Invite Accepted", value: "invite.accepted" },
  { label: "Invite Revoked", value: "invite.revoked" },
];

const ENTITY_OPTIONS = [
  { label: "All entities", value: "" },
  { label: "Expense", value: "expense" },
  { label: "Revenue", value: "revenue" },
  { label: "User", value: "user" },
  { label: "Invite", value: "invite" },
];

function prettifyAction(action: string) {
  return action
    .replaceAll(".", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AuditLogs() {
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Using lazy query to have more control over when it executes (e.g., on filter change)
  const [triggerGetAuditLogs] = useLazyGetAuditLogsQuery();

  // Memoize filters to avoid unnecessary reloads when unrelated state changes
  const filters = useMemo<AuditLogFilters>(() => {
    const nextFilters: AuditLogFilters = {};
    if (action) nextFilters.action = action;
    if (entity) nextFilters.entity = entity;
    if (from) nextFilters.from = from;
    if (to) nextFilters.to = to;
    return nextFilters;
  }, [action, entity, from, to]);

  // Infinite list hook for paginated audit logs
  const {
    items, // accumulated audit log items
    hasMore, // whether more pages exist
    isInitialLoading, // first page loading state
    isLoadingMore, // next page loading state
    error, // request error
    loadMore, // fetch next page
    retry, // retry initial fetch
  } = useManualInfiniteList({
    queryArgs: filters, // filters passed to API (resets list when changed)

    // function used by the hook to fetch each page
    fetchPage: async (page, queryArgs) => {
      const response = await triggerGetAuditLogs({
        page,
        limit: 20,
        ...queryArgs,
      }).unwrap(); // unwrap RTK Query response

      return {
        items: response.items || [],
        hasMore: Boolean(response.hasMore),
      };
    },
  });

  return (
    <main className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          Organization activity timeline for transactions, role changes, and
          invites.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select
          value={action}
          onChange={(event) => setAction(event.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          {ACTION_OPTIONS.map((option) => (
            <option key={option.value || "all-actions"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={entity}
          onChange={(event) => setEntity(event.target.value)}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          {ENTITY_OPTIONS.map((option) => (
            <option key={option.value || "all-entities"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <Input
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          placeholder="From"
        />

        <Input
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          placeholder="To"
        />
      </section>

      {isInitialLoading ? (
        <LoadingState message="Loading activity log" />
      ) : error ? (
        <section className="space-y-3">
          <EmptyState
            icon={<RefreshCw className="size-7 text-muted-foreground" />}
            message="Could not load audit logs"
            description="Try refreshing the timeline."
          />
          <div className="flex justify-center">
            <Button size="sm" variant="outline" onClick={retry}>
              Retry
            </Button>
          </div>
        </section>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Activity className="size-7 text-muted-foreground" />}
          message="No activity found"
          description="Try adjusting the filters to see more results."
        />
      ) : (
        <section className="space-y-3">
          {items.map((log: any) => (
            <article
              key={log._id}
              className="rounded-xl border bg-card p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  {prettifyAction(log.action)}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {log.actor?.name || "Unknown User"}
                </span>{" "}
                performed this on{" "}
                <span className="uppercase">{log.entity}</span>
              </p>
              {log.meta && Object.keys(log.meta).length > 0 && (
                <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-x-auto">
                  {JSON.stringify(log.meta, null, 2)}
                </pre>
              )}
            </article>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="h-7 px-3 text-xs"
              >
                {isLoadingMore ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
