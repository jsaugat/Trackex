import { Loader as LoaderLucide } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  iconSize?: number;
}

export function LoadingState({
  message = "Loading...",
  className,
  iconSize = 20,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 opacity-60 p-4",
        className
      )}
    >
      <LoaderLucide
        className="animate-spin"
        size={iconSize}
      />
      <span>{message}</span>
    </div>
  );
}
