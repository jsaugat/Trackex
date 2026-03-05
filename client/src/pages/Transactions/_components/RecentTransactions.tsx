import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchBar from "@/components/SearchBar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ListFilter, ServerOff } from "lucide-react";
import { useAppSelector } from "@/hooks/storeHooks";
import TransactionTableRow from "./TransactionsTableRow";
import DateRangePicker from "./DateRangePicker";
import { subMonths } from "date-fns";
import NoRecords from "@/components/NoRecords";

type TransactionFilter = "All" | "Expenses" | "Revenue";

type TransactionItem = {
  _id: string;
  type: string;
  description?: string;
  category?: string;
  amount: number;
  customer?: string;
  entity?: string;
  date: string;
  createdAt: string;
};

const FILTER_OPTIONS: { id: number; label: TransactionFilter }[] = [
  { id: 1, label: "All" },
  { id: 2, label: "Expenses" },
  { id: 3, label: "Revenue" },
];

const getTransactionsByFilter = ({
  selectedFilter,
  expenses,
  revenue,
}: {
  selectedFilter: TransactionFilter;
  expenses: TransactionItem[];
  revenue: TransactionItem[];
}) => {
  if (selectedFilter === "Expenses") return [...expenses];
  if (selectedFilter === "Revenue") return [...revenue];
  return [...expenses, ...revenue];
};

const sortByCreatedAtDesc = (transactions: TransactionItem[]) =>
  [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

const matchesSearchQuery = (transaction: TransactionItem, query: string) => {
  const normalizedQuery = query.toLowerCase();
  const descriptionMatch = transaction.description
    ?.toLowerCase()
    .includes(normalizedQuery);
  const customerMatch = transaction.customer
    ?.toLowerCase()
    .includes(normalizedQuery);
  const categoryMatch = transaction.category
    ?.toLowerCase()
    .includes(normalizedQuery);

  return descriptionMatch || customerMatch || categoryMatch;
};

const isWithinDateRange = (
  transaction: TransactionItem,
  dateRange: { from?: Date; to?: Date },
) => {
  if (!dateRange.from || !dateRange.to) return true;
  const transactionDate = new Date(transaction.date);
  return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
};

export default function RecentTransactions() {
  // Auto-focuses search input when this view opens.
  const searchInputRef = useRef(null);

  // Search keyword entered by user.
  const [searchQuery, setSearchQuery] = useState("");

  // Date range used to narrow down transactions.
  const [date, setDate] = useState({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });

  // Single-select transaction type filter.
  const [selectedFilter, setSelectedFilter] = useState<TransactionFilter>("All");

  const allExpenses = useAppSelector(
    (state) => (state.expenses.data || []) as TransactionItem[],
  );
  const allRevenue = useAppSelector(
    (state) => (state.revenue.data || []) as TransactionItem[],
  );

  // Transactions are derived from source data and UI filters, so use memoization instead of syncing via useEffect.
  const filteredTransactions = useMemo(() => {
    const mergedTransactions = getTransactionsByFilter({
      selectedFilter,
      expenses: allExpenses,
      revenue: allRevenue,
    });

    return sortByCreatedAtDesc(mergedTransactions)
      .filter((transaction) => matchesSearchQuery(transaction, searchQuery))
      .filter((transaction) => isWithinDateRange(transaction, date));
  }, [selectedFilter, allExpenses, allRevenue, searchQuery, date]);

  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(e.target.value);
  };

  // Focus search on initial mount for faster keyboard-driven filtering.
  useEffect(() => {
    searchInputRef.current && searchInputRef.current.focus();
  }, []);

  return (
    <Tabs value="transactions" className="flex-1 h-full flex flex-col">
      {/* Top controls: search + date range + type filter. */}
      <section className="flex items-center">
        <section className="w-full flex items-center justify-between gap-2">
          {/* Text search across description/customer/category. */}
          <SearchBar
            searchQuery={searchQuery}
            handleSearchInputChange={handleSearchInputChange}
            placeholder="Search transactions"
            searchInputRef={searchInputRef}
            className={undefined}
          />
          <section className="flex items-center gap-2">
            {/* Date interval selector. */}
            <DateRangePicker
              className="text-sm"
              date={date}
              setDate={setDate}
            />
            {/* Single-select transaction type dropdown. */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="p-3 gap-2 text-sm rounded-full"
                >
                  <ListFilter className="size-4" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {FILTER_OPTIONS.map(({ id, label }) => (
                  <DropdownMenuCheckboxItem
                    key={id}
                    checked={selectedFilter === label}
                    onClick={() => setSelectedFilter(label)}
                    className="flex"
                  >
                    <span>{label}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        </section>
      </section>
      {/* Transactions table. */}
      <TabsContent value="transactions" className="flex-auto">
        <Card className="relative rounded-3xl h-full shadow-lg shadow-indigo-200 dark:shadow-none">
          <CardHeader className="px-7">
            <CardTitle className="font-medium">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="h-[64.11dvh]">
            <ScrollArea className="h-full overflow-scroll overflow-x-hidden">
              {allRevenue.length === 0 && allExpenses.length === 0 ? (
                <NoRecords icon={ServerOff} missingThing="transactions" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">
                        Type
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Entity / Customer</TableHead>
                      <TableHead>Amount (NPR)</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TransactionTableRow
                      key={transaction._id}
                      _id={transaction._id}
                      type={transaction.type}
                      description={transaction.description}
                      category={transaction.category}
                      amount={transaction.amount}
                      customer={transaction.customer}
                      entity={transaction.entity}
                      date={transaction.date}
                    />
                  ))}
                </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
