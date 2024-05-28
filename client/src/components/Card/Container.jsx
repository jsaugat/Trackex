import { cn } from "@/lib/utils";
import React from "react";
// import GradientBorder from "../GradientBorder";

export default function CardContainer(props) {
  return (
    <div
      {...props}
      className={cn(
        "px-6 py-5 bg-background w-full rounded-[1.45rem] border shadow-md shadow-indigo-200 dark:shadow-none flex flex-col gap-3",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
