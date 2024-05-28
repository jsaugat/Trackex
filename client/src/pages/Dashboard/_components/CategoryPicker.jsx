import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import "@/styles/app.scss";
import NewCategoryDialog from "./CreateCategoryDialog";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/slices/api/categories.api.js";
import { setCategories, deleteCategoryLocally } from "@/slices/categoriesSlice";
import { toast } from "@/components/ui/use-toast";
import { ChevronsUpDown, Check, Trash2, Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CategoryPicker({ type, onChange, field }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const {
    data: fetchedCategories,
    refetch: refetchCategories,
    isLoading: isFetchingCategories,
    error: errorFetchingCategories,
  } = useGetCategoriesQuery(type);
  // Store
  const categoriesData = useSelector((state) => state.categories.data);
  const currentUser = useSelector((state) => state.auth.userInfo);
  const [
    deleteCategory,
    { data: deletedCategory, isDeleting, error: categoryDeletionError },
  ] = useDeleteCategoryMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("FETCHED-CATEGORIES: ", fetchedCategories);
    refetchCategories();
    if (fetchedCategories) dispatch(setCategories(fetchedCategories));
  }, [fetchedCategories, deletedCategory]);

  //? categories of currentUser
  const categories = categoriesData.filter(
    // (category) => category.userId === currentUser._id && category.type === type
    (category) => category.type === type
  );

  useEffect(() => {
    // console.log("Categories :: ", categories);
    if (!value) return;
    // call the onChange callback when the value changes
    onChange(value);
  }, [onChange, value]);

  //? Current Selection
  const selectedCategory = categories?.find(
    (category) => category.name === value
  );

  //? To be called when a new category is created
  const onSuccess = useCallback(
    (category) => {
      console.log("Success Callback Triggered :: ", category);
      setValue(category.name);
      refetchCategories();
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );

  const handleCategoryDelete = async (idToDelete, catName) => {
    try {
      const deleted = await deleteCategory(idToDelete).unwrap();
      dispatch(deleteCategoryLocally(idToDelete));
      if (deleted) {
        toast({
          title: (
            <span className="inline-flex items-center justify-center gap-2">
              <Trash2 className="size-4 text-red-400" />
              <p>{catName} deleted successfully.</p>
            </span>
          ),
        });
      }
    } catch (error) {
      toast({
        title: (
          <span className="inline-flex items-center justify-center">
            <Trash2 className="size-6 text-red-400" />
            <p>Error deleting category.</p>
          </span>
        ),
        description: "Something went wrong. Try again",
      });
      console.log("ERR :: Error deleting category");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded="open"
          className="w-full justify-between p-2"
        >
          <span className={!field.value && "text-muted-foreground"}>
            {selectedCategory ? (
              <CategoryItem category={selectedCategory} />
            ) : (
              <p className="text-muted-foreground font-normal" >Select category...</p>
            )}
          </span>
          <ChevronsUpDown strokeWidth="1px" size={"13px"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[164px] md:w-[220px] p-1">
        {/* Command Box */}
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder="Search category..." />

          {/* CREATE NEW CATEGORY */}
          <NewCategoryDialog type={type} successCallback={onSuccess} />

          {/* List of Categories */}

          {/* If Empty/ Not Found */}
          {!isFetchingCategories && (
            <CommandEmpty>
              <p className="text-muted-foreground">Category not found</p>
              <p className="text-xs text-muted-foreground">
                Tip: Create a new category
              </p>
            </CommandEmpty>
          )}
          <CommandGroup className="">
            <CommandList className="" >
              {/* Scroll Section */}
              <section className="w-full max-h-[400px]">
                {isFetchingCategories && (
                  <div className="text-sm text-muted-foreground flex justify-center items-center gap-2 bg-slate-600">
                    <Loader className="my-3 size-4 animate-spin" />
                    <span>loading categories..</span>
                  </div>
                )}
                {categories &&
                  categories.map((category) => (
                    <ContextMenu key={category._id}>
                      <ContextMenuTrigger>
                        <CommandItem
                          key={category.icon}
                          onSelect={() => {
                            setValue(category.name);
                            setOpen((prev) => !prev);
                          }}
                        >
                          <CategoryItem category={category} />
                          <Check
                            className={cn(
                              "mx-2 w-4 h-4 opacity-0",
                              value === category.name && "opacity-100"
                            )}
                          />
                        </CommandItem>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem>
                          <div
                            onClick={() =>
                              handleCategoryDelete(category._id, category.name)
                            }
                            className="text-sm text-red-500 hover:text-foreground flex items-center gap-5"
                          >
                            <Trash2 className="size-3.5" />
                            Delete
                          </div>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
              </section>
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const CategoryItem = ({ category }) => (
  <div className="flex items-center gap-2">
    <span role="img">{category.icon}</span>
    <span className="text-elipsis">{category.name}</span>
  </div>
);
