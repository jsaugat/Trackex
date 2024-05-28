import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PlusSquare, CircleOff, Loader, CheckCheck } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { toast as sonnerToast } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { useCreateCategoryMutation } from "@/slices/api/categories.api";
import { useTheme } from "@/components/theme-provider";
import { useDispatch } from "react-redux";
import { createCategoryLocally } from "@/slices/categoriesSlice";
import Test from "./Test.jsx";
import { ToastAction } from "@/components/ui/toast.jsx";

export default function NewCategoryDialog({ type, successCallback }) {
  const [createCategory, { data, error, isLoading, isSuccess, isError }] =
    useCreateCategoryMutation();
  const [open, setOpen] = useState(false);
  const form = useForm();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    console.log("type :", type);
  }, []);

  const onSubmit = useCallback(
    async (formData) => {
      console.log("FormData : ", formData);
      console.log("Type : ", type);

      sonnerToast.loading("Creating Category...", {
        id: "create-category",
        className: `bg-background border border-border text-foreground`,
        duration: 5000,
      });

      try {
        const res = await createCategory({ formData, type }).unwrap();
        console.log("Response Category? : ", res);
        toast({
          title: (
            <span className="inline-flex items-center justify-center gap-3">
              <CheckCheck className="size-5 text-green-500" />
              <p>{formData.name} category added successfully.</p>
            </span>
          ),
          // description: "",
          // action: <ToastAction altText="Okay">Okay</ToastAction>,
        });
        form.reset({ name: "", icon: "" });
        successCallback(formData);
        setOpen((prev) => !prev); // Close Dialog
      } catch (error) {
        console.log("Error while adding new category :: ", error);
        toast({
          variant: "destructive",
          title: error?.data?.error || error.error,
          description: "There was a problem adding the category.",
          action: <ToastAction altText="">Try again</ToastAction>,
        });
      } finally {
        sonnerToast.dismiss();
      }
    },
    [createCategory, form, setOpen]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="mt-1 flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create new category
        </Button>
      </DialogTrigger>
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>
            Create a new <span className="capitalize">{type}</span> Category
          </DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions.
          </DialogDescription>
        </DialogHeader>
        {/* ------ FORM ------ */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Category Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category Name"
                      defaultValue=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Icon */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-[100px] w-full">
                          {/* Watch if icon is selected to conditionally render either the Icon or CircleOff */}
                          {form.watch("icon") ? (
                            <div className="flex flex-col justify-center items-center gap-2">
                              <span role="img" className="text-5xl">
                                {field.value}
                              </span>
                              <span className="text-sm text-muted-foreground font-light">
                                Click to change.
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-center items-center gap-2">
                              <CircleOff
                                strokeWidth="1.5px"
                                size="48px"
                                className="text-muted-foreground"
                              />
                              <span className="text-sm text-muted-foreground font-light">
                                Click to add icon.
                              </span>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          theme={theme}
                          set="apple"
                          categories="[frequent, objects, activity, nature, people, places, objects, symbols,]"
                          skin="2"
                          emojiSize="28"
                          perLine="12"
                          maxFrequentRows="1"
                          navPosition="bottom"
                          previewPosition="top"
                          searchPosition="sticky"
                          className="absolute top-10 right-10"
                          onEmojiSelect={(emoji) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          {/* <DevTools control={form.control} /> */}
        </Form>
        {/* Footer */}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {!isLoading && "Create"}
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
