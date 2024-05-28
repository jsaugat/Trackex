import {
  Gem,
  Smile,
  Shirt,
  Milk,
  AudioWaveform,
  Heart,
  Footprints,
  Sun,
  Home,
  ArrowUpRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function SelectCategory({
  selectedCategory,
  setSelectedCategory,
}) {
  // Define products category data as an array of objects
  const createIcon = (IconComponent) => (
    <IconComponent strokeWidth="1.2px" size="17px" />
  );

  const categories = [
    { label: "Accessories", icon: createIcon(Gem) },
    { label: "Bodycare", icon: createIcon(Heart) },
    { label: "Footwear", icon: createIcon(Footprints) },
    { label: "Clothing", icon: createIcon(Shirt) },
    { label: "Fragrance", icon: createIcon(Milk) },
    { label: "Haircare", icon: createIcon(AudioWaveform) },
    { label: "Makeup", icon: createIcon(Smile) },
    { label: "Skincare", icon: createIcon(Sun) },
    { label: "Rent", icon: createIcon(Home) },
    { label: "Others", icon: createIcon(ArrowUpRight) },
  ];
  return (
    <>
      <Label className="mb-1">Category</Label>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full mb-3 text-muted-foreground">
          <SelectValue placeholder="Select a product category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            <hr className="mx-auto mb-1 w-[97%]" />
            {categories.map((category) => (
              <SelectItem key={category.label} value={category.label}>
                <div className="flex gap-2 items-center">
                  {category.icon}
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
