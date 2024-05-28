import React, { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider"; //shadcn
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
/* Components */
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { cn } from "./lib/utils";
import { useDispatch } from "react-redux";
import { useGetAllRevenueQuery } from "./slices/api/revenue.api";
import { useGetAllExpensesQuery } from "./slices/api/expenses.api";
import { addFetchedExpenses } from "./slices/expensesSlice";
import { addFetchedRevenue } from "./slices/revenueSlice";
import { SidebarProvider } from "@/context/useSidebar.jsx"

export default function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: allRevenue,
    isLoading: isFetchingAllRevenue,
    error: allRevenueError,
    refetch: refetchRevenue,
  } = useGetAllRevenueQuery();
  const {
    data: allExpenses,
    isLoading: isFetchingAllExpenses,
    error: allExpensesError,
    refetch: refetchExpenses,
  } = useGetAllExpensesQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("REVENUE, ", allRevenue);
    if (!userInfo) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    refetchRevenue();
    refetchExpenses();
    dispatch(addFetchedRevenue(allRevenue));
    dispatch(addFetchedExpenses(allExpenses));
  }, [allExpenses, allRevenue, userInfo]);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        {/* <main id="container" className=""> */}
        {/* Whole App */}
        <main className="relative bg-gradient-to-r from-indigo-100 to-background dark:bg-gradient-to-r dark:from-black dark:via-secondary/40 dark:to-background flex justify-between h-screen">
          <Sidebar />

          {/* Main Section */}
          <main
            className={cn(
              //* md:h-calc(100vh-1.5rem), in tailwind, 1.5rem = 6 units
              "relative z-[2] h-full md:h-[calc(100vh-1.5rem)] m-1 md:m-3 px-5 md:px-7 py-5 md:py-7 w-full flex-1 border-2 border-white dark:border-border rounded-lg md:rounded-3xl shadow-lg shadow-indigo-300 dark:shadow-none ",
              // BG: Light Mode
              "bg-gradient-to-b from-background via-indigo-200 to-background ",
              // BG: Dark Mode
              "dark:bg-gradient-to-br dark:from-background dark:via-muted/5 dark:to-muted/30 dark:to-90%",
              "flex flex-col"
            )}
          >
            <Header /> {/* HEADER  */}
            <main className="app-outlet-container h-full pb-2 dark:pb-0 overflow-x-hidden overflow-y-scroll">
              <Outlet /> {/* BODY */}
            </main>
          </main>
        </main>

        <Toaster />
        <SonnerToaster />
        {/* </main> */}
      </SidebarProvider>
    </ThemeProvider>
  );
}
