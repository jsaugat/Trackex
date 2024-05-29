import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  ServerOff,
  Users,
  UserCheck,
  AlignStartVertical,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import NoRecords from "@/components/NoRecords";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetTopCustomersQuery, useGetTopSellingCategoriesByRevenueQuery, useGetTopSellingProductsByQuantityQuery,
  useGetTopSellingProductsByRevenueQuery
} from "@/slices/api/topStats.api";
import { setTopCustomers, setTopProductsByQuantity, setTopProductsByRevenue, setTopCategoriesByRevenue } from "@/slices/topStats";
import GradientBorder from '@/components/GradientBorder';
import CardContainer from '@/components/Card/Container';
import MyTooltip from '@/components/MyTooltip';


export default function TopStats() {
  //? Local States
  const [mode, setMode] = useState("products");
  const [toggleType, setToggleType] = useState("revenue");

  //? RTK Queries
  const { data: fetchedTopCustomers, refetch: refetchTopCustomers } = useGetTopCustomersQuery();
  const { data: fetchedTopSellingProductsByQuantity, refetch: refetchTopSellingProductsByQuantity } = useGetTopSellingProductsByQuantityQuery();
  const { data: fetchedTopSellingProductsByRevenue, refetch: refetchTopSellingProductsByRevenue } = useGetTopSellingProductsByRevenueQuery();
  const { data: fetchedTopSellingCategoriesByRevenue, refetch: refetchTopSellingCategoriesByRevenue } = useGetTopSellingCategoriesByRevenueQuery();
  //? RTK Store
  const topCustomers = useSelector(state => state.topStats.topCustomers || []);
  const topProductsByQuantity = useSelector(state => state.topStats.topProductsByQuantity || []);
  const topProductsByRevenue = useSelector(state => state.topStats.topProductsByRevenue || []);
  const topCategoriesByRevenue = useSelector(state => state.topStats.topCategoriesByRevenue || []);
  //? Hooks
  const dispatch = useDispatch();

  //? Side Effects
  useEffect(() => {
    if (!fetchedTopCustomers || !fetchedTopSellingProductsByQuantity || !fetchedTopSellingProductsByRevenue) return;
    dispatch(setTopCustomers(fetchedTopCustomers));
    dispatch(setTopProductsByQuantity(fetchedTopSellingProductsByQuantity));
    dispatch(setTopProductsByRevenue(fetchedTopSellingProductsByRevenue));
    dispatch(setTopCategoriesByRevenue(fetchedTopSellingCategoriesByRevenue));
    console.log("TOP CATEGOREIS: ", topCategoriesByRevenue)
    //* NOTE: THESE DEPENDENCIES CONTRIBUTE IN INSTANT RENDERING OF TOP STATS AFTER ADDITION OF PRODUCTS
  }, [dispatch, fetchedTopCustomers, fetchedTopSellingProductsByQuantity, fetchedTopSellingProductsByRevenue, fetchedTopSellingCategoriesByRevenue])

  //? Mode Toggle Handler
  const handleModeToggle = (newMode) => {
    setMode(newMode);
  }
  //? Array of modes
  const modes = ["products", "customers", "categories"];

  return (
    <GradientBorder
      radius="3xl"
      className="dark:bg-gradient-to-r hover:dark:via-primary/40 hover:dark:bg-gradient-to-bl"
    >
      <CardContainer className="relative pb-0 min-h-full max-h-[20rem] border dark:border-transparent justify-start">
        {/* blur bottom */}
        <div className="absolute left-[2%] bottom-0 mx-auto w-[98%] h-9 bg-gradient-to-b from-transparent via-background to-background" />
        {/* Header */}
        <header className="flex justify-between" >
          {/* Title */}

          <h3 className="mb-1 text-xl flex items-center gap-2">
            {mode === "products" && <Package className="size-6" />}
            {mode === "customers" && <Users className="size-6" />}
            {mode === "categories" && <AlignStartVertical className="size-5" />}
            <span>
              {mode === "products" && "Top-selling products"}
              {mode === "customers" && "Top customers"}
              {mode === "categories" && "Top categories"}
            </span>
          </h3>
          {/* //? Filters */}
          <section className="w-fit flex items-center gap-3" >
            {mode === "products" && (
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={toggleType}
                onValueChange={(value) => { if (value) setToggleType(value) }}
                className="p-1 border rounded-full"
              >
                <ToggleGroupItem value="revenue" className="rounded-full space-x-2">
                  <TrendingUp className="size-4" /><span>Revenue</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="quantity" className="rounded-full space-x-2">
                  <BarChart2 className="size-4" /><span>Quantity</span>
                </ToggleGroupItem>
              </ToggleGroup>
            )}
            {/* //? Separator */}
            <div className="h-7 w-[1px] bg-border" />
            {/* //? Mode Switch */}
            <>
              {modes
                .filter(m => m !== mode) // loop through inactive modes and render the Togglers
                .map(m => (
                  <Toggler mode={m} handleModeToggle={handleModeToggle} />
                ))
              }
            </>

          </section>
        </header>
        {mode === "products" && (
          <TopSellingProducts
            topProductsByQuantity={topProductsByQuantity}
            topProductsByRevenue={topProductsByRevenue}
            toggleType={toggleType}
          />
        )}
        {mode === "customers" && (
          <TopCustomers topCustomers={topCustomers} />
        )}
        {mode === "categories" && (
          <TopCategories topCategoriesByRevenue={topCategoriesByRevenue} />
        )}
      </CardContainer>
    </GradientBorder>
  )
}

