import React, { useState } from "react";
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
import { addDays, endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

type OverviewProps = {
  salesData: unknown[];
  expensesData: unknown[];
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
  // Keep props for compatibility with existing parent usage.
  void salesData;
  void expensesData;

  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_PRESET);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -6),
    to: new Date(),
  });
  const [chartType, setChartType] = useState("line");

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
    // Ignore partial selections to avoid unstable intermediate chart states.
    if (selectedRange?.from && selectedRange?.to) {
      setDateRange(selectedRange);
      setSelectedPreset("custom");
    }
  };

  return (
    <CardContainer className="p-7">
      <section className="text-xl w-full flex items-center justify-between">
        <h3>
          Overview <span className="text-sm text-muted-foreground"></span>
        </h3>
        <section className="text-sm flex items-center gap-3">
          {/* Quick date presets */}
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={selectedPreset}
            className="p-1 border rounded-full"
            onValueChange={handlePresetChange}
          >
            {PRESET_OPTIONS.map((preset) => (
              <ToggleGroupItem
                key={preset.id}
                value={preset.id}
                className={cn(
                  "h-[1.65rem] border-none rounded-full text-muted-foreground hover:bg-transparent",
                )}
              >
                {preset.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {/* Custom date range picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="overview-date-range"
                variant="outline"
                className="min-w-fit justify-start text-left font-normal rounded-full"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange?.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  <span>Pick a date range</span>
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

          <div className="h-7 w-[1px] bg-border" />

          {/* //? Chart Toggle */}
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
        </section>
      </section>
      <OverviewChart dateRange={dateRange} chartType={chartType} />
      {/* <SimpleBarChart /> */}
    </CardContainer>
  );
}
