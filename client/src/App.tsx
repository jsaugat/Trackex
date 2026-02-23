import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
/* Components */
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header";
import { cn } from "./lib/utils";
import { useGetAllRevenueQuery } from "./slices/api/revenue.api";
import { useGetAllExpensesQuery } from "./slices/api/expenses.api";
import { addFetchedExpenses } from "./slices/expensesSlice";
import { addFetchedRevenue } from "./slices/revenueSlice";
import { SidebarProvider } from "@/context/useSidebar";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  const { data: allRevenue, refetch: refetchRevenue } =
    useGetAllRevenueQuery(undefined);
  const { data: allExpenses, refetch: refetchExpenses } =
    useGetAllExpensesQuery(undefined);
  const dispatch = useDispatch();

  useEffect(() => {
    refetchRevenue();
    refetchExpenses();
    dispatch(addFetchedRevenue(allRevenue));
    dispatch(addFetchedExpenses(allExpenses));
  }, [allExpenses, allRevenue]);

  return (
    <SidebarProvider>
      {/* Whole App */}
      <main className="relative bg-linear-to-r from-indigo-100 to-background dark:bg-linear-to-r dark:from-black dark:via-secondary/40 dark:to-background flex justify-between h-screen">
        <Sidebar />

        {/* Main Section */}
        <main
          className={cn(
            "relative z-2 h-full md:h-[calc(100vh-1.5rem)] m-1 md:m-3 px-5 md:px-7 py-5 md:py-7 w-full flex-1 border-2 border-white dark:border-border rounded-lg md:rounded-3xl shadow-lg shadow-indigo-300 dark:shadow-none ",
            "bg-linear-to-b from-background via-indigo-200 to-background ",
            "dark:bg-linear-to-br dark:from-background dark:via-muted/5 dark:to-muted/30 dark:to-90%",
            "flex flex-col",
          )}
        >
          <Header />
          {/* HEADER  */}
          <main className="app-outlet-container h-full pb-2 dark:pb-0 overflow-x-hidden overflow-y-scroll">
            <Outlet /> {/* BODY */}
          </main>
        </main>
      </main>
      <Analytics /> {/* Vercel Analytics */}
    </SidebarProvider>
  );
}
