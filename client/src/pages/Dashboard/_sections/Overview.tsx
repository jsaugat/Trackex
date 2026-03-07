import React, { useMemo, useState } from "react";
import CardContainer from "@/components/Card/Container";
import OverviewChart from "@/components/Charts/OverviewChart";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarChart3, LineChart } from "lucide-react";
import MyTooltip from "@/components/MyTooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  addDays,
  endOfDay,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

type TransactionLike = {
  amount?: number | string;
  date?: string | Date;
  createdAt?: string | Date;
};

type OverviewProps = {
  salesData: TransactionLike[];
  expensesData: TransactionLike[];
};

const DEFAULT_PRESET = "last-7";

const PRESET_OPTIONS = [
  { id: "last-7", label: "7D" },
  { id: "last-14", label: "14D" },
  { id: "last-30", label: "30D" },
  { id: "this-month", label: "This Month" },
  { id: "last-month", label: "Last Month" },
];

const getPresetRange = (presetId: string) => {
  const now = new Date();
  switch (presetId) {
    case "last-7":
      return { from: addDays(now, -6), to: now };
    case "last-14":
      return { from: addDays(now, -13), to: now };
    case "last-30":
      return { from: addDays(now, -29), to: now };
    case "this-month":
      return { from: startOfMonth(now), to: now };
    case "last-month": {
      const lastMonth = subMonths(now, 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    }
    default:
      return { from: addDays(now, -6), to: now };
  }
};

export default function Overview({ salesData, expensesData }: OverviewProps) {
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_PRESET);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -6),
    to: new Date(),
  });
  const [chartType, setChartType] = useState("line");
  // todo: remove expensive calculations from render and useMemoize them instead. (totals, filtered data for chart etc.)
  const filteredTotals = useMemo(() => {
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

    const sumWithinRange = (entries: TransactionLike[]) =>
      entries.reduce((sum, entry) => {
        const rawDate = entry.date ?? entry.createdAt;
        if (!rawDate) return sum;

        const transactionDate = new Date(rawDate);
        if (Number.isNaN(transactionDate.getTime())) return sum;
        if (isBefore(transactionDate, from) || isAfter(transactionDate, to))
          return sum;

        return sum + (Number(entry.amount) || 0);
      }, 0);

    return {
      revenue: sumWithinRange(salesData),
      expenses: sumWithinRange(expensesData),
    };
  }, [salesData, expensesData, dateRange?.from, dateRange?.to]);

  //? Chart(type) toggle handler
  const chartToggleHandler = () => {
    if (chartType === "line") {
      setChartType("bar");
    } else {
      setChartType("line");
    }
  };

  const handlePresetChange = (value: string) => {
    if (!value) return;
    setSelectedPreset(value);
    setDateRange(getPresetRange(value));
  };

  const handleCustomRangeSelect = (selectedRange: DateRange | undefined) => {
    // Keep partial selections so users can clear/reselect from/to by clicking.
    setDateRange(selectedRange);
    if (selectedRange?.from || selectedRange?.to) {
      setSelectedPreset("custom");
    }
  };

  return (
    <CardContainer className="p-4 sm:p-6 lg:p-7 border">
      {/* Header */}
      <div className="flex justify-between">
        <h3 className="text-xl">Overview</h3>
        <div className="flex items-center gap-2">
          {/* Totals for selected date range */}
          <section className="flex justify-center gap-2 text-muted-foreground/50 text-xs">
            <div className="flex gap-1.5 items-center border border-border/70 p-1 px-2 rounded-lg bg-muted/30">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></div>
              Revenue{" "}
              <span className="font-medium text-white">
                NPR {filteredTotals.revenue.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-1.5 items-center border border-border/70 p-1 px-2 rounded-lg bg-muted/30">
              <div className="h-1.5 w-1.5 bg-rose-500 rounded-full"></div>
              Expense{" "}
              <span className="font-medium text-white">
                NPR {filteredTotals.expenses.toLocaleString()}
              </span>
            </div>
          </section>
          {/* Toggle */}
          <MyTooltip
            trigger={
              <Button
                variant="outline"
                size="icon"
                onClick={chartToggleHandler}
                className="rounded-full p-0.5"
              >
                {chartType === "line" ? (
                  <BarChart3 className="size-4" />
                ) : (
                  <LineChart className="size-4" />
                )}
              </Button>
            }
            content={
              chartType === "line"
                ? "Bar Chart"
                : chartType === "bar" && "Line chart"
            }
          />
        </div>
      </div>

      {/* <section className="text-xl w-full flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"> */}
      <section className="flex flex-wrap items-center gap-2 p-1 rounded-full w-fit">
        {/* Date range picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="overview-date-range"
              variant="outline"
              className="max-w-52.5 sm:max-w-65 bg-muted/40 md:max-w-[320px] lg:max-w-none justify-start text-left font-normal rounded-full text-xs"
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              {dateRange?.from && dateRange?.to ? (
                <span className="truncate">
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </span>
              ) : dateRange?.from ? (
                <span className="truncate">
                  {format(dateRange.from, "LLL dd, y")} - ...
                </span>
              ) : (
                <span className="truncate">Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleCustomRangeSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Quick date presets */}
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={selectedPreset}
          className="flex-wrap p-1 border rounded-full bg-muted/40"
          onValueChange={handlePresetChange}
        >
          {PRESET_OPTIONS.map((preset) => (
            <ToggleGroupItem
              key={preset.id}
              value={preset.id}
              className={cn(
                "h-[1.65rem] text-xs border-none rounded-full text-muted-foreground hover:bg-transparent whitespace-nowrap",
              )}
            >
              {preset.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>

      {/* Chart */}
      <OverviewChart dateRange={dateRange} chartType={chartType} />
    </CardContainer>
  );
}
