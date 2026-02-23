import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

// UI Components
import PageTitle from "@/components/Header/PageTitle/PageTitle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  ChevronDown,
  LogOut,
  Clock3,
  Crown,
  ShieldCheck,
  Building2,
} from "lucide-react";

// Hooks & State
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { useLogoutMutation } from "@/slices/api/auth.api";
import { clearCredentials } from "@/slices/authSlice";

// Utils & Constants
import { ROUTES } from "@/constants/routes";
import { getCurrentTime } from "@/utils/helpers";

export default function Header() {
  const user = useAppSelector((state) => state.auth.userInfo);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  /** Returns greeting based on current hour */
  const greet = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 20) return "Good Evening";
    return "Good Night";
  };

  /** Logout handler */
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  /** Generate dynamic page title based on current route */
  const getTitle = () => {
    const { pathname } = location;
    switch (pathname) {
      case ROUTES.DASHBOARD(user?.organization?.slug):
        return `${greet()}, ${user?.name.split(" ")[0]}!`;
      case ROUTES.TRANSACTIONS(user?.organization?.slug):
        return "Transactions";
      case "/admin/users":
        return "Manage Team";
      default:
        return "";
    }
  };

  return (
    <header className="mb-5 flex items-center justify-between">
      {/* Page Title */}
      <section className="flex items-center gap-4">
        <PageTitle title={getTitle()} className="hidden md:block" />
      </section>

      {/* Right section: Time + Organization + Profile Dropdown */}
      <section className="flex items-center gap-3">
        {/* Organization Name */}
        {user?.organization?.name && (
          <div className="hidden sm:flex p-2 px-3 text-sm dark:text-muted-foreground bg-background border rounded-full shadow-lg shadow-indigo-200 dark:shadow-none items-center gap-2">
            <Building2 className="size-3 text-indigo-500" />
            <span className="font-medium">{user.organization.name}</span>
          </div>
        )}

        {/* Current Time */}
        <div className="p-2 px-3 text-sm dark:text-muted-foreground bg-background border rounded-full shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2">
          <Clock3 className="size-3" />
          <span>{getCurrentTime()}</span>
        </div>

        {/* Profile Dropdown */}
        <ProfileDropdown
          handleLogout={handleLogout}
          trigger={
            <div className="p-[0.05rem] rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-300 dark:bg-linear-to-r from-secondary via-primary/20 to-secondary hover:bg-indigo-300 dark:hover:bg-primary/40">
              <button className="relative p-1 px-1 pr-2.5 rounded-full bg-card cursor-default flex gap-2 justify-center items-center">
                <mark className="size-8 bg-transparent flex items-center justify-center">
                  <img
                    width={30}
                    height={30}
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.name}`}
                    alt="avatar"
                    className="rounded-full bg-muted dark:bg-foreground"
                  />
                </mark>
                <div className="capitalize">{user?.name}</div>
                {user?.role && user.role !== "standard" && (
                  <Badge
                    variant="secondary"
                    className="ml-1 text-[10px] py-0 px-1.5 h-4 capitalize opacity-70 border-none bg-indigo-100 dark:bg-primary/20 text-indigo-700 dark:text-white flex items-center gap-1"
                  >
                    {user.role === "owner" ? (
                      <Crown className="size-2.5" />
                    ) : (
                      <ShieldCheck className="size-2.5" />
                    )}
                    {user?.role}
                  </Badge>
                )}
                <ChevronDown
                  size="12"
                  strokeWidth="3px"
                  className="ml-2 text-muted-foreground"
                />
              </button>
            </div>
          }
        />
      </section>
    </header>
  );
}

/** Profile dropdown component */
interface ProfileDropdownProps {
  trigger: React.ReactNode;
  handleLogout: () => void;
}

const ProfileDropdown = ({ trigger, handleLogout }: ProfileDropdownProps) => {
  const userInfo = useAppSelector((state) => state.auth.userInfo || []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 rounded-xl bg-background/30 dark:bg-transparent backdrop-blur-xl dark:backdrop-blur-lg shadow-lg">
        <DropdownMenuLabel>{userInfo?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div
            onClick={handleLogout}
            className="group flex items-center gap-6 w-full"
          >
            <LogOut strokeWidth="1.8px" size="16px" />
            <div>Logout</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/** Breadcrumb renderer (optional) */
interface RenderBreadcrumbProps {
  currentRoute: string;
  isHome: boolean;
}

const RenderBreadcrumb = ({ currentRoute, isHome }: RenderBreadcrumbProps) => {
  if (isHome) return null;

  return (
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
