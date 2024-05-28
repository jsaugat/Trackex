import * as React from "react";
// Icons
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";

import { useTheme } from "@/components/theme-provider";

import { Button } from "@/components/ui/button";
import GradientBorder from "./GradientBorder";

export function ModeToggle({ isCollapsed, className }) {
  const { theme, setTheme } = useTheme();

  return (
    <main className={className}>
      {isCollapsed && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="ring-2 ring-muted dark:bg-background"
        >
          {theme === "light" ? (
            <div className="p-1">
              <LightModeIcon fontSize="small" className="rotate-[-30deg]" />
            </div>
          ) : (
            <div className="p-1">
              <NightlightRoundIcon
                fontSize="small"
                className="rotate-[-30deg]"
              />
            </div>
          )}
        </Button>
      )}

      {!isCollapsed && (
        <GradientBorder
          radius="md"
          className="dark:bg-gradient-to-b from-primary/30 via-secondary to-secondary"
        >
          <section className="bg-muted border dark:border-none rounded-md flex p-1">
            {/* light */}
            <Button
              size="sm"
              onClick={() => setTheme("light")}
              variant={`${theme === "dark" ? "ghost" : "default"}`}
              className={`${
                theme === "light"
                  ? "bg-background text-foreground hover:bg-background"
                  : "dark:text-muted-foreground"
              } flex gap-2 items-center justify-center text-sm`}
            >
              <LightModeIcon fontSize="small" className="rotate-[-30deg]" />
              <span>Light</span>
            </Button>
            {/* dark */}
            <Button
              size="sm"
              onClick={() => setTheme("dark")}
              variant={`${theme === "dark" ? "default" : "ghost"}`}
              className={`${
                theme === "dark"
                  ? "dark:bg-background dark:text-foreground"
                  : "text-muted-foreground hover:text-inherit hover:bg-secondary"
              } flex gap-2 items-center justify-center text-sm hover:text-muted-foreground`}
            >
              <NightlightRoundIcon
                fontSize="small"
                className="rotate-[-30deg]"
              />
              <span>Dark</span>
            </Button>
          </section>
        </GradientBorder>
      )}
    </main>
  );
}

// Alternative (comment everything above and uncomment below this line for dropdown theme toggler button) :
// import * as React from "react";
// import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
// import { useTheme } from "@/components/theme-provider";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export function ModeToggle() {
//   const { theme, setTheme } = useTheme();

//   return (
// <DropdownMenu>
//   <DropdownMenuTrigger asChild>
//     <Button variant="outline" size="icon">
//       <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//       <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   </DropdownMenuTrigger>
//   <DropdownMenuContent align="end">
//     <DropdownMenuItem onClick={() => setTheme("light")}>
//       Light
//     </DropdownMenuItem>
//     <DropdownMenuItem onClick={() => setTheme("dark")}>
//       Dark
//     </DropdownMenuItem>
//     <DropdownMenuItem onClick={() => setTheme("system")}>
//       System
//     </DropdownMenuItem>
//   </DropdownMenuContent>
// </DropdownMenu>
//   );
// }
