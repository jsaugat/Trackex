import React, { useState } from 'react'
import CardContainer from '@/components/Card/Container';
import OverviewChart from '@/components/Charts/OverviewChart';
import NoRecords from '@/components/NoRecords';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChart3, LineChart, RouteOff } from "lucide-react";

export default function OverviewSection({ salesData, expensesData }) {
  //? Toggle last days count in line chart
  const [daysCount, setDaysCount] = useState("30");
  const [chartType, setChartType] = useState("line");

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
        <div className="text-sm flex items-center gap-4">
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
          {/* Last 7 days, 14 days, 30 days */}
          <ToggleGroup type="single" variant="outline" size="sm" value={daysCount}
            onValueChange={(value) => {
              if (value) setDaysCount(value);
            }}>
            <ToggleGroupItem value="7" className="rounded-full">7 days</ToggleGroupItem>
            <ToggleGroupItem value="14" className="rounded-full">14 days</ToggleGroupItem>
            <ToggleGroupItem value="30" className="rounded-full">30 days</ToggleGroupItem>
          </ToggleGroup>
        </div>
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
