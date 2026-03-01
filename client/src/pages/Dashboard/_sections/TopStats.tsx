import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  ServerOff,
  Users,
  UserCheck,
  AlignStartVertical,
  BarChart2,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import NoRecords from "@/components/NoRecords";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetTopCustomersQuery,
  useGetTopSellingCategoriesByRevenueQuery,
  useGetTopSellingProductsByQuantityQuery,
  useGetTopSellingProductsByRevenueQuery,
} from "@/slices/api/topStats.api";
import {
  setTopCustomers,
  setTopProductsByQuantity,
  setTopProductsByRevenue,
  setTopCategoriesByRevenue,
} from "@/slices/topStats";
import GradientBorder from "@/components/GradientBorder";
import CardContainer from "@/components/Card/Container";
import MyTooltip from "@/components/MyTooltip";

export default function TopStats() {
  //? Local States
  const [mode, setMode] = useState("products");
  const [toggleType, setToggleType] = useState("revenue");

  //? RTK Queries
  const { data: fetchedTopCustomers, refetch: refetchTopCustomers } =
    useGetTopCustomersQuery();
  const {
    data: fetchedTopSellingProductsByQuantity,
    refetch: refetchTopSellingProductsByQuantity,
  } = useGetTopSellingProductsByQuantityQuery();
  const {
    data: fetchedTopSellingProductsByRevenue,
    refetch: refetchTopSellingProductsByRevenue,
  } = useGetTopSellingProductsByRevenueQuery();
  const {
    data: fetchedTopSellingCategoriesByRevenue,
    refetch: refetchTopSellingCategoriesByRevenue,
  } = useGetTopSellingCategoriesByRevenueQuery();
  //? RTK Store
  const topCustomers = useSelector(
    (state: any) => state.topStats.topCustomers || [],
  );
  const topProductsByQuantity = useSelector(
    (state: any) => state.topStats.topProductsByQuantity || [],
  );
  const topProductsByRevenue = useSelector(
    (state: any) => state.topStats.topProductsByRevenue || [],
  );
  const topCategoriesByRevenue = useSelector(
    (state: any) => state.topStats.topCategoriesByRevenue || [],
  );
  //? Hooks
  const dispatch = useDispatch();

  //? Side Effects
  useEffect(() => {
    if (
      !fetchedTopCustomers ||
      !fetchedTopSellingProductsByQuantity ||
      !fetchedTopSellingProductsByRevenue
    )
      return;
    dispatch(setTopCustomers(fetchedTopCustomers));
    dispatch(setTopProductsByQuantity(fetchedTopSellingProductsByQuantity));
    dispatch(setTopProductsByRevenue(fetchedTopSellingProductsByRevenue));
    dispatch(setTopCategoriesByRevenue(fetchedTopSellingCategoriesByRevenue));
    console.log("TOP CATEGOREIS: ", topCategoriesByRevenue);
    //* NOTE: THESE DEPENDENCIES CONTRIBUTE IN INSTANT RENDERING OF TOP STATS AFTER ADDITION OF PRODUCTS
  }, [
    dispatch,
    fetchedTopCustomers,
    fetchedTopSellingProductsByQuantity,
    fetchedTopSellingProductsByRevenue,
    fetchedTopSellingCategoriesByRevenue,
  ]);

  //? Mode Cycle Handler
  const cycleMode = () => {
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };
  //? Array of modes
  const modes = ["products", "customers", "categories"];
  const productsFilterOptions = [
    { id: "revenue", icon: TrendingUp },
    { id: "quantity", icon: BarChart2 },
  ];

  return (
    <GradientBorder
      radius="3xl"
      className="dark:bg-gradient-to-r hover:dark:via-primary/40 hover:dark:bg-gradient-to-bl"
    >
      <CardContainer className="relative pb-2 min-h-full max-h-[20rem] border dark:border-transparent justify-start">
        {/* blur bottom */}
        <div className="absolute left-[1%] bottom-0 rounded-b-full mx-auto w-[98%] h-9 bg-gradient-to-b from-transparent via-background to-background" />
        {/* Header */}
        <header className="flex justify-between items-center mb-1">
          {/* Title and Cycle Button */}
          <div className="flex items-center gap-2">
            <h3 className="text-xl flex items-center gap-2">
              {mode === "products" && <Package className="size-5" />}
              {mode === "customers" && <Users className="size-5" />}
              {mode === "categories" && (
                <AlignStartVertical className="size-5" />
              )}
              <span>
                {mode === "products" && "Top selling products"}
                {mode === "customers" && "Top spending customers"}
                {mode === "categories" && "Top selling categories"}
              </span>
            </h3>
            <MyTooltip
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full size-8"
                  onClick={cycleMode}
                >
                  <Repeat className="size-4" />
                </Button>
              }
              content="Switch view"
              side="top"
            />
          </div>

          {/* //? Filters (Revenue/Quantity) */}
          <section className="w-fit flex items-center gap-3">
            {mode === "products" && (
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={toggleType}
                onValueChange={(value) => {
                  if (value) setToggleType(value);
                }}
                className="p-1 border rounded-full"
              >
                {productsFilterOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.id}
                    value={option.id}
                    className={cn(
                      "h-[1.65rem] border-none rounded-full space-x-2",
                      toggleType !== option.id &&
                        "text-muted-foreground hover:bg-transparent",
                    )}
                  >
                    <option.icon className="size-4" />
                    <span className="capitalize">{option.id}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          </section>
        </header>
        {mode === "products" && (
          <TopSellingProducts
            topProductsByQuantity={topProductsByQuantity}
            topProductsByRevenue={topProductsByRevenue}
            toggleType={toggleType}
          />
        )}
        {mode === "customers" && <TopCustomers topCustomers={topCustomers} />}
        {mode === "categories" && (
          <TopCategories topCategoriesByRevenue={topCategoriesByRevenue} />
        )}
      </CardContainer>
    </GradientBorder>
  );
}

//? Top Stats
const TopSellingProducts = ({
  topProductsByQuantity,
  topProductsByRevenue,
  toggleType,
}) => {
  const topProducts =
    toggleType === "revenue" ? topProductsByRevenue : topProductsByQuantity;
  return (
    <>
      <section
        className={cn(
          "flex-auto h-full w-full pr-3 overflow-y-scroll",
          topProducts?.length === 0 && "flex items-start justify-center",
        )}
      >
        {topProducts?.length > 0 ? (
          topProducts.map((data) => {
            const count = data.totalRevenue || data.totalQuantity;
            return (
              <section
                key={data.description}
                className="py-2 border-b flex justify-between items-end"
              >
                {/* description */}
                <div className="flex items-center gap-3">
                  <span>{data._id.description}</span>
                  <span className="w-fit px-2 text-sm text-muted-foreground border rounded-full">
                    {data._id.category}
                  </span>
                </div>
                {/* count */}
                <div className="px-2 border rounded-xl flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {toggleType === "revenue" ? (
                      <span className="text-sm">NPR </span>
                    ) : (
                      <BarChart2 className="size-4" />
                    )}
                  </span>
                  <span>
                    {count === data.totalRevenue
                      ? `+ ${count.toLocaleString()}`
                      : count}
                  </span>
                </div>
              </section>
            );
          })
        ) : (
          <NoRecords missingThing="sales" icon={ServerOff} />
        )}
      </section>
    </>
  );
};
const TopCustomers = ({ topCustomers }) => (
  <>
    {/* Body */}
    <section
      className={cn(
        "flex-auto h-[20rem] w-full pr-3 overflow-y-scroll",
        topCustomers?.length === 0 && "flex items-start justify-center",
      )}
    >
      {/* <div className="w-fit ml-auto text-muted-foreground text-sm">Total spent</div> */}
      {topCustomers?.length > 0 ? (
        topCustomers.map((data, idx) => {
          return (
            <div className="mb-2 flex items-center justify-between">
              <section key={data.idx} className="flex items-center gap-2">
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
                <div>{data._id}</div>
              </section>
              {/* Total spent */}
              <p className="px-2 border rounded-full space-x-1">
                <span className="text-muted-foreground text-sm">NPR </span>
                <span>+ {data.totalRevenue.toLocaleString()}</span>
              </p>
            </div>
          );
        })
      ) : (
        <NoRecords missingThing="customer" icon={ServerOff} />
      )}
    </section>
  </>
);
const TopCategories = ({ topCategoriesByRevenue }) => (
  <>
    {/* Body */}
    <section
      className={cn(
        "flex-auto h-[20rem] w-full pr-3 overflow-y-scroll",
        topCategoriesByRevenue?.length === 0 &&
          "flex items-start justify-center",
      )}
    >
      <div className="w-fit ml-auto text-muted-foreground text-sm"></div>
      {topCategoriesByRevenue?.length > 0 ? (
        topCategoriesByRevenue.map((data, idx) => {
          return (
            <div className="py-1 border-b flex items-center justify-between">
              <section key={data.idx} className="flex items-center gap-2">
                {/* Category */}
                <section className="flex items-center gap-2">
                  <div className="p-1 w-fit border rounded-full">
                    {data.icon}
                  </div>
                  {data.category}
                </section>
              </section>
              <span className="px-2 border rounded-full flex items-center gap-2">
                <span className="text-muted-foreground text-sm">NPR </span>
                <span>+ {data.totalRevenue.toLocaleString()}</span>
              </span>
            </div>
          );
        })
      ) : (
        <NoRecords missingThing="categories" icon={ServerOff} />
      )}
    </section>
  </>
);
