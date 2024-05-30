import React, { useState } from 'react'
import CardContainer from '@/components/Card/Container';
import OverviewChart from '@/components/Charts/OverviewChart';
import NoRecords from '@/components/NoRecords';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChart3, LineChart, RouteOff } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import MyTooltip from '@/components/MyTooltip';
import { cn } from '@/lib/utils';

export default function Overview({ salesData, expensesData }) {
  //? Toggle last days count in line chart
  const [daysCount, setDaysCount] = useState("30");
  const [chartType, setChartType] = useState("line");
  const daysCountOptions = [7, 14, 30];

  //? Chart(type) toggle handler
  const chartToggleHandler = () => {
    if (chartType === "line") {
      setChartType("bar");
    } else {
      setChartType("line");
    }
  }


  return (
    <CardContainer className="p-7">
      <section className="text-xl w-full flex items-center justify-between">
        <h3>
          Overview{" "}
          <span className="text-sm text-muted-foreground">
          </span>
        </h3>
        <section className="text-sm flex items-center gap-3">
          {/* //? Last 7 days, 14 days, 30 days */}
          <ToggleGroup type="single" variant="outline" size="sm" value={daysCount} className="p-1 border rounded-full"
            onValueChange={(value) => {
              if (value) setDaysCount(value);
            }}>
            {daysCountOptions.map(count => (
              <ToggleGroupItem
                key={count}
                value={count.toString()}
                className={cn("h-[1.65rem] border-none rounded-full text-muted-foreground hover:bg-transparent")}
              >
                {count} days
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {/* //? Separator */}
          <div className="h-7 w-[1px] bg-border" />

          {/* //? Chart Toggle */}
          <MyTooltip
            trigger={

              <Button
                variant="outline"
                size="icon"
                onClick={chartToggleHandler}
                className="rounded-full p-0.5"
              >
                {chartType === "line" ?
                  <BarChart3 className="size-4" />
                  :
                  <LineChart className="size-4" />
                }
              </Button>
            }
            content={chartType === "line" ? "Bar Chart" : chartType === "bar" && "Line chart"}
          />
        </section>
      </section>
      {salesData.length === 0 && expensesData.length === 0 ? (
        <NoRecords missingThing="transactions" icon={RouteOff} />
      ) : (
        <OverviewChart daysCount={daysCount} chartType={chartType} />
      )}
      {/* <SimpleBarChart /> */}
    </CardContainer>
  )
}
