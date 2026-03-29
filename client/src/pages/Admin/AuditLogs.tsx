import { useMemo, useState } from "react";
import { endOfDay, formatDistanceToNow, startOfDay } from "date-fns";
import {
  Activity,
  RefreshCw,
  PlusCircle,
  Pencil,
  Trash2,
  ShieldAlert,
  Send,
  CheckCircle2,
  Ban,
} from "lucide-react";
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

function prettifyMetaKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMetaValue(value: unknown) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "number") {
    return value.toLocaleString();
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function getActionStyle(action: string) {
  switch (action) {
    case "transaction.created":
      return {
        icon: PlusCircle,
        color: "text-emerald-500 hover:text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        glow: "hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]",
      };
    case "transaction.updated":
      return {
        icon: Pencil,
        color: "text-blue-500 hover:text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        glow: "hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]",
      };
    case "transaction.deleted":
      return {
        icon: Trash2,
        color: "text-red-500 hover:text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        glow: "hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]",
      };
    case "user.role_changed":
      return {
        icon: ShieldAlert,
        color: "text-amber-500 hover:text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        glow: "hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]",
      };
    case "invite.sent":
      return {
        icon: Send,
        color: "text-indigo-500 hover:text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        glow: "hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]",
      };
    case "invite.accepted":
      return {
        icon: CheckCircle2,
        color: "text-emerald-500 hover:text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        glow: "hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]",
      };
    case "invite.revoked":
      return {
        icon: Ban,
        color: "text-red-400 hover:text-red-300",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        glow: "hover:shadow-[0_0_15px_rgba(248,113,113,0.1)]",
      };
    default:
      return {
        icon: Activity,
        color: "text-muted-foreground",
        bg: "bg-muted",
        border: "border-border",
        glow: "hover:shadow-md",
      };
  }
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

      <section className="flex flex-wrap gap-2 justify-end">
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
        <section className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {items.map((log: any) => {
            const Style = getActionStyle(log.action);
            const Icon = Style.icon;

            return (
              <article
                key={log._id}
                className={`rounded-xl border bg-card p-4 flex flex-col gap-3 h-full transition-all duration-300 ${Style.border} ${Style.glow}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${Style.bg} ${Style.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className={`text-sm font-semibold ${Style.color}`}>
                      {prettifyAction(log.action)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground border-l-2 border-muted pl-3 ml-2.5">
                  <span className="font-medium text-foreground">
                    {log.actor?.name || "Unknown User"}
                  </span>{" "}
                  performed this on{" "}
                  <span
                    className={`uppercase font-medium tracking-wider text-[10px] px-1.5 py-0.5 rounded-full ${Style.bg} ${Style.color}`}
                  >
                    {log.entity}
                  </span>
                </p>
                {log.meta && Object.keys(log.meta).length > 0 && (
                  <section className="rounded-lg border bg-muted/20 p-3 space-y-2 mt-auto">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                      Payload Details
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(log.meta).map(([key, value]) => (
                        <div
                          key={key}
                          className="rounded-md border border-border/50 bg-background/50 px-2.5 py-2 hover:bg-background transition-colors"
                        >
                          <p className="text-[11px] font-medium text-muted-foreground leading-none mb-1">
                            {prettifyMetaKey(key)}
                          </p>
                          <p className="text-xs font-semibold text-foreground wrap-break-word">
                            {formatMetaValue(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </article>
            );
          })}

          {hasMore && (
            <div className="flex justify-center pt-2 col-span-full">
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
