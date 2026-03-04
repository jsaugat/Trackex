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
        return "";
      case ROUTES.TRANSACTIONS(user?.organization?.slug):
        return "Transactions";
      default: {
        const slug = user?.organization?.slug;
        if (slug && pathname === `/${slug}/admin/users`) return "Team";
        if (slug && pathname === ROUTES.ORG_SETTINGS(slug))
          return "Organization";
        return "";
      }
    }
  };

  const isDashboard =
    location.pathname === ROUTES.DASHBOARD(user?.organization?.slug);

  return (
    <header className="mb-5 flex items-center justify-between">
      {/* Page Title */}
      {/* <section className="flex items-center gap-4">
        <PageTitle title={getTitle()} className="hidden md:block" />
      </section> */}

      {/* Breadcrumb Navigation */}
      {!isDashboard ? (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={() =>
                  navigate(ROUTES.DASHBOARD(user?.organization?.slug ?? ""))
                }
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            {getTitle() && (
              <>
                <BreadcrumbSeparator className="hidden sm:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      ) : (
        <div></div>
      )}

      {/* Right section: Time + Organization + Profile Dropdown */}
      <section className="flex items-center gap-3">
        {/* Profile Dropdown */}
        <ProfileDropdown
          handleLogout={handleLogout}
          trigger={
            <div className="p-[0.05rem] rounded-full shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-300 dark:bg-linear-to-r from-secondary via-primary/20 to-secondary hover:bg-indigo-300 dark:hover:bg-primary/40">
              <button className="relative p-1 px-1 pr-2.5 rounded-full bg-card cursor-default flex justify-center items-center">
                {/* Avatar */}
                <mark className="size-8 bg-transparent flex items-center justify-center">
                  <img
                    width={30}
                    height={30}
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.name}`}
                    alt="avatar"
                    className="rounded-full bg-muted dark:bg-foreground"
                  />
                </mark>
                <div className="flex items-center ml-2">
                  {/* Name */}
                  <div className="capitalize">{user?.name}</div>
                  {/* Role */}
                  {user?.role && user.role !== "standard" && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-xs py-1 px-1.5 h-4 capitalize opacity-70 border-none bg-indigo-100 dark:bg-primary/20 text-indigo-700 dark:text-white flex items-center gap-1"
                    >
                      {user.role === "owner" ? (
                        <Crown className="size-2.5" />
                      ) : (
                        <ShieldCheck className="size-2.5" />
                      )}
                      {user?.role}
                    </Badge>
                  )}
                </div>
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
