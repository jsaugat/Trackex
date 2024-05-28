import { useMemo } from "react";

const salesData = useSelector((state) => state.revenue.data);
const expensesData = useSelector((state) => state.expenses.data);

// Sum Calculations.
const totalRevenue = useMemo(
  () =>
    salesData?.reduce(
      (accumulator, revenue) => accumulator + parseFloat(revenue.amount),
      0
    ),
  [salesData]
);
const totalExpense = useMemo(
  () =>
    expensesData?.reduce(
      (accumulator, expense) => accumulator + parseFloat(expense.amount),
      0
    ),
  [expensesData]
);
const totalBalance = useMemo(
  () => totalRevenue - totalExpense,
  [totalRevenue, totalExpense]
);
