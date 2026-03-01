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
import { useSelector } from "react-redux";
import { formatDMY, formatNumberWithSuffix } from "@/utils/helpers";
import { Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

// TOOLTIP
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const revenue = payload[0].payload.Revenue;
    const expense = payload[0].payload.Expense;
    const date = payload[0].payload.name;
    const profitOrLoss = revenue - expense >= 0 ? "Profit" : "Loss";
    const isProfit = profitOrLoss === "Profit";

    const infoItems = [
      {
        label: "Revenue",
        value: formatNumberWithSuffix(revenue),
        pillColor: "bg-blue-500",
      },
      {
        label: "Expense",
        value: formatNumberWithSuffix(expense),
        pillColor: "bg-rose-500",
      },
      {
        label: profitOrLoss,
        value: `${isProfit ? "+" : "-"}${formatNumberWithSuffix(
          Math.abs(revenue - expense)
        )}`,
        pillColor: isProfit ? "bg-green-500" : "bg-red-500",
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
          <Calendar className="size-3.5" /> {date}
        </section>
      </main>
    );
  }
  return null;
};

// THE LINE CHART
export default function OverviewChart({ chartType, daysCount }) {
  const { theme } = useTheme();
  const isLightMode = theme === "light";
  const revenueData = useSelector((state) => state.revenue.data);
  const expensesData = useSelector((state) => state.expenses.data);

  let transformedData = [];
  const daysCountNumber = parseInt(daysCount, 10);

  if (expensesData && revenueData) {
    const combinedData = {};
    const today = new Date();

    // Pre-seed last N days so the chart can render zero values when no data exists.
    for (let i = daysCountNumber - 1; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = formatDMY(date);
      combinedData[formattedDate] = {
        name: formattedDate,
        day: date.toDateString().split(" ")[0],
        Expense: 0,
        Revenue: 0,
        rawDate: date,
      };
    }

    expensesData.forEach((expense) => {
      const formattedDate = formatDMY(expense.date);
      if (!combinedData[formattedDate]) {
        const rawDate = new Date(expense.date);
        combinedData[formattedDate] = {
          name: formattedDate,
          day: rawDate.toDateString().split(" ")[0],
          Expense: expense.amount,
          Revenue: 0,
          rawDate,
        };
      } else {
        combinedData[formattedDate].Expense += expense.amount;
      }
    });

    revenueData.forEach((revenue) => {
      const formattedDate = formatDMY(revenue.date);
      if (!combinedData[formattedDate]) {
        const rawDate = new Date(revenue.date);
        combinedData[formattedDate] = {
          name: formattedDate,
          day: rawDate.toDateString().split(" ")[0],
          Expense: 0,
          Revenue: revenue.amount,
          rawDate,
        };
      } else {
        combinedData[formattedDate].Revenue += revenue.amount;
      }
    });

    transformedData = Object.values(combinedData);
    transformedData.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

    console.log("COMBINED_DATA for lineChart --> ", combinedData);
    console.log("TRANSFORMED_DATA for lineChart --> ", transformedData);
  }

  //? Dynamic chart components
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255, 0.1)" }} />
        <DataComponent
          type="monotone"
          dataKey="Revenue"
          stroke="#6366f1"
          fill="#6366f1"
          strokeWidth="2px"
          activeDot={{
            r: 8, // dot size - radius
            style: { fill: "#6366f1", stroke: "#6366f1", opacity: 0.65 }, // line chart hover dot
          }}
        />
        <DataComponent
          type="monotone"
          dataKey="Expense"
          stroke={isLightMode ? "#383838" : "darkGray"}
          fill={isLightMode ? "#383838" : "darkGray"}
          style={{ opacity: 0.55 }} // expense line color
          strokeWidth="2px"
          activeDot={{
            r: 6,
            style: { fill: "var(--theme-primary)", opacity: 0.35 },
          }}
        />
        <CartesianGrid strokeDasharray="4 4" stroke="transparent" />
        <XAxis
          dataKey="day"
          className="text-sm font-medium mt-10"
          tickLine={false}
          axisLine={true}
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
