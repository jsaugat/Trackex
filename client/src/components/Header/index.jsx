import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import PageTitle from "@/components/Header/PageTitle/PageTitle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/slices/api/auth.api";
import { clearCredentials } from "@/slices/authSlice";
import GradientBorder from "../GradientBorder";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/theme-provider.jsx";
import { getCurrentTime } from "@/utils/helpers";
import { LogOut, Clock3 } from "lucide-react";

export default function index() {
  // States
  const currentUser = useSelector((state) => state.auth.userInfo);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  // Routes/*  */
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isTransactions = location.pathname === "/transactions";

  // Utils
  const greet = () => {
    const now = new Date().getHours();
    let greeting;
    if (now >= 5 && now < 12) {
      greeting = "Good Morning";
    } else if (now >= 12 && now < 17) {
      greeting = "Good Afternoon";
    } else if (now >= 17 && now < 20) {
      greeting = "Good Evening";
    } else {
      greeting = "Good Night";
    }

    return greeting;
  };

  // Event Handlers
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Dynamically generate title based on pathname
  const getTitle = () => {
    const { pathname } = location;
    switch (pathname) {
      case "/":
        return `${greet()}, ${currentUser?.name.split(" ")[0]}!`;
      case "/transactions":
        return "Transactions";
      case "/admin/users":
        return "Manage Team"; // Or any appropriate title for admin users
      default:
        return "";
    }
  };
  return (
    <header className="mb-5 flex items-center justify-between">
      <section className="flex items-center gap-4">
        {/* Display dynamically generated title */}
        <PageTitle title={getTitle()} className="hidden md:block" />
      </section>
      <section className="flex items-center gap-3">
        {/* Current Time */}
        <div className="p-2 px-3 text-sm dark:text-muted-foreground bg-background border rounded-full shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2">
          <Clock3 className="size-3" />
          <span>{getCurrentTime()}</span>
        </div>
        {/* Current User Profile */}
        <ProfileDropdown
          handleLogout={handleLogout}
          trigger={
            // Gradient div
            <div className="p-[0.05rem] rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-300 dark:bg-gradient-to-r from-secondary via-primary/20 to-secondary hover:bg-indigo-300 dark:hover:bg-primary/40">
              {/* Profile Button */}
              <button className="relative p-1 px-1 pr-2.5 rounded-full bg-card cursor-default flex gap-2 justify-center items-center">
                <mark className="size-8 bg-transparent flex items-center justify-center">
                  <img
                    width={30}
                    height={30}
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${currentUser?.name}`}
                    alt="avatar"
                    className="rounded-full bg-muted dark:bg-foreground"
                  />
                </mark>
                <div className="capitalize">{currentUser?.name}</div>
                <ChevronDown
                  size="12"
                  strokeWidth={"3px"}
                  className="ml-2 text-muted-foreground"
                />
              </button>
            </div>
          }
        />

        {/* Logout Button */}
        {/* <GradientBorder
            radius="full"
            className="dark:bg-gradient-to-b from-primary/30 via-secondary to-secondary dark:hover:via-primary/30"
          >
            <div
              onClick={handleLogout}
              className="group border rounded-full bg-card aspect-square p-3 dark:hover:bg-muted cursor-pointer"
            >
              <LogOut
                strokeWidth="2px"
                size="18px"
                className="group-hover:text-muted-foreground"
              />
            </div>
          </GradientBorder> */}
      </section>
      {/* <Separator className="mt-4  bg-muted" /> */}
      {/* <RenderBreadcrumb isHome={isHome} currentRoute={location.pathname} /> */}
    </header>
  );
}

const ProfileDropdown = ({ trigger, handleLogout }) => {
  const { email } = useSelector((state) => state.auth.userInfo);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 rounded-xl bg-background/30 dark:bg-transparent backdrop-blur-xl dark:backdrop-blur-lg shadow-lg ">
        <DropdownMenuLabel>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div
            onClick={handleLogout}
            className="group size-full flex items-center gap-6"
          >
            <LogOut strokeWidth="1.8px" size="16px" />
            <div className="">Logout</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const RenderBreadcrumb = ({ currentRoute, isHome }) => {
  return isHome ? (
    <></>
  ) : (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            {currentRoute.slice(1)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
