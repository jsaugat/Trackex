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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import CategoryPicker from "./CategoryPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader, CircleCheck, Plus, Trash2, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { DateToUTCDate } from "@/utils/helpers.js";
import { useCreateExpenseMutation } from "@/slices/api/expenses.api";
import { useCreateRevenueMutation } from "@/slices/api/revenue.api";
import { useDispatch, useSelector } from "react-redux";
import { ToastAction } from "@/components/ui/toast";
import axios from 'axios';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';

export default function CreateRevenueDialog({ trigger, type }) {
  const [open, setOpen] = useState(false);
  const [productList, setProductList] = useState([{ id: 1 }]); // Initial product item
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
  const [createRevenue, { isLoading }] = useCreateRevenueMutation();
  const [createExpense, { isLoading: isPending }] = useCreateExpenseMutation();
  const dispatch = useDispatch();
  const loading = isLoading || isPending;
  // Generate a random ID
  const randomId = uuidv4().substring(0, 8);

  //? CATEGORY CHANGE Handler
  const handleCategoryChange = useCallback(
    (index, value) => {
      setValue(`products[${index}].category`, value);
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

    // Check if the value is less than the minimum amount
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


  //? ADD NEW Product List Item
  const addNewProductItem = (e) => {
    e.preventDefault();
    if (productList.length === 20) {
      toast({
        variant: "destructive",
        title: "Maximum number of products reached."
      })
      return;
    }
    setProductList((prevList) => [...prevList, { id: prevList.length + 1 }]);
  };

  //? DELETE Product List Item
  const deleteProductItem = (index) => {
    if (productList.length === 1) {
      setProductList(prevList => prevList);
      return;
    }
    const updatedProductList = productList.filter((_, i) => i !== index);
    setProductList(updatedProductList);
    // Reset the form with the updated product list
    reset({
      ...getValues(),
      products: updatedProductList
    });
  };

  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)

  //? Download PDF
  const downloadPDF = async () => {
    try {
      const data = getValues(); // Get the current form data
      const transformedData = data.products.map((product) => ({
        ...product,
        type: type,
        date: DateToUTCDate(data.date),
        customer: type === "revenue" ? data.customer : "",
      }));
      console.log('TRANSFORMED-DATA: ', data)
      const url = 'http://localhost:5000/api/revenue/invoice';

      setIsDownloadingPDF(true);
      const response = await axios.post(url, transformedData);
      // const { fileName } = response.data;

      const res = await axios.get(`${url}/invoice.pdf`, { responseType: 'blob' });
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      // Get the customer name or use a default value if not available
      const customerName = data.customer ? data.customer.toLowerCase().split(" ").join("-") : randomId;

      // Download as invoice.pdf with the customer name
      setIsDownloadingPDF(false);
      saveAs(pdfBlob, `invoice_${customerName}-${randomId}.pdf`);
    } catch (error) {
      setIsDownloadingPDF(false);
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Error generating PDF.",
        description: "Please try again later.",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })
    }
  };

  //? FORM SUBMISSION Handler
  const onSubmit = useCallback(
    async (data) => {
      console.log("Submitted Form data: ", data);
      await downloadPDF();
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
      const transformedData = data.products.map((product) => ({
        ...product,
        type: type,
        date: DateToUTCDate(data.date),
        customer: type === "revenue" ? data.customer : "",
      }));

      //? Log transformed data
      console.log("Revenue transformed data to submit: ", transformedData);
      console.log(
        "Revenue transformed data type: ",
        JSON.stringify(transformedData)
      );

      //? Make API request
      try {
        let res;
        if (type === "expense") {
          res = await createExpense(transformedData).unwrap();
        } else if (type === "revenue") {
          res = await createRevenue(transformedData).unwrap();
        }

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
          customer: "",
          products: [{ id: 1, description: "", amount: "", category: "" }],
        });
        setProductList([{ id: 1 }]); // Reset product list to initial state
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
    [dispatch, type, currentUser, createExpense, createRevenue, reset, toast, deleteProductItem]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {/* <DialogContent className="md:min-w-fit md:max-w-[80%]"> */}
      <DialogContent className="md:min-w-fit md:max-w-full">
        <DialogHeader>
          <DialogTitle>
            Create a new <span className="capitalize">{type}</span> transaction
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-sm space-y-4 h-fit"
        >
          {/* //? Date \ Customer */}
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
            {/* Customer Name */}
            {type === "revenue" && (
              <div>
                <label>Customer</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...register("customer")}
                />
              </div>
            )}
          </section>

          {/* //? Products header */}
          <h1 className="font-medium">Products Entry List</h1>

          <ul className="max-h-96 pr-2 list-none overflow-y-scroll">
            {productList.map((product, index) => (
              <>
                <ProductListItem
                  key={product.id}
                  index={index}
                  type={type}
                  register={register}
                  errors={errors}
                  control={control}
                  validateAmount={validateAmount}
                  validateQuantity={validateQuantity}
                  handleCategoryChange={handleCategoryChange}
                  deleteProductItem={deleteProductItem}
                  productList={productList}
                />
                <Separator className="mb-4" />
              </>
            ))}
          </ul>
          <div className="w-full flex justify-center">
            <Button
              variant="ghost"
              className="mx-auto text-muted-foreground flex gap-2"
              onClick={(e) => addNewProductItem(e)}
            >
              <Plus className="size-4" />
              <span>Add New</span>
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <div className="">
              {/* Download button */}
              {/* <Button
                type="button"
                variant={"outline"}
                onClick={downloadPdf}
                disabled={isDownloadingPDF}
                className="mt-2 md:mt-0 flex justify-center items-center"
              >
                <div className="flex items-center gap-2" >
                  {isDownloadingPDF ? <><Loader className="animate-spin size-4" /><span>Downloading</span></> : <><Download className="size-4" /><span>Download</span>
                  </>}
                </div>
              </Button> */}
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
                <Button type="submit" disabled={loading || isDownloadingPDF}>
                  {!loading && !isDownloadingPDF ? (
                    <span className="flex items-center gap-2">
                      <Download className="size-4" />
                      <p>Create</p>
                    </span>
                  ) : isDownloadingPDF ? (
                    <span className="flex items-center gap-2">
                      <Loader className="animate-spin size-4" />
                      <span>Generating Invoice</span>
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

//? Product entry list-item
const ProductListItem = ({
  type,
  register,
  errors,
  control,
  validateAmount,
  validateQuantity,
  handleCategoryChange,
  index,
  deleteProductItem,
  productList
}) => {
  return (
    <li className="min-w-[60rem] h-20 flex items-start gap-5">
      {/* Row Title */}
      <div className="min-w-fit h-full">
        <h3 className="py-1 px-3 text-[0.8rem] font-medium uppercase dark:bg-muted border dark:border-foreground/40 rounded-full shadow-md shadow-indigo-400 dark:shadow-none">
          Product {index < 9 ? `0${index + 1}` : index + 1}
        </h3>
      </div>

      {/* Fields */}
      <main className="grid grid-cols-4 gap-4 items-center justify-between">
        {/* //? Category */}
        <div className="grid flex-1">
          <label>
            Category <RequiredStar />
          </label>
          {/* Controller connects the CategoryPicker to the react-hook-form's state */}
          <Controller
            name={`products[${index}].category`}
            control={control}
            render={({ field }) => (
              <CategoryPicker
                type={type}
                onChange={(value) => handleCategoryChange(index, value)}
                field={field}
              />
            )}
          />
          {/* //! error Div */}
          <div className="h-6">
            {errors.products?.[index]?.category && (
              <p className="mt-2 text-red-600 text-xs">Category is required</p>
            )}
          </div>
        </div>

        {/* //? Description */}
        <div className="grid flex-1">
          <label>
            Description <RequiredStar />
          </label>
          <Input
            placeholder={type === "expense" ? "Internet" : "Lipstick"}
            autoComplete="off"
            {...register(`products[${index}].description`, {
              required: "Description is required",
            })}
            className=""
          />
          {/* //! error Div */}
          <div className="h-6">
            {errors.products?.[index]?.description && (
              <p className="mt-2 text-red-600 text-xs">
                {errors.products?.[index]?.description?.message}
              </p>
            )}
          </div>
        </div>

        {/* //? Amount */}
        <div className="grid flex-1">
          <label>
            Amount (NPR) <RequiredStar />
          </label>
          <Input
            type="number"
            placeholder="XXXXX"
            {...register(`products[${index}].amount`, {
              validate: validateAmount,
            })}
          />
          {/* //! error Div */}
          <div className="h-6">
            {errors.products?.[index]?.amount && (
              <p className="mt-2 text-red-600 text-xs">
                {errors.products?.[index]?.amount?.message}
              </p>
            )}
          </div>
        </div>

        {/* //? Quantity */}
        <div className="grid flex-1">
          <label>Quantity (Optional)</label>
          <Input
            type="number"
            placeholder="XX"
            {...register(`products[${index}].quantity`, {
              validate: validateQuantity,
            })}
          />
          {/* //! error Div */}
          <div className="h-6">
            {errors.products?.[index]?.quantity && (
              <p className="mt-2 text-red-600 text-xs">
                {errors.products?.[index]?.quantity?.message}
              </p>
            )}
          </div>
        </div>
      </main>
      <div className="h-full flex justify-center items-center">
        <Button
          variant="outline"
          size="icon"
          className="hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/10"
          onClick={() => deleteProductItem(index)}
          disabled={productList.length <= 1}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
};

//? Required star
const RequiredStar = () => <span className="ml-1 text-red-500 text-md">*</span>;
