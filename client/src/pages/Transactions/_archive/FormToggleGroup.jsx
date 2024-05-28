import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ToggleGroup({ transactionType, setTransactionType }) {
  return (
    <main className="p-1 bg-secondary rounded-full flex gap-2 shadow-inner shadow-black/20 dark:border-none">
      <Button
        onClick={() => setTransactionType("revenue")}
        className={`${
          transactionType === "revenue"
            ? "bg-foreground text-background hover:bg-foreground dark:bg-background dark:text-foreground dark:hover:bg-background"
            : "bg-secondary text-muted-foreground hover:bg-secondary shadow-none"
        } rounded-full flex items-center gap-2`}
      >
        <TrendingUp strokeWidth="2px" size="17px" /> Revenue
      </Button>
      <Button
        onClick={() => setTransactionType("expense")}
        className={`${
          transactionType === "expense"
            ? "bg-foreground text-background hover:bg-foreground dark:bg-background dark:text-foreground dark:hover:bg-background"
            : "bg-secondary text-muted-foreground shadow-none hover:bg-secondary"
        } rounded-full flex items-center gap-2`}
      >
        <TrendingDown strokeWidth="2px" size="17px" />
        Expense
      </Button>
    </main>
  );
}
