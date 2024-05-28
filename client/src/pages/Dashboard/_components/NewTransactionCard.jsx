import GradientBorder from "@/components/GradientBorder";
import CreateRevenueDialog from "./CreateRevenueDialog";
import CreateExpenseDialog from "./CreateExpenseDialog";
import { ArrowLeftRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const NewTransactionCard = () => {
  return (
    <GradientBorder radius="3xl" className="">
      <main className="bg-background border dark:border-none dark:background p-5 rounded-[1.45rem] shadow-md  flex flex-col items-between gap-[2.45rem]">
        <div className="flex items-center gap-2">
          <h2 className="text-md flex items-center gap-2 flex-1">
            <ArrowLeftRight strokeWidth="1.5px" size="20px" /> Add New
            Transaction
          </h2>
        </div>
        {/* Buttons */}
        <div className="w-full text-white flex gap-3 justify-between flex-1">
          {/* Add Revenue Btn */}
          <CreateRevenueDialog
            trigger={
              <Button className="relative group w-full rounded-xl border-2 dark:border border-indigo-500/50 text-foreground bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/50 hover:text-foreground flex items-center justify-center gap-3 overflow-hidden">
                <Plus className="group-hover:stroke-indigo-500 transition-colors duration-300" />
                <mark className="absolute visible group-hover:invisible -left-2 -top-1 size-5 bg-indigo-300 dark:bg-indigo-300 blur-lg" />
                Revenue
              </Button>
            }
            type="revenue"
          />

          {/* Add Expense Btn */}
          <CreateExpenseDialog
            trigger={
              <Button className="relative group w-full rounded-xl border-2 dark:border border-rose-500/50 text-foreground bg-rose-100 hover:bg-rose-100 dark:bg-rose-900/40 dark:hover:bg-rose-900/50 hover:text-foreground flex items-center justify-center gap-3 overflow-hidden">
                <Plus className="group-hover:stroke-rose-400 transition-colors duration-300" />
                <mark className="absolute visible group-hover:invisible -left-2 -top-1 size-5 bg-rose-300 dark:bg-rose-300 blur-lg" />
                Expense
              </Button>
            }
            type="expense"
          />
        </div>
      </main>
    </GradientBorder>
  );
};

export default NewTransactionCard;
