import { Link } from "react-router-dom";
// import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

export function Nav({ links, isCollapsed, className }) {
  const location = useLocation();
  const navPadding = "p-4";

  return (
    <TooltipProvider>
      {/* group */}
      <main
        data-collapsed={isCollapsed}
        className={`${className} group flex flex-col items-center justify-between`}
      >
        {/* Nav */}
        <nav
          className={`${navPadding} group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:${navPadding} grid gap-1`}
        >
          {links.map((link, index) => {
            const isActive = location.pathname === link.href;
            //? isCollapsed
            return isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={link.href}
                    className={cn(
                      buttonVariants({
                        variant: isActive ? "default" : "ghost",
                        size: "icon",
                      }),
                      "h-10 w-10",
                      isActive &&
                        "dark:bg-muted dark:text-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.href}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{link.title}</TooltipContent>
              </Tooltip>
            ) : (
              //? is not Collapsed
              <Link
                key={index}
                to={link.href}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "default" : "ghost",
                  }),
                  isActive &&
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white border dark:border-muted",
                  "flex justify-start gap-4 w-44"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>
        <ModeToggle isCollapsed={isCollapsed} className={navPadding} />
      </main>
    </TooltipProvider>
  );
}
