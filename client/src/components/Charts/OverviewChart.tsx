import React from "react";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/components/theme-provider";
import { formatNumberWithSuffix } from "@/utils/helpers";
import { Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "react-day-picker";
import {
  AggregatedPoint,
  useOverviewChartData,
} from "@/hooks/useOverviewChartData";

type ChartType = "line" | "bar";

type OverviewChartProps = {
  chartType: ChartType;
  dateRange?: DateRange;
};

const InfoItem = ({ label, value, pillColor }) => (
  <section className="flex justify-between items-center">
    <div className="flex items-center gap-1.5">
      <div className={`rounded-full w-2 h-1 ${pillColor}`} />
      <span className="uppercase text-xs text-muted-foreground">{label}</span>
    </div>
    <span id="value" className="text-sm ml-5">
      {value}
    </span>
  </section>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const row = payload[0].payload as AggregatedPoint;
    const net = row.revenue - row.expenses;

    const infoItems = [
      {
        label: "Revenue",
        value: formatNumberWithSuffix(row.revenue),
        pillColor: "bg-blue-500",
      },
      {
        label: "Expenses",
        value: formatNumberWithSuffix(row.expenses),
        pillColor: "bg-rose-500",
      },
      {
        label: "Net",
        value: `${net >= 0 ? "+" : "-"}${formatNumberWithSuffix(Math.abs(net))}`,
        pillColor: net >= 0 ? "bg-green-500" : "bg-red-500",
      },
    ];

    return (
      <main className="p-3 bg-transparent dark:bg-background/20 border dark:border-muted-foreground/30 backdrop-blur-lg rounded-xl flex flex-col gap-2">
        <section className="grid gap-0">
          {infoItems.map((item, index) => (
            <InfoItem key={index} {...item} />
          ))}
        </section>
        <Separator />
        <section className="mx-auto text-sm text-muted-foreground flex items-center gap-1">
          <Calendar className="size-3.5" /> {row.period}
        </section>
      </main>
    );
  }
  return null;
};

export default function OverviewChart({
  chartType,
  dateRange,
}: OverviewChartProps) {
  const { theme } = useTheme();
  const isLightMode = theme === "light";
  const transformedData = useOverviewChartData(dateRange);

  // Keep render logic simple: only switch chart primitives by mode.
  const ChartComponent = chartType === "bar" ? BarChart : LineChart;
  const DataComponent = chartType === "bar" ? Bar : Line;

  return (
    <ResponsiveContainer width="100%" height="80%">
      <ChartComponent
        width={500}
        height={290}
        data={transformedData}
        margin={{ top: 5, right: 35, left: 20, bottom: 0 }}
      >
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255, 0.1)" }}
        />
        <DataComponent
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#6366f1"
          fill="#6366f1"
          strokeWidth="2px"
          activeDot={{
            r: 8,
            style: { fill: "#6366f1", stroke: "#6366f1", opacity: 0.65 },
          }}
        />
        <DataComponent
          type="monotone"
          dataKey="expenses"
          name="Expenses"
          stroke={isLightMode ? "#383838" : "darkGray"}
          fill={isLightMode ? "#383838" : "darkGray"}
          style={{ opacity: 0.55 }}
          strokeWidth="2px"
          activeDot={{
            r: 6,
            style: { fill: "var(--theme-primary)", opacity: 0.35 },
          }}
        />
        <CartesianGrid strokeDasharray="4 4" stroke="transparent" />
        <XAxis
          dataKey="period"
          className="text-sm font-medium mt-10"
          tickLine={false}
          axisLine={true}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis
          className="text-sm font-medium"
          tickLine={false}
          axisLine={true}
        />
        <Legend />
      </ChartComponent>
    </ResponsiveContainer>
  );
}
