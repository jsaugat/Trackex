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
import { useForm, Controller } from "react-hook-form";
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
import { CalendarIcon, Loader, CircleCheck, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast as sonnerToast } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { DateToUTCDate } from "@/utils/helpers.js";
import { useCreateExpenseMutation } from "@/slices/api/expenses.api";
import { useDispatch, useSelector } from "react-redux";
import { ToastAction } from "@/components/ui/toast";
import { v4 as uuidv4 } from 'uuid';
import { Separator } from "@/components/ui/separator";


// export default function CreateExpenseDialog({ trigger, type }) {
//   const [open, setOpen] = useState(false);
//   const form = useForm();
//   const { toast } = useToast();
//   //? REDUX
//   const currentUser = useSelector((state) => state.auth.userInfo);
//   const [createRevenue, { data: newRevenue, isLoading }] =
//     useCreateRevenueMutation();
//   const [createExpense, { data: newExpense, isLoading: isPending }] =
//     useCreateExpenseMutation();
//   const dispatch = useDispatch();
//   const loading = isLoading || isPending;

//   //? CATEGORY CHANGE Handler
//   const handleCategoryChange = useCallback(
//     (value) => {
//       form.setValue("category", value);
//     },
//     [form]
//   );

//   //? FORM SUBMISSION Handler
//   const onSubmit = useCallback(
//     async (data) => {
//       console.log("Submitted Form data: ", data);
//       /**
//        * 'data' format should look like this -->
//        * {
//        *  amount: "9700",
//        *  category: "Internet",
//        *  date: Wed May 22 2024 00:00:00 GMT+0545 (Nepal Time) {},
//        *  description: "Vianet"
//        * }
//        */

//       //* --- Success Handling ---
//       try {
//         let res;
//         if (type === "expense") {
//           res = await createExpense({
//             ...data,
//             customer: "",
//             date: DateToUTCDate(data.date),
//           }).unwrap();
//         } else if (type === "revenue") {
//           res = await createRevenue({
//             ...data,
//             date: DateToUTCDate(data.date),
//           }).unwrap();
//         }

//         console.log("Successfully created new transaction:", res);
//         toast({
//           title: (
//             <span className="inline-flex items-center gap-2 text-foreground">
//               <CircleCheck className="size-5 text-green-500" />
//               <p>Created new transaction successfully!!</p>
//             </span>
//           ),
//           description: "Keep tracking ^^",
//         });
//         form.reset({
//           description: "",
//           amount: "",
//           category: "",
//           date: new Date(),
//         });
//         setOpen(false);
//       } catch (error) {
//         //! --- Error handling ---
//         toast({
//           variant: "destructive",
//           title: "Please fill up all the fields.",
//           description: "Error creating new transaction.",
//           action: (
//             <ToastAction altText="Goto schedule to undo">Try again</ToastAction>
//           ),
//         });
//       }
//     },
//     [dispatch, type, currentUser, createExpense, createRevenue]
//   );

//   //? VALIDATE Amount
//   const validateAmount = (value) => {
//     const maxDigits = 5; // Maximum number of digits allowed
//     const minAmount = 50; // Minimum allowed amount
//     const regex = /^\d{1,5}$/; // Regex to match up to 5 digits

//     // Check if the value is a valid number with up to maxDigits digits
//     if (!regex.test(value)) {
//       return `Amount must be a positive value, limited to ${maxDigits} digits.`;
//     }

//     // Check if the value is less than the minimum amount
//     if (parseInt(value, 10) < minAmount) {
//       return `Amount must be at least ${minAmount}.`;
//     }

