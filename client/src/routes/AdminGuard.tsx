import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/storeHooks";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function AdminGuard() {
  const { userInfo } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const isAdmin = userInfo?.role === "owner" || userInfo?.role === "admin";

  useEffect(() => {
    if (!isAdmin) {
      toast({
        description: "You are not authorized to access this page.",
      });
    }
  }, []);

  return isAdmin ? <Outlet /> : <Navigate to={ROUTES.NOT_AUTHORIZED} replace />;
}
