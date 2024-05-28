//  Tailwind Utility to merge different classes and resolve conflict
import { clsx } from "clsx"; // 'ClassValue' for typescript inputs prop type - ...inputs : ClassValue[]
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
