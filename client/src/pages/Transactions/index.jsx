import React, { useEffect } from "react";
import Form from "./_archive/Form";
import RecentTransactions from "./_components/RecentTransactions";
//? Redux Toolkit
import { useDispatch } from "react-redux";
import { useGetAllExpensesQuery } from "@/slices/api/expenses.api.js";
import { useGetAllRevenueQuery } from "@/slices/api/revenue.api.js";
import { addExpenseLocally } from "@/slices/expensesSlice";
import { addRevenueLocally } from "@/slices/revenueSlice";
import NewTransactionCard from "../Dashboard/_components/NewTransactionCard";
import { Card } from "@/components/ui/card";
import CardContainer from "@/components/Card/Container";
import { ToggleLeft } from "lucide-react";
import DoughnutChart from "@/components/Charts/Doughnut/DoughnutChart";
import CustomActivePieChart from "@/components/Charts/CustomActivePieChart";
import TwoLevelPieChart from "@/components/Charts/TwoLevelPieChart";

export default function Transactions() {
  const dispatch = useDispatch();

  return (
    <main className="relative h-full overflow-hidden">
      <section className="h-full w-full flex flex-col lg:flex-row gap-4 items-start justify-start">
        {/* //? CHARTS */}
        <aside className="min-h-full max-h-[20rem] flex flex-col gap-4">
          {/* <NewTransactionCard /> */}
          <CardContainer className="flex">
            {/* Header */}
            {/* DOUGHNUT Chart */}
            <DoughnutChart />
          </CardContainer>
        </aside>

        {/* //? TABLE */}
        <RecentTransactions />
      </section>
    </main>
  );
}

// Recharts > CustomActivePieChart
{
  /* <CardContainer>
  <h3 className="flex items-center gap-3">
    <Gauge className="size-5" /> Expenses By Category
  </h3>
  <div className="flex items-center justify-center">
    <CustomActivePieChart />
  </div>
</CardContainer>; */
}
