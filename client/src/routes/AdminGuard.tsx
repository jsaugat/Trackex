import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/storeHooks";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { useEffect } from "react";

export default function AdminGuard() {
  const { userInfo } = useAppSelector((state) => state.auth);
  const isAdmin = userInfo?.role === "owner" || userInfo?.role === "manager";

  useEffect(() => {
    if (!isAdmin) {
      toast("Unauthorized Access", {
        description: "You are not authorized to access this page.",
      });
    }
  }, [isAdmin]);

  return isAdmin ? <Outlet /> : <Navigate to={ROUTES.NOT_AUTHORIZED} replace />;
}
