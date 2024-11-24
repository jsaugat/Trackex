import React from "react";
import { AudioLines } from "lucide-react";
import Icon from "./Icon.jsx";
import { useTheme } from "@/components/theme-provider.jsx";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn.js";

export default function Logo({ isCollapsed, textClasses }) {
  const { theme } = useTheme();
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
              textClasses
            )}
          >
            TRACKEX
          </h2>
        )}
      </div>
    </Link>
  );
}
