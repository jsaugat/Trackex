import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/storeHooks";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function AdminRoute() {
  const { userInfo } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  useEffect(() => {
    if (!userInfo?.isAdmin) {
      toast({
        // variant: "minimal",
        description: "You are not authorized to access this page.",
      });
    }
  }, []);
  return userInfo?.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
