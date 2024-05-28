import React, { useState, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import Labels from "./Labels";
import useColors from "@/hooks/useColors";
import useFinancialSummary from "@/hooks/useFinancialSummary";
import { useSelector } from "react-redux";
import { Gauge, ToggleLeft, ToggleRight } from "lucide-react";

// Register the ArcElement with Chart.js
Chart.register(ArcElement);

export default function DoughnutChart() {
  //? State to toggle between showing revenue and expenses data
  const [showRevenue, setShowRevenue] = useState(true);
  //? Select revenue and expenses data from redux state
  const revenueData = useSelector((state) => state.revenue.data || []);
  const expensesData = useSelector((state) => state.expenses.data || []);

  //? Hooks
  const { coolColors, warmColors } = useColors();
  const { totalRevenue, totalExpense } = useFinancialSummary();

  //? Toggle the data between revenue and expenses
  const toggleData = () => {
    setShowRevenue((prev) => !prev);
  };

  //? Compute the data for the chart based on the current state (revenue or expenses)
  const currentData = useMemo(() => {
    const data = showRevenue ? revenueData : expensesData; // Choose the data based on the toggle state
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0); // Calculate the total amount
    const groupedData = data.reduce((accumulator, item) => {
      // Get the category value from the accumulator (or default to 0)
      const categoryValue = accumulator[item.category] || 0;
      // Update the category value with the item's amount
      accumulator[item.category] = categoryValue + item.amount;
      return accumulator;
    }, {});
    /**
     * RESULT :
     * groupedData = {
     *  Footwear: XXXX,
     *  Outfit: XXXX,
     *  Fragrance: XXXX,
     * }
     */

    //? Extract category labels
    const labels = Object.keys(groupedData);
    //? Calculate percentage values
    const values = Object.values(groupedData)
      .map((value) => (value / totalAmount) * 100) // calculate the percentage
      .sort((a, b) => b - a) // sort the values highest to lowest
      .map((value) => (value < 1 ? 1 : value).toFixed(2)); // if the percentage is less than 1 make it 1.

    const colors = labels.map((_, index) => {
      const colorPalette = showRevenue ? coolColors : warmColors;

      return colorPalette[index % colorPalette.length];
    }); // Assign colors
    /**
     * colors = [ xxx, xxx, xxx ]
     */

    return { labels, values, colors };
  }, [showRevenue, revenueData, expensesData, coolColors, warmColors]);

  //? Chart configuration
  const config = {
    data: {
      labels: currentData.labels, // Set the labels
      datasets: [
        {
          data: currentData.values, // Set the data values
          backgroundColor: currentData.colors.map((color) => `${color}80`), // Set the background colors with transparency
          borderColor: currentData.colors, // Set the border colors
          hoverOffset: 27,
          offset: 20,
          borderRadius: 0,
          spacing: 10,
        },
      ],
    },
    options: {
      cutout: 115, // Set the cutout size
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw;
              return `${label}: ${value}%`;
            },
          },
        },
      },
    },
  };

  return (
    <div className="flex justify-content max-w-xs mx-auto">
      <div className="item">
        <ChartTitle showRevenue={showRevenue} toggleData={toggleData} />
        <div className="relative">
          <Doughnut {...config} /> {/* Render the Doughnut chart */}
          <h3 className="absolute left-[52%] top-[50%] translate-x-[-50%] translate-y-[-50%] mx-auto mb-2 text-muted-foreground font-medium flex flex-col justify-center items-center">
            Total
            <span className="text-3xl text-foreground">
              रु {showRevenue ? totalRevenue : totalExpense}{" "}
              {/* Display the total amount */}
            </span>
          </h3>
        </div>
        <div className="h-full pt-8 flex flex-col gap-4 ">
          <Labels data={currentData} /> {/* Render the Labels component */}
        </div>
      </div>
    </div>
  );
}

//? Chart Header
function ChartTitle({ showRevenue, toggleData }) {
  return (
    <section className="mb-6 flex justify-between">
      <h3 className="font-medium flex items-center gap-2">
        <Gauge className="size-5" />
        <span>{showRevenue ? "Revenue" : "Expenses"} By Category</span>
      </h3>
      <button onClick={toggleData} variant="icon">
        {showRevenue ? (
          <ToggleLeft className="size-7 text-indigo-400" />
        ) : (
          <ToggleRight className="size-7 text-rose-400" />
        )}
      </button>
    </section>
  );
}
