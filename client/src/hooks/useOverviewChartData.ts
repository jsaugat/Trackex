import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  differenceInCalendarDays,
  endOfDay,
  format,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
} from "date-fns";
import { DateRange } from "react-day-picker";

export type AggregatedPoint = {
  period: string;
  revenue: number;
  expenses: number;
  sortKey: number; // internal key for stable sort
};

type Granularity = "day" | "week" | "month" | "quarter";
type TransactionLike = { date: string | Date; amount?: number | string };

const MAX_POINTS = 60;

const getGranularity = (daysInRange: number): Granularity => {
  if (daysInRange <= 30) return "day";
  if (daysInRange <= 90) return "week";
  if (daysInRange <= 365) return "month";
  return "quarter";
};

const getBucketStart = (date: Date, granularity: Granularity) => {
  switch (granularity) {
    case "day":
      return startOfDay(date);
    case "week":
      return startOfWeek(date, { weekStartsOn: 1 });
    case "month":
      return startOfMonth(date);
    case "quarter":
      return startOfQuarter(date);
    default:
      return startOfDay(date);
  }
};

const getBucketLabel = (bucketStart: Date, granularity: Granularity) => {
  switch (granularity) {
    case "day":
      return format(bucketStart, "MMM d");
    case "week":
      return `Week of ${format(bucketStart, "MMM d")}`;
    case "month":
      return format(bucketStart, "MMM yyyy");
    case "quarter": {
      const quarter = Math.floor(bucketStart.getMonth() / 3) + 1;
      return `Q${quarter} ${bucketStart.getFullYear()}`;
    }
    default:
      return format(bucketStart, "MMM d");
  }
};

const incrementBucketDate = (date: Date, granularity: Granularity) => {
  switch (granularity) {
    case "day":
      return addDays(date, 1);
    case "week":
      return addWeeks(date, 1);
    case "month":
      return addMonths(date, 1);
    case "quarter":
      return addQuarters(date, 1);
    default:
      return addDays(date, 1);
  }
};

const capAggregatedPoints = (points: AggregatedPoint[]): AggregatedPoint[] => {
  if (points.length <= MAX_POINTS) return points;

  const windowSize = Math.ceil(points.length / MAX_POINTS);
  const compacted: AggregatedPoint[] = [];

  for (let index = 0; index < points.length; index += windowSize) {
    const chunk = points.slice(index, index + windowSize);
    const first = chunk[0];
    const last = chunk[chunk.length - 1];

    compacted.push({
      period:
        first.period === last.period
          ? first.period
          : `${first.period} - ${last.period}`,
      revenue: chunk.reduce((sum, point) => sum + point.revenue, 0),
      expenses: chunk.reduce((sum, point) => sum + point.expenses, 0),
      sortKey: first.sortKey,
    });
  }

  return compacted;
};

const toAmount = (amount: number | string | undefined) => Number(amount) || 0;

/**
 * Transforms local transaction arrays into chart-ready buckets.
 * Output adapts to range length and stays capped for readability.
 */
export const useOverviewChartData = (dateRange?: DateRange) => {
  const revenueData = useSelector(
    (state: any) => (state.revenue.data || []) as TransactionLike[],
  );
  const expensesData = useSelector(
    (state: any) => (state.expenses.data || []) as TransactionLike[],
  );

  return useMemo(() => {
    const now = new Date();
    const selectedFrom = dateRange?.from
      ? startOfDay(dateRange.from)
      : startOfDay(addDays(now, -6));
    const selectedTo = dateRange?.to ? endOfDay(dateRange.to) : endOfDay(now);

    const from = isAfter(selectedFrom, selectedTo)
      ? startOfDay(selectedTo)
      : selectedFrom;
    const to = isBefore(selectedTo, selectedFrom)
      ? endOfDay(selectedFrom)
      : selectedTo;

    const totalDays = differenceInCalendarDays(to, from) + 1;
    const granularity = getGranularity(totalDays);
    const bucketMap = new Map<string, AggregatedPoint>();

    // Pre-populate buckets so empty ranges still render with zero values.
    let cursor = getBucketStart(from, granularity);
    while (!isAfter(cursor, to)) {
      const key = String(cursor.getTime());
      bucketMap.set(key, {
        period: getBucketLabel(cursor, granularity),
        revenue: 0,
        expenses: 0,
        sortKey: cursor.getTime(),
      });
      cursor = incrementBucketDate(cursor, granularity);
    }

    const accumulate = (
      items: TransactionLike[],
      keyName: "revenue" | "expenses",
    ) => {
      items.forEach((entry) => {
        const transactionDate = new Date(entry.date);
        if (Number.isNaN(transactionDate.getTime())) return;
        if (isBefore(transactionDate, from) || isAfter(transactionDate, to))
          return;

        const bucketStart = getBucketStart(transactionDate, granularity);
        const mapKey = String(bucketStart.getTime());
        const bucket = bucketMap.get(mapKey) || {
          period: getBucketLabel(bucketStart, granularity),
          revenue: 0,
          expenses: 0,
          sortKey: bucketStart.getTime(),
        };

        bucket[keyName] += toAmount(entry.amount);
        bucketMap.set(mapKey, bucket);
      });
    };

    accumulate(revenueData, "revenue");
    accumulate(expensesData, "expenses");

    const sorted = Array.from(bucketMap.values()).sort(
      (left, right) => left.sortKey - right.sortKey,
    );

    return capAggregatedPoints(sorted);
  }, [revenueData, expensesData, dateRange?.from, dateRange?.to]);
};