//     return null; // Return null if no validation errors
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>{trigger}</DialogTrigger>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>
//             Create a new <span className="capitalize">{type}</span> Transaction
//           </DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-4 h-fit"
//           >
//             {/* Description */}
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     Description <RequiredStar />
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder={
//                         type === "expense" ? "Store Space" : "Sunscreen"
//                       }
//                       defaultValue=""
//                       autoComplete="off"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Transaction Description (Required)
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* Amount \ Customer */}
//             <div className="flex gap-4 items-center justify-between">
//               {/* Amount */}
//               <FormField
//                 control={form.control}
//                 name="amount"
//                 rules={{ validate: validateAmount }}
//                 render={({ field }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>
//                       Amount <RequiredStar />
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         placeholder="XXXXX"
//                         onChange={(e) => {
//                           if (e.target.value.length <= 5) {
//                             form.setValue("amount", e.target.value);
//                           }
//                         }}
//                         className={cn(
//                           "w-[164px] sm:w-full",
//                           type === "revenue" && "sm:w-[220px]"
//                         )}
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       Transaction Amount (Required)
//                     </FormDescription>
//                     <FormMessage className="p-1 px-2 text-red-500 bg-red-500/5 border rounded-md border-red-500/30" />
//                   </FormItem>
//                 )}
//               />
//               {/* Customer Name */}
//               {/* {type === "revenue" && (
//                 <FormField
//                   control={form.control}
//                   name="customer"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Customer</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="text"
//                           placeholder="John Doe"
//                           className="w-[164px] sm:w-[220px]"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         Name of the purchaser (Optional)
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               )} */}
//             </div>
//             {/* Category \ Date */}
//             <div className="flex items-center gap-5">
//               {/* //? Transaction Category */}
//               <FormField
//                 control={form.control}
//                 name="category"
//                 render={({ field }) => (
//                   <FormItem className="w-full">
//                     <FormLabel>
//                       Transaction Category <RequiredStar />
//                     </FormLabel>
//                     <FormControl>
//                       <CategoryPicker
//                         type={type}
//                         onChange={handleCategoryChange}
//                         field={field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {/* //? Transaction Date */}
//               <FormField
//                 control={form.control}
//                 name="date"
//                 render={({ field }) => (
//                   <FormItem className="w-full bg-green-500/0">
//                     <FormLabel>
//                       Transaction Date <RequiredStar />
//                     </FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={"outline"}
//                             className={cn(
//                               "w-[164px] md:w-[220px] pl-3 text-left font-normal",
//                               !field.value && "text-muted-foreground"
//                             )}
//                           >
//                             {field.value ? (
//                               format(field.value, "PPP")
//                             ) : (
//                               <span>Pick a date...</span>
//                             )}
//                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={(value) => {
//                             if (!value) return;
//                             field.onChange(value);
//                           }}
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </form>
//         </Form>
//         {/* Footer */}
//         <DialogFooter className={"mt-4"}>
//           <DialogClose asChild>
//             <Button
//               type="button"
//               variant={"secondary"}
//               className="mt-2 md:mt-0"
//               onClick={() => {
//                 form.reset();
//               }}
//             >
//               Cancel
//             </Button>
//           </DialogClose>
//           <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
//             {!loading && "Create"}
//             {loading && <Loader className="animate-spin size-4" />}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

