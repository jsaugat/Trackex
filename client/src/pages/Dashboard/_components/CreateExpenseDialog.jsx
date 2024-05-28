import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader, CircleCheck } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast as sonnerToast } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { DateToUTCDate } from "@/utils/helpers.js";
import { useCreateExpenseMutation } from "@/slices/api/expenses.api";
import { useCreateRevenueMutation } from "@/slices/api/revenue.api";
import { useDispatch, useSelector } from "react-redux";
import { ToastAction } from "@/components/ui/toast";

export default function CreateExpenseDialog({ trigger, type }) {
  const [open, setOpen] = useState(false);
  const form = useForm();
  const { toast } = useToast();
  //? REDUX
  const currentUser = useSelector((state) => state.auth.userInfo);
  const [createRevenue, { data: newRevenue, isLoading }] =
    useCreateRevenueMutation();
  const [createExpense, { data: newExpense, isLoading: isPending }] =
    useCreateExpenseMutation();
  const dispatch = useDispatch();
  const loading = isLoading || isPending;

  //? CATEGORY CHANGE Handler
  const handleCategoryChange = useCallback(
    (value) => {
      form.setValue("category", value);
    },
    [form]
  );

  //? FORM SUBMISSION Handler
  const onSubmit = useCallback(
    async (data) => {
      console.log("Submitted Form data: ", data);
      /**
       * 'data' format should look like this -->
       * {
       *  amount: "9700",
       *  category: "Internet",
       *  date: Wed May 22 2024 00:00:00 GMT+0545 (Nepal Time) {},
       *  description: "Vianet"
       * }
       */

      //* --- Success Handling ---
      try {
        let res;
        if (type === "expense") {
          res = await createExpense({
            ...data,
            customer: "",
            date: DateToUTCDate(data.date),
          }).unwrap();
        } else if (type === "revenue") {
          res = await createRevenue({
            ...data,
            date: DateToUTCDate(data.date),
          }).unwrap();
        }

        console.log("Successfully created new transaction:", res);
        toast({
          title: (
            <span className="inline-flex items-center gap-2 text-foreground">
              <CircleCheck className="size-5 text-green-500" />
              <p>Created new transaction successfully!!</p>
            </span>
          ),
          description: "Keep tracking ^^",
        });
        form.reset({
          description: "",
          amount: "",
          category: "",
          date: new Date(),
        });
        setOpen(false);
      } catch (error) {
        //! --- Error handling ---
        toast({
          variant: "destructive",
          title: "Please fill up all the fields.",
          description: "Error creating new transaction.",
          action: (
            <ToastAction altText="Goto schedule to undo">Try again</ToastAction>
          ),
        });
      }
    },
    [dispatch, type, currentUser, createExpense, createRevenue]
  );

  //? VALIDATE Amount
  const validateAmount = (value) => {
    const maxDigits = 5; // Maximum number of digits allowed
    const minAmount = 50; // Minimum allowed amount
    const regex = /^\d{1,5}$/; // Regex to match up to 5 digits

    // Check if the value is a valid number with up to maxDigits digits
    if (!regex.test(value)) {
      return `Amount must be a positive value, limited to ${maxDigits} digits.`;
    }

    // Check if the value is less than the minimum amount
    if (parseInt(value, 10) < minAmount) {
      return `Amount must be at least ${minAmount}.`;
    }

    return null; // Return null if no validation errors
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Create a new <span className="capitalize">{type}</span> Transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 h-fit"
          >
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <RequiredStar />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        type === "expense" ? "Store Space" : "Sunscreen"
                      }
                      defaultValue=""
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Transaction Description (Required)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Amount \ Customer */}
            <div className="flex gap-4 items-center justify-between">
              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                rules={{ validate: validateAmount }}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Amount <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="XXXXX"
                        onChange={(e) => {
                          if (e.target.value.length <= 5) {
                            form.setValue("amount", e.target.value);
                          }
                        }}
                        className={cn(
                          "w-[164px] sm:w-full",
                          type === "revenue" && "sm:w-[220px]"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Transaction Amount (Required)
                    </FormDescription>
                    <FormMessage className="p-1 px-2 text-red-500 bg-red-500/5 border rounded-md border-red-500/30" />
                  </FormItem>
                )}
              />
              {/* Customer Name */}
              {/* {type === "revenue" && (
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          className="w-[164px] sm:w-[220px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Name of the purchaser (Optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )} */}
            </div>
            {/* Category \ Date */}
            <div className="flex items-center gap-5">
              {/* //? Transaction Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Transaction Category <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                        field={field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* //? Transaction Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-full bg-green-500/0">
                    <FormLabel>
                      Transaction Date <RequiredStar />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[164px] md:w-[220px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date...</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return;
                            field.onChange(value);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        {/* Footer */}
        <DialogFooter className={"mt-4"}>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              className="mt-2 md:mt-0"
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {!loading && "Create"}
            {loading && <Loader className="animate-spin size-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

//! Star (*)
function RequiredStar() {
  return <span className="text-red-500">*</span>;
}
