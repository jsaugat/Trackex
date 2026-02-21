import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

function NoRecords({ icon: Icon, missingThing, message, className }) {
  return (
    <main
      className={cn(
        "relative top-10 w-fit p-4 mx-auto text-sm text-center text-muted-foreground bg-muted/40 border rounded-xl gap-3",
        "flex flex-col items-center",
        className
      )}
    >
      <Icon
        strokeWidth={"1.3px"}
        className="size-20 text-[hsl(0,0,70%)] dark:text-[hsl(0,0,30%)]"
      />
      <div className="gap-1 flex items-start">
        No recorded {missingThing} <br /> currently.
      </div>
    </main>
  );
}

NoRecords.propTypes = {
  icon: PropTypes.elementType.isRequired,
  missingThing: PropTypes.string.isRequired,
};

NoRecords.defaultProps = {
  missingThing: "items",
};

export default NoRecords;
