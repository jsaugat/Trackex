import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/storeHooks";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { useEffect } from "react";

export default function OwnerGuard() {
  const { userInfo } = useAppSelector((state) => state.auth);
  const isOwner = userInfo?.role === "owner";

  useEffect(() => {
    if (!isOwner) {
      toast("Unauthorized Access", {
        description: "Only organization owners can access this page.",
      });
    }
  }, [isOwner]);

  return isOwner ? <Outlet /> : <Navigate to={ROUTES.NOT_AUTHORIZED} replace />;
}