//? Toggler Button
const Toggler = ({ mode, handleModeToggle }) => {
  return (
    <MyTooltip
      trigger={
        <Button
          variant="outline"
          size="icon"
          className="rounded-full flex items-center justify-center"
          onClick={() => handleModeToggle(mode)}
        >
          {mode === "products" && <Package className="size-4" />}
          {mode === "customers" && <Users className="size-4" />}
          {mode === "categories" && <AlignStartVertical className="size-4" />}
        </Button>
      }
      content="Top Customers"
      side="top"
    />

  )
}

//? Top Stats
const TopSellingProducts = ({ topProductsByQuantity, topProductsByRevenue, toggleType }) => {
  const topProducts = toggleType === "revenue" ? topProductsByRevenue : topProductsByQuantity;
  return (
    <>
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
              <section key={data.description} className="py-2 border-b flex justify-between items-end" >
                {/* description */}
                <div className="flex items-center gap-3">
                  <span>
                    {data._id.description}
                  </span>
                  <span className="w-fit px-2 text-sm text-muted-foreground border rounded-full">
                    {data._id.category}
                  </span>
                </div>
                {/* count */}
                <div className="px-2 border rounded-xl flex items-center gap-2" >
                  <span className="text-muted-foreground" >
                    {
                      toggleType === "revenue"
                        ? <span className="text-sm" >NPR </span>
                        : <BarChart2 className="size-4" />
                    }
                  </span>
                  <span>
                    {count === data.totalRevenue ? `+ ${count.toLocaleString()}` : count}
                  </span>
                </div>
              </section>)
          }
          )) : (<NoRecords
            missingThing="sales"
            icon={ServerOff}
            className="top-[1.45rem]"
          />)
        }
      </section >
    </>
  )
}
const TopCustomers = ({ topCustomers }) => (<>
  {/* Body */}
  <section
    className={cn(
      "flex-auto h-[20rem] w-full pr-3 overflow-y-scroll",
      topCustomers?.length === 0 && "flex items-start"
    )}
  >
    <div className="w-fit ml-auto text-muted-foreground text-sm">Total spent</div>
    {topCustomers?.length > 0 ? (
      topCustomers.map((data, idx) => {
        return (
          <div className="mb-2 flex items-center justify-between">
            <section key={data.idx} className="flex items-center gap-2" >
              {/* Customer Icon */}
              <figure className="h-10 w-10 rounded-full bg-secondary dark:bg-foreground p-1">
                <img
                  width={200}
                  height={200}
                  src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${data._id}`}
                  alt="avatar"
                />
              </figure>
              {/* Customer Name */}
              <div >
                {data._id}
              </div>
            </section>
            {/* Total spent */}
            <span className="px-2 border rounded-full">+ {data.totalRevenue.toLocaleString()}</span>
          </div>
        )
      })) : (<NoRecords
        missingThing="customer"
        icon={ServerOff}
        className="top-[1.45rem]"
      />)
    }
  </section>
</>
)
const TopCategories = ({ topCategoriesByRevenue }) => (<>
  {/* Body */}
  <section
    className={cn(
      "flex-auto h-[20rem] w-full pr-3 overflow-y-scroll",
      topCategoriesByRevenue?.length === 0 && "flex items-start"
    )}
  >
    <div className="w-fit ml-auto text-muted-foreground text-sm"></div>
    {topCategoriesByRevenue?.length > 0 ? (
      topCategoriesByRevenue.map((data, idx) => {
        return (
          <div className="py-1 border-b flex items-center justify-between">
            <section key={data.idx} className="flex items-center gap-2" >
              {/* Customer Name */}
              <section className="flex items-center gap-2">
                <div className="p-1 w-fit border rounded-full">{data.icon}</div>
                {data.category}
              </section>
            </section>
            {/* Total spent */}
            <span className="px-2 border rounded-full flex gap-2">
              <span className="text-muted-foreground" >NPR</span>
              <span>+ {data.totalRevenue.toLocaleString()}</span>
            </span>
          </div>
        )
      })) : (
      <NoRecords
        missingThing="categories"
        icon={ServerOff}
        className="top-[1.45rem]"
      />)
    }
  </section>
</>
)