import React, { useEffect, useMemo, useState } from "react";
import Card from "@/pages/Dashboard/_components/Card";
import { default as CardContainer } from "@/components/Card/Container";
import SaleRow from "@/pages/Dashboard/_components/SaleRow";
import GradientBorder from "@/components/GradientBorder";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
import { useGetTopCustomersQuery, useGetTopSellingProductsByQuantityQuery, useGetTopSellingProductsByRevenueQuery } from "@/slices/api/topStats.api";
import { useDispatch } from "react-redux";
import { setTopCustomers, setTopProductsByQuantity, setTopProductsByRevenue } from "@/slices/topStats";
import OverviewSection from "./_sections/OverviewSection";

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
  //? RTK Queries
  const { data: fetchedTopCustomers, refetch: refetchTopCustomers } = useGetTopCustomersQuery();
  const { data: fetchedTopSellingProductsByQuantity, refetch: refetchTopSellingProductsByQuantity } = useGetTopSellingProductsByQuantityQuery();
  const { data: fetchedTopSellingProductsByRevenue, refetch: refetchTopSellingProductsByRevenue } = useGetTopSellingProductsByRevenueQuery();
  //? Redux store.
  const { _id } = useSelector((state) => state.auth.userInfo); // for auth
  const salesData = useSelector((state) => state.revenue.data || []);
  const expensesData = useSelector((state) => state.expenses.data || []);
  const idk = useSelector((state) => state.topStats);
  const topCustomers = useSelector(state => state.topStats.topCustomers || []);
  const topProductsByQuantity = useSelector(state => state.topStats.topProductsByQuantity || []);
  const topProductsByRevenue = useSelector(state => state.topStats.topProductsByRevenue || []);
  //? Hooks
  const { totalRevenue, totalExpense, totalBalance } = useFinancialSummary();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("salesData", salesData);
    console.log("totalRevenue ", totalRevenue);
  }, [salesData, _id]);

  useEffect(() => {
    if (!fetchedTopCustomers || !fetchedTopSellingProductsByQuantity || !fetchedTopSellingProductsByRevenue) return;
    dispatch(setTopCustomers(fetchedTopCustomers));
    dispatch(setTopProductsByQuantity(fetchedTopSellingProductsByQuantity));
    dispatch(setTopProductsByRevenue(fetchedTopSellingProductsByRevenue));
  }, [dispatch, fetchedTopCustomers, fetchedTopSellingProductsByQuantity, fetchedTopSellingProductsByRevenue])

  console.log("idk", idk)
  console.log("topCustomers", topCustomers);
  console.log("topProductsByQuantity", topProductsByQuantity);
  console.log("topProductsByRevenue", topProductsByRevenue);

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
        <OverviewSection salesData={salesData} expensesData={expensesData} />

        {/* //?Recent Sales */}
        {/* <RecentSales salesData={salesData} /> */}

        {/* //?Top Stats */}
        <section className="topStats grid grid-cols-2 gap-4">
          <TopSellingProducts
            topProductsByQuantity={topProductsByQuantity}
            topProductsByRevenue={topProductsByRevenue}
          />
          <TopCustomers topCustomers={topCustomers} />
        </section>

      </section>
      {/* </main> */}
    </main>
  );
}

//? Top Stats
const TopSellingProducts = ({ topProductsByQuantity, topProductsByRevenue }) => {
  const [toggleType, setToggleType] = useState("revenue");
  const topProducts = toggleType === "revenue" ? topProductsByRevenue : topProductsByQuantity;

  return (
    <GradientBorder
      radius="3xl"
      className="dark:bg-gradient-to-r hover:dark:via-primary/40 hover:dark:bg-gradient-to-bl"
    >
      <CardContainer className="min-h-full max-h-[20rem] border dark:border-transparent justify-start">
        <div className="">
          <h3 className="mb-1 text-xl flex items-center gap-2">
            <TrendingUp className="size-5" />
            <span>Top-selling products</span>
          </h3>
          <section className="w-fit">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={toggleType}
              onValueChange={(value) => { if (value) setToggleType(value) }}>
              <ToggleGroupItem value="revenue" className="rounded-full">Revenue</ToggleGroupItem>
              <ToggleGroupItem value="quantity" className="rounded-full">Quantity</ToggleGroupItem>
            </ToggleGroup>
          </section>
        </div>
        <section
          className={cn(
            "flex-auto h-full w-full pr-3 overflow-y-scroll",
            topProducts?.length === 0 && "flex items-start"
          )}
        >
          {topProducts?.length > 0 ? (
            topProducts.map(data => {
              const count = data.totalRevenue || data.totalQuantity;
              return (
                <section key={data.description} className="py-2 border-b flex justify-between items-center" >
                  {/* description */}
                  <div className="grid">
                    {data._id.description}
                    <span className="text-xs text-muted-foreground">
                      {data._id.category}
                    </span>
                  </div>
                  {/* count */}
                  <div className="px-2 border rounded-xl" >
                    {toggleType === "revenue" ? <span className="text-sm text-muted-foreground" >NPR </span> : ""}
                    {count === data.totalRevenue ? count.toLocaleString() : count}
                  </div>
                </section>)
            }
            )) : (<NoRecords
              missingThing="sales"
              icon={ServerOff}
              className="top-[1.45rem]"
            />)
          }
        </section>
      </CardContainer>
    </GradientBorder>
  )
}
const TopCustomers = ({ topCustomers }) => (
  <GradientBorder
    radius="3xl"
    className="dark:bg-gradient-to-r hover:dark:via-primary/40 hover:dark:bg-gradient-to-bl"
  >
    <CardContainer className="min-h-full border dark:border-transparent justify-start">
      <div className="">
        <h3 className="text-xl flex items-center gap-2">
          <Users className="size-4" />
          <span>Top clients</span>
        </h3>
      </div>
      <section
        className={cn(
          "flex-auto h-[20rem] w-full pr-3 overflow-y-scroll",
          topCustomers?.length === 0 && "flex items-start"
        )}
      >
        {topCustomers?.length > 0 ? (
          topCustomers.map((data, idx) => {
            return (
              <div className="mb-2 flex items-center justify-between">
                <section key={data.idx} className="flex items-center gap-2" >
                  <figure className="h-10 w-10 rounded-full bg-secondary dark:bg-foreground p-1">
                    <img
                      width={200}
                      height={200}
                      src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${data._id}`}
                      alt="avatar"
                    />
                  </figure>
                  <div>
                    {data._id}
                  </div>
                </section>
                <span>{data.totalRevenue.toLocaleString()}</span>
              </div>
            )
          })) : (<NoRecords
            missingThing="customer"
            icon={ServerOff}
            className="top-[1.45rem]"
          />)
        }
      </section>
    </CardContainer>
  </GradientBorder>
)

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
