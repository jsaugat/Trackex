import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  TrendingDown,
  TrendingUp,
  Loader,
  Save,
  CircleCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createSelector } from "reselect";
import { formatDMY } from "@/utils/helpers";
import { useDispatch } from "react-redux";
import {
  useDeleteExpenseMutation,
  useUpdateExpenseMutation,
} from "@/slices/api/expenses.api";
import {
  useDeleteRevenueMutation,
  useUpdateRevenueMutation,
} from "@/slices/api/revenue.api";
import { removeRevenueLocally } from "@/slices/revenueSlice";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { removeExpenseLocally } from "@/slices/expensesSlice";

// TRANSACTION TABLE ROW
export default function TransactionTableRow({
  _id,
  type,
  description,
  category,
  amount,
  customer,
  entity,
  date,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedCustomer, setEditedCustomer] = useState(customer);
  const [editedAmount, setEditedAmount] = useState(amount);

  // RTK Queries and Mutations
  const [
    updateRevenue,
    {
      data: updatedRevenue,
      isLoading: isUpdatingRevenue,
      error: revenueUpdateError,
    },
  ] = useUpdateRevenueMutation();
  const [
    updateExpense,
    {
      data: updatedExpense,
      isLoading: isUpdatingExpense,
      error: expenseUpdateError,
    },
  ] = useUpdateExpenseMutation();
  const [
    deleteExpense,
    {
      data: deletedExpense,
      isLoading: isDeletingExpense,
      error: expenseDeletionError,
    },
  ] = useDeleteExpenseMutation();
  const [
    deleteRevenue,
    {
      data: deletedRevenue,
      isLoading: isDeletingRevenue,
      error: revenueDeletionError,
    },
  ] = useDeleteRevenueMutation();
  const isDeleting = type === "revenue" ? isDeletingRevenue : isDeletingExpense;
  const dispatch = useDispatch();
  const { toast } = useToast();
  const inputRef = useRef(null);

  //? DELETE Handler
  const handleDelete = async (idToDelete) => {
    console.log(idToDelete);
    try {
      if (type === "revenue") {
        await deleteRevenue(idToDelete).unwrap();
        removeRevenueLocally(idToDelete);
      } else if (type === "expense") {
        await deleteExpense(idToDelete).unwrap();
        removeExpenseLocally(idToDelete);
      }
      console.log(type === "revenue" ? deletedRevenue : deletedExpense);
      toast({
        // variant: "destructive",
        title: (
          <span className="inline-flex items-center gap-3">
            <Trash2 className="size-4 text-red-500" />
            Deleted transaction successfully !
          </span>
        ),
      });
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  //? EDIT and SAVE Handler
  const handleEditSave = async (id, type) => {
    if (isEditing) {
      //? isEditing is true implies it's definitely the SAVE button that is clicked.
      const newData = {
        description: editedDescription,
        amount: editedAmount || 0,
      };
      if (type === "revenue") {
        newData.customer = editedCustomer;
      } else if (type === "expense") {
        newData.entity = editedCustomer; // Change customer to entity for expenses
      }
      console.log("Save changes", newData);
      try {
        if (type === "revenue") {
          await updateRevenue({ id, ...newData }).unwrap();
        } else if (type === "expense") {
          await updateExpense({ id, ...newData }).unwrap();
        }
        console.log("SENT UDPATE: ", { id, ...newData });
        toast({
          title: (
            <span className="inline-flex items-center gap-3">
              <CircleCheck className="size-4 text-green-500" />
              Updated transaction successfully
            </span>
          ),
        });
      } catch (error) {
        console.error("ERR:: Error updating transaction: ", error);
      }
    } else if (!isEditing) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <TableRow className="hover:bg-muted/0">
      {/* //? TYPE */}
      <TableCell className="hidden sm:table-cell">
        <div
          className={cn(
            "w-fit px-2 rounded-xl flex items-center gap-1",
            type !== "revenue" ? "bg-rose-500/10" : "bg-indigo-500/10"
          )}
        >
          {type === "revenue" && (
            <TrendingUp className={`size-4 text-indigo-500`} />
          )}
          {type === "expense" && (
            <TrendingDown className={`size-4 text-rose-500`} />
          )}
          <span className="capitalize">{type}</span>
        </div>
      </TableCell>

      {/* //? DATE */}
      <TableCell className="hidden md:table-cell min-w-28">{formatDMY(date)}</TableCell>

      {/* //? DESCRIPTION */}
      <TableCell className="max-w-28">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="max-w-full p-0 px-2.5 bg-background border rounded-md"
          />
        ) : (
          <>
            <div className="w-full text-center mb-2 px-2 text-xs text-muted-foreground border rounded-lg">
              {category}
            </div>
            <div className="w-full text-center p-1 px-2.5 font-medium bg-muted/60 rounded-md">
              {description}
            </div>
          </>
        )}
      </TableCell>

      {/* //? ENTITY */}
      <TableCell className="max-w-28">
        {isEditing ? (
          <input
            type="text"
            value={editedCustomer}
            onChange={(e) => setEditedCustomer(e.target.value)}
            className="max-w-full p-0 px-2.5 bg-background border rounded-md"
          />
        ) : (
          <div
            className={cn(
              "font-medium max-w-full text-ellipsis overflow-hidden",
              type === "expense" && !entity && "text-muted-foreground"
            )}
          >
            {type === "expense" ? (
              entity || "Unknown"
            ) : customer ? (
              customer
            ) : (
              <span className="text-muted-foreground">Unknown</span>
            )}
          </div>
        )}
      </TableCell>

      {/* //? AMOUNT */}
      <TableCell>
        {isEditing ? (
          <input
            type="number"
            value={editedAmount}
            onChange={(e) => {
              let value = e.target.value;
              // Remove any non-numeric characters (including whitespace)
              value = value.replace(/[^0-9]/g, 0);
              // Ensure the value is within the required length and minimum value
              if (value.length <= 5) {
                // If the value is empty, set it to "0"
                if (value === "") {
                  setEditedAmount(0);
                } else {
                  // Ensure the value is at least 50 if it's a number
                  setEditedAmount(value);
                }
              }
            }}
            onKeyDown={(e) => {
              // Allow control keys: backspace, delete, arrow keys, etc.
              if (
                e.key === "Backspace" ||
                e.key === "Delete" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Tab" ||
                e.key === "Enter"
              ) {
                return;
              }
              // Prevent non-numeric characters
              if (e.key.match(/[^0-9]/)) {
                e.preventDefault();
              }
            }}
            min="50"
            max="99999"
            className="max-w-28 p-0 px-2.5 bg-background border rounded-md"
          />
        ) : type === "revenue" ? (
          <span className="p-1 px-2.5 text-lg">+ {amount}</span>
        ) : (
          <span className="p-1 px-2.5 text-lg">( {amount} )</span>
        )}
      </TableCell>

      {/* //? CUSTOMIZE */}
      <TableCell>
        <div className="flex gap-2 justify-end">
          <Button
            variant={isEditing ? "" : "outline"}
            size="sm"
            className={cn(
              "w-[70px] flex items-center gap-2",
              isEditing ? "" : "bg-muted/60 border-transparent"
            )}
            onClick={() => handleEditSave(_id, type)}
          >
            {isEditing ? (
              <Save className="size-3" />
            ) : (
              <Pencil className="size-3" />
            )}
            {isEditing ? "Save" : "Edit"}
          </Button>
          {/* //! Delete Button */}
          <DeleteAlertDialog
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-transparent flex items-center gap-1"
              >
                {isDeletingExpense || isDeletingRevenue ? (
                  <Loader className="size-3 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="size-3" />
                    <span>Delete</span>
                  </>
                )}
              </Button>
            }
            handleDelete={handleDelete}
            isDeleting={isDeleting}
            transactionId={_id}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

const DeleteAlertDialog = ({
  trigger,
  transactionId,
  handleDelete,
  isDeleting,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This transaction will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete(transactionId)}
            className="border hover:border-transparent text-red-500 bg-red-500/0 hover:bg-red-500/10"
          >
            {isDeleting && <Loader className="size-4 animate-spin" />}
            {!isDeleting && <span>Delete</span>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
