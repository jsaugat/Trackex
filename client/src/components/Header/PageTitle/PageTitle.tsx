import { cn } from "@/lib/utils";
import React from "react";

interface PageTitleProps {
  title: string;
  className?: string;
}

export default function PageTitle({ title, className }: PageTitleProps) {
  return <h1 className={cn("text-3xl font-semibold", className)}>{title}</h1>;
}
