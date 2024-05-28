import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  PackagePlus,
  ServerOff,
  Users,
  UserCheck,
  ArrowLeftRight,
  BarChart2,
  Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import NoRecords from "@/components/NoRecords";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetTopCustomersQuery, useGetTopSellingProductsByQuantityQuery,
  useGetTopSellingProductsByRevenueQuery
} from "@/slices/api/topStats.api";
import { setTopCustomers, setTopProductsByQuantity, setTopProductsByRevenue } from "@/slices/topStats";
import GradientBorder from '@/components/GradientBorder';
import CardContainer from '@/components/Card/Container';


export default function TopStats() {
  //? Local States
  const [mode, setMode] = useState("products");
  const [toggleType, setToggleType] = useState("revenue");

  //? RTK Queries
  const { data: fetchedTopCustomers, refetch: refetchTopCustomers } = useGetTopCustomersQuery();
  const { data: fetchedTopSellingProductsByQuantity, refetch: refetchTopSellingProductsByQuantity } = useGetTopSellingProductsByQuantityQuery();
  const { data: fetchedTopSellingProductsByRevenue, refetch: refetchTopSellingProductsByRevenue } = useGetTopSellingProductsByRevenueQuery();
  //? RTK Store
  const topCustomers = useSelector(state => state.topStats.topCustomers || []);
  const topProductsByQuantity = useSelector(state => state.topStats.topProductsByQuantity || []);
  const topProductsByRevenue = useSelector(state => state.topStats.topProductsByRevenue || []);
  //? Hooks
  const dispatch = useDispatch();

  //? Side Effects
  useEffect(() => {
    if (!fetchedTopCustomers || !fetchedTopSellingProductsByQuantity || !fetchedTopSellingProductsByRevenue) return;
    dispatch(setTopCustomers(fetchedTopCustomers));
    dispatch(setTopProductsByQuantity(fetchedTopSellingProductsByQuantity));
    dispatch(setTopProductsByRevenue(fetchedTopSellingProductsByRevenue));
  }, [dispatch, fetchedTopCustomers, fetchedTopSellingProductsByQuantity, fetchedTopSellingProductsByRevenue])

  //? Mode Switch Handler
  const handleModeSwitch = () => {
    if (mode === "products") {
      setMode("customers");
    } else {
      setMode("products");
    }
  }

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
            <PackagePlus className="size-6" />
            <span>
              {mode === "products" && "Top-selling products"}
              {mode === "customers" && "Top customers"}
            </span>
          </h3>
          {/* Filters */}
          <section className="w-fit flex items-center gap-2" >
            {mode === "products" && (
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={toggleType}
                onValueChange={(value) => { if (value) setToggleType(value) }}>
                <ToggleGroupItem value="revenue" className="rounded-full space-x-2">
                  <Gem className="size-4" /><span>Revenue</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="quantity" className="rounded-full space-x-2">
                  <BarChart2 className="size-4" /><span>Quantity</span>
                </ToggleGroupItem>
              </ToggleGroup>
            )}
            <Button onClick={handleModeSwitch} variant="outline" size="icon" className="rounded-full" >
              <ArrowLeftRight className="size-4" />
            </Button>
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
      </CardContainer>
    </GradientBorder>
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