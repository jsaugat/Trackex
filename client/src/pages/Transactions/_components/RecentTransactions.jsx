import React, { useEffect, useReducer, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ListFilter, Check, ServerOff } from "lucide-react";
import { useSelector } from "react-redux";
import TransactionTableRow from "./TransactionsTableRow";
import DateRangePicker from "./DateRangePicker"
import { addDays, subMonths, subYears } from "date-fns";

const reducer = (state, action) => {
  switch (action.type) {
    case "SELECT":
      return state.map((option) =>
        option.id === action.id
          ? { ...option, selected: true }
          : { ...option, selected: false }
      );
    default:
      state;
  }
};

export default function RecentTransactions() {
  //? Local States
  const searchInputRef = useRef(null);
  // SEARCH
  const [searchQuery, setSearchQuery] = useState("");
  // DATE
  const [date, setDate] = useState({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  const [filterOptions, dispatch] = useReducer(reducer, [
    { id: 1, label: "All", selected: true },
    { id: 2, label: "Expenses", selected: false },
    { id: 3, label: "Revenue", selected: false },
  ]);
  const allExpenses = useSelector((state) => state.expenses.data || []);
  const allRevenue = useSelector((state) => state.revenue.data || []);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTab, setSelectedTab] = useState("week");

  console.log("filterOptions: ", filterOptions);
  console.log("filteredTransactions: ", filteredTransactions);

  //? MAIN SIDE-EFFECT
  useEffect(() => {
    // 'selectedFilter' (all, revenue, expenses) is the selected filter option.
    const selectedFilter = filterOptions.find(
      (option) => option.selected
    ).label;

    // Logic to merge expenses and revenue according to the selected filter..
    let mergedTransactions = [];
    if (allExpenses && allRevenue) {
      if (selectedFilter === "All") {
        mergedTransactions = [...allExpenses, ...allRevenue];
      } else if (selectedFilter === "Expenses") {
        mergedTransactions = [...allExpenses];
      } else if (selectedFilter === "Revenue") {
        mergedTransactions = [...allRevenue];
      }

      //? Sort transactions by createdAt in descending order
      mergedTransactions.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Filter transactions based on selected tab [ week | month | year ].
      // const now = new Date();
      // let filteredByTime = mergedTransactions.filter((transaction) => {
      //   const transactionDate = new Date(transaction.createdAt);
      //   if (selectedTab === "week") {
      //     // Week
      //     const oneWeekAgo = new Date();
      //     oneWeekAgo.setDate(now.getDate() - 7);
      //     console.log("transaction date: ", transactionDate);
      //     console.log("oneWeekAgo: ", oneWeekAgo);
      //     return transactionDate >= oneWeekAgo;
      //   } else if (selectedTab === "month") {
      //     // Month
      //     const oneMonthAgo = new Date();
      //     oneMonthAgo.setMonth(now.getMonth() - 1);
      //     return transactionDate >= oneMonthAgo;
      //   } else if (selectedTab === "year") {
      //     // Year
      //     const oneYearAgo = new Date();
      //     oneYearAgo.setFullYear(now.getFullYear() - 1);
      //     return transactionDate >= oneYearAgo;
      //   }
      //   return true;
      // });

      //? Filter based on Search Query
      let transactions = mergedTransactions.filter(transaction => {
        const searchedDescription = transaction.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const searchedCustomer = transaction.customer?.toLowerCase().includes(searchQuery.toLowerCase());
        const searchedCategory = transaction.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const searchedTransactions = searchedDescription || searchedCustomer || searchedCategory;
        return searchedTransactions;
      })

      //? Filter based on date range selection
      if (date?.from && date?.to) {
        transactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= date.from && transactionDate <= date.to;
        })
      }

      setFilteredTransactions(transactions);
    }
  }, [allExpenses, allRevenue, filterOptions, searchQuery, date]);

  //? Handle filter options selections
  const handleSelect = (id) => {
    dispatch({ type: "SELECT", id });
  };

  //? Handle search input
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  //? Activate search on component mount
  useEffect(() => {
    searchInputRef.current && searchInputRef.current.focus();
  }, []);


  return (
    <Tabs
      defaultValue="week"
      onValueChange={setSelectedTab}
      className="flex-1 h-full flex flex-col"
    >
      {/* //? Filter Section */}
      <section className="flex items-center">
        {/* <TabsList>
          <TabsTrigger value="week">Activity</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList> */}
        {/* //? Filter */}
        <section className="w-full flex items-center justify-between gap-2">
          {/* Search bar */}
          <SearchBar
            searchQuery={searchQuery}
            handleSearchInputChange={handleSearchInputChange}
            placeholder="Search transactions"
            searchInputRef={searchInputRef}
          />
          <section className="flex items-center gap-2">
            {/* Date picker */}
            <DateRangePicker className="text-sm" date={date} setDate={setDate} />
            {/* Filter transaction types */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="" className="p-3 gap-2 text-sm rounded-full">
                  <ListFilter className="size-4" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterOptions.map(({ id, label, selected }) => (
                  <DropdownMenuCheckboxItem
                    key={id}
                    checked={selected}
                    onClick={() => handleSelect(id)}
                    className="flex"
                  >
                    {/* {selected && <Check className="size-4" />} */}
                    <span>{label}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        </section>
      </section>
      {/* //? Table */}
      <TabsContent value={selectedTab} className="flex-auto">
        <Card className="relative rounded-3xl h-full shadow-lg shadow-indigo-200 dark:shadow-none">
          <CardHeader className="px-7">
            <CardTitle className="font-medium">Recent Activities</CardTitle>
            {/* <CardDescription>Your recent activities.</CardDescription> */}
          </CardHeader>
          <CardContent className="h-[64.11dvh]">
            <ScrollArea className="h-full overflow-scroll overflow-x-hidden">
              {allRevenue.length === 0 && allExpenses.length === 0 ? (
                <section className="mx-auto mt-2 w-full p-5 text-muted-foreground bg-muted/50 border rounded-md flex items-center justify-center gap-4">
                  <ServerOff strokeWidth="1px" className="size-7" />
                  <span>No recorded transactions currently.</span>
                </section>
              ) : (
                <Table className="">
                  <TableHeader className="">
                    <TableRow>
                      <TableHead className="hidden sm:table-cell">
                        Type
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="">Description</TableHead>
                      <TableHead>Entity / Customer</TableHead>
                      <TableHead className="">Amount (NPR)</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {/* //HOW TO DYNAMICALLY FILTER THE filteredTransactions
                      array for either last week, last month or last year based
                      on the TabsContent value  */}
                    {filteredTransactions?.map((transaction) => {
                      console.log("PRINT TABS CONTENT VALUE HERE !!!");
                      return (
                        //? Table Row Component ⬇️
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
                      );
                    })}
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
