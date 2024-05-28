import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { SquarePlus } from "lucide-react";
import DatePicker from "./DatePicker";
import { useDispatch } from "react-redux";
import { useCreateExpenseMutation } from "@/slices/api/expenses.api";
import { useCreateRevenueMutation } from "@/slices/api/revenue.api";
import { addExpenseLocally } from "@/slices/expensesSlice";
import { addRevenueLocally } from "@/slices/revenueSlice";
import SelectCategory from "./FormSelectCategory";
import ToggleGroup from "./FormToggleGroup";

export default function Form() {
  //? Form States
  const [transactionType, setTransactionType] = useState("revenue");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseFormData, setExpenseFormData] = useState({
    product: "",
    amount: "",
    category: "",
    date: "",
  });
  const [revenueFormData, setRevenueFormData] = useState({
    product: "",
    customer: "",
    amount: "",
    category: "",
    date: "",
  });

  //? RTK Queries and Mutations
  const [addExpenseToApi, { isAddExpenseLoading }] = useCreateExpenseMutation();
  const [addRevenueToApi, { isAddRevenueLoading }] = useCreateRevenueMutation();

  const dispatch = useDispatch();
  const { toast } = useToast();

  //? Event Handlers
  const handleSubmission = async (e) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = now.toDateString() + ", " + now.toLocaleTimeString();
    try {
      //? Revenue Transaction
      if (transactionType === "revenue") {
        const response = await addRevenueToApi(revenueFormData);
        console.log("revenue response", response);
        console.log("revenue response status", response.status);
        if (response.ok) {
          dispatch(addRevenueLocally(response));
          // Clear Inputs
          setRevenueFormData({
            product: "",
            customer: "",
            amount: "",
            category: "",
            date: "",
          });
          setSelectedDate(new Date());
          setSelectedCategory("");
          // Toast
          toast({
            title: "Successfully Created a New Transaction",
            description: formattedDate,
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          });
        } else {
          // Toast
          toast({
            title: "Failed to create new revenue transaction.",
            description: "There was a problem with your request.",
            // action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      }
      //? Expense Transaction
      if (transactionType === "expense") {
        const response = await addExpenseToApi(expenseFormData);
        console.log("expense response", response);
        if (response.ok) {
          dispatch(addExpenseLocally(response)); // Assuming response.data contains the added expense
          setExpenseFormData({
            product: "",
            amount: "",
          });
          setSelectedDate(new Date());
          setSelectedCategory("");
          toast({
            title: "Successfully Created a New Transaction",
            description: formattedDate,
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          });
        } else {
          toast({
            title: "Failed to create new expense transaction",
            description: "There was a problem with your request.",
            // action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      }
    } catch (error) {
      console.error("Error occurred while adding transaction:", error);
    }
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (transactionType === "expense") {
      setExpenseFormData((prevState) => ({
        ...prevState,
        [name]: value,
        date: selectedDate,
        category: selectedCategory,
      }));
      console.log("EXPENSE_FORM_DATA: ", expenseFormData);
      // console.log("EXPENSE_FORM_DATA: ", JSON.stringify(expenseFormData));
    } else {
      setRevenueFormData((prevState) => ({
        ...prevState,
        [name]: value,
        date: selectedDate,
        category: selectedCategory,
      }));
      // console.log("REVENUE_FORM_DATA: ", JSON.stringify(revenueFormData));
      console.log("REVENUE_FORM_DATA: ", revenueFormData);
    }
  };

  useEffect(() => {
    setExpenseFormData((prevState) => ({
      ...prevState,
      date: selectedDate,
      category: selectedCategory,
    }));
    setRevenueFormData((prevState) => ({
      ...prevState,
      date: selectedDate,
      category: selectedCategory,
    }));
  }, [
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    setSelectedCategory,
  ]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <form
      action=""
      onSubmit={handleSubmission}
      className="flex-1 max-w-sm bg-background p-6 rounded-3xl border grid shadow-md"
    >
      <h3 className="text-[1.35rem] font-medium my-5">Add New Transaction</h3>
      <div className="w-sm flex items-center justify-center md:justify-between">
        <Label className="hidden md:block">Type </Label>
        {/* Revenue and Expense Toggler */}
        <ToggleGroup
          transactionType={transactionType}
          setTransactionType={setTransactionType}
        />
      </div>

      {/* -------- FORM-FIELDS -------- */}
      {transactionType === "revenue" ? (
        <RevenueFields
          formData={revenueFormData}
          handleFormChange={handleFormChange}
        />
      ) : (
        <ExpenseFields
          formData={expenseFormData}
          handleFormChange={handleFormChange}
        />
      )}

      {/* Category */}
      <SelectCategory
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Date */}
      <DatePicker
        className="w-full rounded-full"
        onDateSelect={handleDateSelect}
      />
      {/* submit button */}
      <Button type="submit" className="rounded-full mt-6 gap-2">
        <SquarePlus size={"16px"} /> Create Transaction
      </Button>
    </form>
  );
}

const RevenueFields = ({ formData, handleFormChange }) => (
  <>
    <Label className="mt-4 mb-1">Product Name</Label>
    <Input
      name="product"
      type="text"
      placeholder="Sunscreen"
      value={formData.product}
      onChange={handleFormChange}
      className="mb-2"
    />
    <section className="flex items-center gap-2 mb-3">
      {/* Amount */}
      <div className="space-y-1 p-0">
        <Label>Total Amount - Rs.</Label>
        <Input
          name="amount"
          type="number"
          placeholder="XXXXX"
          value={formData.amount}
          onChange={handleFormChange}
        />
      </div>
      {/* Customer Name */}
      <div className="space-y-1">
        <Label>Customer Name</Label>
        <Input
          name="customer"
          type="text"
          placeholder="Sagar Adhikari"
          value={formData.customer}
          onChange={handleFormChange}
        />
      </div>
    </section>
  </>
);
const ExpenseFields = ({ formData, handleFormChange }) => (
  <>
    <Label className="mt-4 mb-1">Product Name</Label>
    <Input
      name="product"
      type="text"
      placeholder="Socks"
      value={formData.product}
      onChange={handleFormChange}
      className="mb-3"
    />
    {/* Amount */}
    <Label className="mb-1">Total Amount - Rs.</Label>
    <Input
      name="amount"
      type="number"
      placeholder="XXXXX"
      value={formData.amount}
      onChange={handleFormChange}
      className="mb-3"
    />
  </>
);
