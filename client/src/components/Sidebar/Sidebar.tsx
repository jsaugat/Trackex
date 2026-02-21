import React, { useState } from "react";
import {
  ArrowRightLeft,
  Activity,
  ChevronsRight,
  ChevronsLeft,
  Users,
} from "lucide-react";
import { useWindowWidth } from "@react-hook/window-size";
import { Nav } from "./Nav";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo/Logo";
import { useSelector } from "react-redux";
import { useSidebar } from "@/context/useSidebar";

const navLinks = [
  { title: "Dashboard", href: "/", icon: Activity },
  { title: "Transactions", href: "/transactions", icon: ArrowRightLeft },
  { title: "Team", href: "/admin/users", icon: Users },
];

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const userInfo = useSelector((state) => state.auth.userInfo || {});
  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;

  return (
    <aside className="hidden border-r border-white dark:border-border shadow-md shadow-indigo-200 dark:shadow-none h-screen bg-background dark:bg-muted/10 md:flex flex-col">
      {/* LOGO */}
      <div className="relative border-b w-full p-4 h-24 flex items-center justify-center">
        <Logo className="w-full" isCollapsed={isMobile ? true : isCollapsed} />
        {!isMobile && (
          <Button
            variant="outline"
            onClick={toggleSidebar}
            className="absolute bg-background rounded-full size-7 p-0 -bottom-[0.85rem]"
          >
            {isCollapsed ? (
              <ChevronsRight size="16" className="text-muted-foreground" />
            ) : (
              <ChevronsLeft size="16" className="text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
      {/* NAVIGATION MENU */}
      <Nav
        className="h-full pt-2"
        isCollapsed={isMobile ? true : isCollapsed}
        links={
          userInfo.isAdmin === false
            ? navLinks.filter((link) => link.href !== "/admin/users")
            : navLinks
        }
      />
    </aside>
  );
}
