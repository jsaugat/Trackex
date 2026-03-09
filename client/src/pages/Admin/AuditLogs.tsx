import { useMemo, useState } from "react";
import { endOfDay, formatDistanceToNow, startOfDay } from "date-fns";
import { Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import NoRecords from "@/components/NoRecords";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManualInfiniteList } from "@/hooks/useManualInfiniteList";
import DateRangePicker from "@/pages/Transactions/_components/DateRangePicker";
import {
  useLazyGetAuditLogsQuery,
  type AuditLogFilters,
} from "@/slices/api/auditLogs.api";

const ALL_OPTION_VALUE = "__all__";

const ACTION_OPTIONS = [
  { label: "All actions", value: ALL_OPTION_VALUE },
  { label: "Transaction Created", value: "transaction.created" },
  { label: "Transaction Updated", value: "transaction.updated" },
  { label: "Transaction Deleted", value: "transaction.deleted" },
  { label: "Role Changed", value: "user.role_changed" },
  { label: "Invite Sent", value: "invite.sent" },
  { label: "Invite Accepted", value: "invite.accepted" },
  { label: "Invite Revoked", value: "invite.revoked" },
];

const ENTITY_OPTIONS = [
  { label: "All entities", value: ALL_OPTION_VALUE },
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
  const [dateRange, setDateRange] = useState<any>();

  // Using lazy query to have more control over when it executes (e.g., on filter change)
  const [triggerGetAuditLogs] = useLazyGetAuditLogsQuery();

  // Memoize filters to avoid unnecessary reloads when unrelated state changes
  const filters = useMemo<AuditLogFilters>(() => {
    const nextFilters: AuditLogFilters = {};
    if (action) nextFilters.action = action;
    if (entity) nextFilters.entity = entity;

    if (dateRange?.from) {
      const fromDate = startOfDay(dateRange.from);
      const toDate = dateRange?.to
        ? endOfDay(dateRange.to)
        : endOfDay(dateRange.from);
      nextFilters.from = fromDate.toISOString();
      nextFilters.to = toDate.toISOString();
    }

    return nextFilters;
  }, [action, entity, dateRange]);

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
    <main className="space-y-4">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          Organization activity timeline for transactions, role changes, and
          invites.
        </p>
      </section>

      <section className="flex gap-2 justify-end">
        <Select
          value={action || ALL_OPTION_VALUE}
          onValueChange={(value) =>
            setAction(value === ALL_OPTION_VALUE ? "" : value)
          }
        >
          <SelectTrigger className="h-8 w-fit bg-background justify-self-start rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={entity || ALL_OPTION_VALUE}
          onValueChange={(value) =>
            setEntity(value === ALL_OPTION_VALUE ? "" : value)
          }
        >
          <SelectTrigger className="h-8 w-fit bg-background justify-self-start rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ENTITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker
          date={dateRange}
          setDate={setDateRange}
          className="md:col-span-2 w-fit justify-self-start"
          buttonClassName="h-8 w-fit rounded-full bg-background"
        />
      </section>

      {isInitialLoading ? (
        <LoadingState message="Loading activity log" />
      ) : error ? (
        <section className="space-y-3">
          <NoRecords
            icon={RefreshCw}
            missingThing="audit logs"
            message="Could not load audit logs. Try refreshing the timeline."
          />
          <div className="flex justify-center">
            <Button size="sm" variant="outline" onClick={retry}>
              Retry
            </Button>
          </div>
        </section>
      ) : items.length === 0 ? (
        <NoRecords
          icon={Activity}
          missingThing="activity"
          message="Try adjusting the filters to see more results."
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
