import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message?: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  message = "No data found",
  description,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "border rounded-lg p-12 text-muted-foreground bg-muted/50 backdrop-blur-[1px] w-full flex flex-col items-center justify-center text-center",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 justify-center">
        {icon || (
          <CircleAlert
            strokeWidth={"1.5px"}
            className="text-muted-foreground size-8 mb-2"
          />
        )}
        <h3 className="font-medium text-foreground">{message}</h3>
        {description && <p className="text-sm">{description}</p>}
      </div>
    </section>
  );
}
