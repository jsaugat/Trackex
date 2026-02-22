import { useAppSelector } from "@/hooks/storeHooks";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { userInfo } = useAppSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}
