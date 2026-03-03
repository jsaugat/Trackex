import React from "react";
import { cn } from "@/lib/utils";

interface NoRecordsProps {
  icon: React.ElementType;
  missingThing: string;
  message?: string;
  className?: string;
}

function NoRecords({
  icon: Icon,
  missingThing,
  message,
  className,
}: NoRecordsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-6 mx-auto text-sm text-center text-muted-foreground bg-muted/10 border border-dashed rounded-2xl gap-3 w-full h-fit min-h-[120px] mt-4",
        className,
      )}
    >
      <div className="p-3 rounded-full bg-muted/10">
        <Icon strokeWidth={1.5} className="size-8 text-muted-foreground/60" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-foreground">No {missingThing} found</p>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          {message || `There are no recorded ${missingThing} at the moment.`}
        </p>
      </div>
    </div>
  );
}

export default NoRecords;
