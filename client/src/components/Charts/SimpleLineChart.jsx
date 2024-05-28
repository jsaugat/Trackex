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
export default function SimpleLineChart({ daysCount }) {
  const { theme } = useTheme();
  const isLightMode = theme === "light";
  const revenueData = useSelector((state) => state.revenue.data);
  const expensesData = useSelector((state) => state.expenses.data);

  let transformedData = [];

  if (expensesData && revenueData) {
    const combinedData = {};

    expensesData.forEach((expense) => {
      const date = formatDMY(expense.date);
      if (!combinedData[date]) {
        combinedData[date] = {
          name: date,
          day: new Date(date).toDateString().split(" ")[0],
          Expense: expense.amount,
          Revenue: 0,
        };
      } else {
        combinedData[date].Expense += expense.amount;
      }
    });

    revenueData.forEach((revenue) => {
      const date = formatDMY(revenue.date);
      if (!combinedData[date]) {
        combinedData[date] = {
          name: date,
          day: new Date(date).toDateString().split(" ")[0],
          Expense: 0,
          Revenue: revenue.amount,
        };
      } else {
        combinedData[date].Revenue += revenue.amount;
      }
    });

    transformedData = Object.values(combinedData);
    transformedData.sort((a, b) => new Date(a.name) - new Date(b.name));

    const daysCountNumber = parseInt(daysCount);
    transformedData = transformedData.slice(-daysCountNumber);

    console.log("COMBINED_DATA for lineChart --> ", combinedData);
    console.log("TRANSFORMED_DATA for lineChart --> ", transformedData);
  }

  return (
    <ResponsiveContainer width="100%" height="80%">
      <LineChart
        width={500}
        height={290}
        data={transformedData}
        margin={{ top: 5, right: 35, left: 20, bottom: 0 }}
      >
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="Revenue"
          stroke="#6366f1"
          strokeWidth="2px"
          activeDot={{
            r: 8,
            style: { fill: "#6366f1", stroke: "#6366f1", opacity: 0.65 },
          }}
        />
        <Line
          type="monotone"
          dataKey="Expense"
          stroke={isLightMode ? "black" : "darkGray"}
          style={{ opacity: 0.25 }}
          strokeWidth="2px"
          activeDot={{
            r: 6,
            style: { fill: "var(--theme-primary)", opacity: 0.25 },
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
      </LineChart>
    </ResponsiveContainer>
  );
}
