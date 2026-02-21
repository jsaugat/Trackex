import React, { useEffect, useMemo, useState } from "react";
import Card from "@/pages/Dashboard/_components/Card";
import { default as CardContainer } from "@/components/Card/Container";
import SaleRow from "@/pages/Dashboard/_components/SaleRow";
import GradientBorder from "@/components/GradientBorder";
import { useSelector } from "react-redux";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ServerOff,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NewTransactionCard from "./_components/NewTransactionCard";
import useFinancialSummary from "@/hooks/useFinancialSummary";
import NoRecords from "@/components/NoRecords";
import Overview from "./_sections/Overview";
import TopStats from "./_sections/TopStats";

// const cardData = [
//   {
//     label: "Total Revenue",
//     amount: `45231.89`,
//     description: "+20.1% from last month",
//     icon: TrendingUp,
//     theme: "#5197ff",
//   },
//   {
//     label: "Total Expense",
//     amount: "3000",
//     description: "+180.1% from last month",
//     icon: TrendingDown,
//     iconColor: "orange",
//     theme: "#FB7185",
//   },
//   {
//     label: "Current Balance",
//     amount: "42231.89",
//     description: "+19% from last month",
//     icon: Wallet,
//     theme: "#4ceeb5",
//   },
// ];

export default function Dashboard() {
  //? Redux store.
  const userInfo = useSelector((state) => state.auth.userInfo || []); // for auth
  const salesData = useSelector((state) => state.revenue.data || []);
  const expensesData = useSelector((state) => state.expenses.data || []);
  //? Hooks
  const { totalRevenue, totalExpense, totalBalance } = useFinancialSummary();

  useEffect(() => {
    console.log("salesData", salesData);
    console.log("totalRevenue ", totalRevenue);
  }, [salesData, userInfo?._id]);

  //? State for card data
  const [cardData, setCardData] = useState([
    {
      label: "Total Revenue",
      amount: "",
      description: "",
      icon: TrendingUp,
      theme: "#6366f1", // indigo-500
    },
    {
      label: "Total Expense",
      amount: "",
      description: "+20.1% from last month",
      icon: TrendingDown,
      iconColor: "orange",
      theme: "#f43f5e", // rose-500
    },
    {
      label: "Balance",
      amount: "",
      description: "",
      icon: Wallet,
      theme: "#4ade80", // green
      // theme: "#84cc16", // lime
      // theme: "#6366f1", // indigo
    },
  ]);

  // Update card data when total revenue, total expense, or total balance changes
  useEffect(() => {
    setCardData((prevCardData) => [
      {
        ...prevCardData[0],
        amount: totalRevenue,
        description: `You have sold ${salesData?.length} ${salesData?.length !== 1 ? "items" : "item"
          }.`,
      },
      {
        ...prevCardData[1],
        amount: totalExpense,
      },
      {
        ...prevCardData[2],
        amount: totalBalance,
        description:
          totalBalance >= 0
            ? "Your profit margins are up."
            : "Your balance is negative.",
      },
    ]);
  }, [totalRevenue, totalExpense, totalBalance]);

  return (
    <main className="flex flex-col h-full">
      {/* <main className=""> */}
      {/* Upper Section */}
      <section className="mb-4 grid grid-cols-3 gap-4 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {/* New Transaction */}
        <NewTransactionCard />
        {/* Revenue, Expense, Balance */}
        {cardData.map((data, idx) => (
          <Card
            key={idx}
            amount={data.amount}
            description={data.description}
            icon={data.icon}
            label={data.label}
            theme={data.theme}
          />
        ))}
      </section>

      {/* Lower section */}
      <section className="h-full flex-auto grid grid-cols-1 lg:grid-cols-2 gap-4 transition-all">
        {/* //? Chart */}
        <Overview salesData={salesData} expensesData={expensesData} />

        {/* //?Recent Sales */}
        {/* <RecentSales salesData={salesData} /> */}

        {/* //?Top Stats */}
        <TopStats />

        {/* </main> */}
      </section>
    </main>
  );
}

//? Recent Sales
const RecentSales = ({ salesData }) => (
  <GradientBorder
    radius="3xl"
    className="dark:bg-gradient-to-r hover:dark:via-primary/40 hover:dark:bg-gradient-to-bl"
  >
    {/* //!! CardContainer already has flex and flex-col */}
    <CardContainer className="min-h-full border dark:border-transparent justify-start">
      <div className="">
        <h3 className="text-xl">Recent Sales</h3>
        <div className="text-sm text-muted-foreground mb-1">
          You made {salesData?.length}{" "}
          {salesData?.length === 1 ? "sale" : "sales"}.
        </div>
      </div>
      <section
        className={cn(
          "flex-auto h-[20rem] w-full pr-3 overflow-y-scroll",
          salesData?.length === 0 && "flex items-start"
        )}
      >
        {salesData?.length > 0 ? (
          salesData.map(
            (
              { customer: customerName, amount, date, description },
              idx
            ) => (
              <SaleRow
                key={idx}
                date={date}
                customer={customerName}
                description={description}
                // email={`${customerName
                //   ?.replace(/\s+/g, "")
                //   .toLowerCase()}@gmail.com`}
                saleAmount={amount}
              />
            )
          )
        ) : (
          <NoRecords
            missingThing="sales"
            icon={ServerOff}
            className="top-[1.45rem]"
          />
        )}
      </section>
    </CardContainer>
  </GradientBorder>
)
