import React from "react";
import {
  ArrowRightLeft,
  Activity,
  ChevronsRight,
  ChevronsLeft,
  Users,
  CircleGauge,
} from "lucide-react";
import { useWindowWidth } from "@react-hook/window-size";
import { Nav } from "./Nav";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo/Logo";
import { useAppSelector } from "@/hooks/storeHooks";
import { useSidebar } from "@/context/useSidebar";

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { userInfo } = useAppSelector((state) => state.auth);
  const screenWidth = useWindowWidth();
  const isMobile = screenWidth < 768;

  const orgSlug = userInfo?.organization?.slug;

  const navLinks = [
    {
      title: "Dashboard",
      href: `/${orgSlug}/dashboard`,
      icon: CircleGauge,
    },
    {
      title: "Transactions",
      href: `/${orgSlug}/transactions`,
      icon: ArrowRightLeft,
    },
  ];

  // Only show Manage Team to admins and owners
  if (userInfo?.role === "admin" || userInfo?.role === "owner") {
    navLinks.push({
      title: "Team",
      href: `/${orgSlug}/admin/users`,
      icon: Users,
    });
  }

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
        links={navLinks}
      />
    </aside>
  );
}
