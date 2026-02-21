import React from "react";
import CardContainer from "../../../components/Card/Container";
import GradientBorder from "../../../components/GradientBorder";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import CountUp from "react-countup";
import useFinancialSummary from "@/hooks/useFinancialSummary";

export default function Card(props) {
  const { totalRevenue, totalExpense, totalBalance } = useFinancialSummary();
  const { theme } = useTheme();
  const isLightMode = theme === "light";
  const atProfit = totalBalance >= 0;

  return (
    <GradientBorder radius="3xl">
      <CardContainer className="border dark:border-transparent">
        <div className="relative flex justify-between">
          {/* LABEL */}
          <section className="flex items-center gap-3">
            {/* Color pill shaped indicator */}
            <div
              style={{
                backgroundColor:
                  !atProfit && props.label === "Balance" ? "gray" : props.theme,
                boxShadow: `0 0 15px ${
                  !atProfit && props.label === "Balance" ? "gray" : props.theme
                }`,
              }} // using 'style', tailwind fked up
              className="relative h-4 w-1 rounded-full"
            >
              {/* Blur effect */}
              <div
                style={{ backgroundColor: isLightMode ? "white" : props.theme }}
                className="absolute size-10 rounded-full blur-3xl opacity-80"
              />
            </div>
            <p className="text-md">{props.label}</p>
          </section>

          {/* ICON */}
          <GradientBorder
            radius={"md"}
            className="dark:bg-gradient-to-b from-primary/30 via-secondary to-transparent"
          >
            <div className="p-1.5 border dark:border-none dark:bg-neutral-950 rounded-md">
              <props.icon
                style={{
                  color:
                    !atProfit && props.label === "Balance"
                      ? "gray"
                      : props.theme,
                }}
                className="size-5 drop-shadow-[0_0px_10px_rgba(255,255,255,0.5)]"
              />
            </div>
          </GradientBorder>
        </div>

        <div className="flex flex-col gap-1">
          <section className="flex items-center gap-3">
            {/* AMOUNT */}
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span className="text-muted-foreground text-xl font-light">
                NPR{" "}
              </span>
              <p
                className={cn(
                  "text-ellipsis overflow-hidden"
                  // props.label === "Current Balance" ? "text-profit" : ""
                )}
              >
                <CountUp end={props.amount} duration={1} />
              </p>
            </h2>
            {props.label === "Balance" &&
            totalRevenue !== 0 &&
            totalExpense !== 0 ? (
              <div
                className={cn(
                  "p-1 px-2 text-sm border rounded-full",
                  "flex items-center justify-center gap-1",
                  atProfit
                    ? "text-green-500 bg-green-500/0"
                    : "text-red-500 bg-red-500/0"
                )}
              >
                {/* <span>{atProfit ? "+ " : "- "}</span> */}
                {atProfit ? (
                  <ArrowUp className="size-4" />
                ) : (
                  <ArrowDown className="size-4" />
                )}
                <span>
                  {totalBalance > 0
                    ? ((totalRevenue / totalExpense) * 100).toFixed(2)
                    : ((totalExpense / totalRevenue) * 100).toFixed(2)}
                  %
                </span>
              </div>
            ) : (
              ""
            )}
          </section>
          {/* DESCRIPTION */}
          <p className="text-xs text-muted-foreground">{props.description}</p>
        </div>
      </CardContainer>
    </GradientBorder>
  );
}