export default function CreateExpenseDialog({ trigger, type }) {
  const [open, setOpen] = useState(false);
  const [expenseList, setExpenseList] = useState([{ id: 1 }]); // Initial expense item
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const currentUser = useSelector((state) => state.auth.userInfo);
  const [createExpense, { isLoading: isPending }] = useCreateExpenseMutation();
  const dispatch = useDispatch();
  const loading = isPending;
  // Generate a random ID
  const randomId = uuidv4().substring(0, 8);

  //? CATEGORY CHANGE Handler
  const handleCategoryChange = useCallback(
    (index, value) => {
      setValue(`expenses[${index}].category`, value);
    },
    [setValue]
  );

  //! VALIDATE Amount
  const validateAmount = (value) => {
    const maxDigits = 5; // Maximum number of digits allowed
    const minAmount = 50; // Minimum allowed amount
    const regex = /^\d{1,5}$/; // Regex to match up to 5 digits

    // Check if the value is a valid number with up to maxDigits digits
    if (!regex.test(value)) {
      // Check if the value contains a negative sign
      if (value?.includes("-")) {
        return `Amount must be at least ${minAmount}.`;
      }
      return `Amount limited to ${maxDigits} digits.`;
    }

    //? Check if the value is less than the minimum amount
    if (parseInt(value, 10) < minAmount) {
      return `Amount must be at least ${minAmount}.`;
    }

    return true; // Return true if no validation errors
  };

  //! VALIDATE Quantity
  const validateQuantity = (value) => {
    const minQuantity = 1;   // Minimum quantity
    const maxQuantity = 100; // Maximum quantity

    // Convert value to an integer
    const intValue = parseInt(value, 10);

    // Check if the value is less than the minimum quantity
    if (intValue < minQuantity) {
      return `Minimum quantity limit is ${minQuantity}.`;
    }

    // Check if the value is greater than the maximum quantity
    if (intValue > maxQuantity) {
      return `Maximum quantity limit is ${maxQuantity}.`;
    }

    return true; // Return true if no validation errors
  };

  //? ADD NEW Expense List Item
  const addNewExpenseItem = (e) => {
    e.preventDefault();
    if (expenseList.length === 20) {
      toast({
        variant: "destructive",
        title: "Maximum number of expense entries reached."
      })
      return;
    }
    setExpenseList((prevList) => [...prevList, { id: prevList.length + 1 }]);
  };

  //? DELETE Expense List Item
  const deleteExpenseItem = (index) => {
    if (expenseList.length === 1) {
      setExpenseList(prevList => prevList);
      return;
    }
    const updatedExpenseList = expenseList.filter((_, i) => i !== index);
    setExpenseList(updatedExpenseList);
    // Reset the form with the updated expense list
    reset({
      ...getValues(),
      expenses: updatedExpenseList
    });
  };

  //? FORM SUBMISSION Handler
  const onSubmit = useCallback(
    async (data) => {
      console.log("Submitted Form data: ", data);
      //! Check if date field is empty
      if (!data.date) {
        toast({
          variant: "destructive",
          title: "Date is required.",
          description: "Please select a transaction date.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
        return;
      }

      //? Transform data to match API format
      const transformedData = data.expenses.map((expense) => ({
        ...expense,
        type: "expense",
        date: DateToUTCDate(data.date),
      }));

      //? Log transformed data
      console.log("Expense transformed data to submit: ", transformedData);
      console.log(
        "Expense transformed data type: ",
        JSON.stringify(transformedData)
      );

      //? Make API request
      try {
        let res = await createExpense(transformedData).unwrap();

        //? Log response
        console.log("Successfully created new transaction:", res);
        toast({
          title: (
            <span className="text-foreground inline-flex items-center gap-2">
              <CircleCheck className="size-5 text-green-500" />
              <p>Created new transaction successfully!!</p>
            </span>
          ),
          description: "Keep tracking ^^",
        });

        //? Reset form data
        reset({
          date: new Date(),
          expenses: [{ id: 1, description: "", amount: "", category: "" }],
        });
        setExpenseList([{ id: 1 }]); // Reset expense list to initial state
        setOpen(false);
      } catch (error) {
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
    [dispatch, type, currentUser, createExpense, reset, toast, deleteExpenseItem]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="md:min-w-fit md:max-w-[80%]">
        <DialogHeader>
          <DialogTitle>
            Create a new <span className="capitalize">{type}</span> transaction
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-sm space-y-4 h-fit"
        >
          {/* //? Date */}
          <section className="flex items-center gap-5">
            {/* Transaction Date */}
            <div className="grid">
              <label>
                Transaction Date <RequiredStar />
              </label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[164px] md:min-w-[220px] pl-3 text-left font-normal",
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
                )}
              />
              {errors.date && (
                <p className="mt-2 text-red-600 text-sm">
                  Transaction Date is required
                </p>
              )}
            </div>
          </section>

          {/* //? expenses header */}
          <h1 className="font-medium">Expenses Entry List</h1>

          <ul className="max-h-96 pr-2 list-none overflow-y-scroll">
            {expenseList.map((expense, index) => (
              <>
                <ExpenseListItem
                  key={expense.id}
                  index={index}
                  type={type}
                  register={register}
                  errors={errors}
                  control={control}
                  validateAmount={validateAmount}
                  validateQuantity={validateQuantity}
                  handleCategoryChange={handleCategoryChange}
                  deleteExpenseItem={deleteExpenseItem}
                  expenseList={expenseList}
                />
                <Separator className="mb-4" />
              </>
            ))}
          </ul>
          <div className="w-full flex justify-center">
            <Button
              variant="ghost"
              className="mx-auto text-muted-foreground flex gap-2"
              onClick={(e) => addNewExpenseItem(e)}
            >
              <Plus className="size-4" />
              <span>Add New</span>
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <div className="">
              <section className="flex gap-3">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant={"secondary"}
                    className="mt-2 md:mt-0"
                    onClick={() => reset()}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" >
                  {!loading ? (
                    <span className="flex items-center gap-2">
                      <p>Create</p>
                    </span>
                  ) : (
                    <Loader className="animate-spin size-4" />
                  )}
                </Button>
              </section>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  );
}

//? Expense entry list-item
const ExpenseListItem = ({
  type,
  register,
  errors,
  control,
  validateAmount,
  validateQuantity,
  handleCategoryChange,
  index,
  deleteExpenseItem,
  expenseList
}) => {
  return (
    <li className="min-w-[60rem] h-20 flex items-start gap-5">
      {/* Row Title */}
      <div className="min-w-fit h-full">
        <h3 className="py-1 px-3 text-[0.8rem] font-medium uppercase dark:bg-muted border dark:border-foreground/40 rounded-full shadow-md shadow-indigo-400 dark:shadow-none">
          Expense {index < 9 ? `0${index + 1}` : index + 1}
        </h3>
      </div>
      {/* Fields */}
      <div className="grid lg:grid-cols-4 gap-4 items-center justify-between">
        {/* Category */}
        <div className="grid flex-1">
          <label>
            Category <RequiredStar />
          </label>
          {/* Controller connects the CategoryPicker to the react-hook-form's state */}
          <Controller
            name={`expenses[${index}].category`}
            control={control}
            render={({ field }) => (
              <CategoryPicker
                type={type}
                onChange={(value) => handleCategoryChange(index, value)}
                field={field}
              />
            )}
          />
          {/* Error Div */}
          <div className="h-6">
            {errors.expenses?.[index]?.category && (
              <p className="mt-2 text-red-600 text-xs">Category is required</p>
            )}
          </div>
        </div>
        {/* Description */}
        <div className="grid flex-1">
          <label>
            Description <RequiredStar />
          </label>
          <Input
            placeholder="Repair"
            autoComplete="off"
            {...register(`expenses[${index}].description`, {
              required: "Description is required",
            })}
          />
          {/* Error Div */}
          <div className="h-6">
            {errors.expenses?.[index]?.description && (
              <p className="mt-2 text-red-600 text-xs">
                {errors.expenses?.[index]?.description?.message}
              </p>
            )}
          </div>
        </div>
        {/* Amount */}
        <div className="grid flex-1">
          <label>
            Amount (NPR) <RequiredStar />
          </label>
          <Input
            type="number"
            placeholder="XXXXX"
            {...register(`expenses[${index}].amount`, {
              validate: validateAmount,
            })}
          />
          {/* Error Div */}
          <div className="h-6">
            {errors.expenses?.[index]?.amount && (
              <p className="mt-2 text-red-600 text-xs">
                {errors.expenses?.[index]?.amount?.message}
              </p>
            )}
          </div>
        </div>
        {/* Quantity */}
        <div className="grid flex-1">
          <label>Quantity (Optional)</label>
          <Input
            type="number"
            placeholder="XX"
            {...register(`expenses[${index}].quantity`, {
              validate: validateQuantity,
            })}
          />
          {/* Error Div */}
          <div className="h-6">
            {errors.expenses?.[index]?.quantity && (
              <p className="mt-2 text-red-600 text-xs">
                {errors.expenses?.[index]?.quantity?.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="h-full flex justify-center items-center">
        <Button
          variant="outline"
          size="icon"
          className="hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/10"
          onClick={() => deleteExpenseItem(index)}
          disabled={expenseList.length <= 1}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
};

//! Star (*)
function RequiredStar() {
  return <span className="text-red-500">*</span>;
}
