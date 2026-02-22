import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/hooks/storeHooks";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthGuard() {
  const { userInfo } = useAppSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}
