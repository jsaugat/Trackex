import React from "react";
import { AudioLines } from "lucide-react";
import Icon from "./Icon";
import { useTheme } from "@/components/theme-provider";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useAppSelector } from "@/hooks/storeHooks";

export default function Logo({ isCollapsed, textClasses }) {
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth?.userInfo);

  return (
    <Link to="/">
      <div className="flex items-center justify-center gap-2 cursor-pointer">
        <div className={`${isCollapsed && "p-2"}`}>
          <Icon theme={theme} />
          {/* <AudioLines /> */}
        </div>
        {!isCollapsed && (
          <h2
            className={cn(
              "text-xl font-bold text-transparent bg-clip-text bg-black dark:bg-white",
              textClasses,
            )}
          >
            {user?.organization?.name || "Trackex"}
          </h2>
        )}
      </div>
    </Link>
  );
}
