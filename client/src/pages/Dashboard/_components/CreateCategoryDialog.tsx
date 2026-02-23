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
import { toast } from "sonner";
import { useCreateCategoryMutation } from "@/slices/api/categories.api";

export default function NewCategoryDialog({ type, successCallback }) {
  const [createCategory, { data, error, isLoading, isSuccess, isError }] =
    useCreateCategoryMutation();
  const [open, setOpen] = useState(false);
  const form = useForm();
  const { theme } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("type :", type);
  }, []);

  const onSubmit = useCallback(
    async (formData) => {
      console.log("FormData : ", formData);
      console.log("Type : ", type);

      toast.loading("Creating Category...", {
        id: "create-category",
      });

      try {
        const res = await createCategory({ formData, type }).unwrap();
        console.log("Response Category? : ", res);
        toast.success(`${formData.name} category added successfully.`, {
          id: "create-category",
          icon: <CheckCheck className="size-5 text-green-500" />,
        });
        form.reset({ name: "", icon: "" });
        successCallback(formData);
        setOpen((prev) => !prev); // Close Dialog
      } catch (error: any) {
        console.log("Error while adding new category :: ", error);
        toast.error(
          error?.data?.error || error.error || "Error adding category",
          {
            id: "create-category",
          },
        );
      }
    },
    [createCategory, form, setOpen],
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
