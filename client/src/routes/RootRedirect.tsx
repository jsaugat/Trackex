import { useAppSelector } from "@/hooks/storeHooks";
import { Navigate } from "react-router";

export function RootRedirect() {
  // User info
  const { userInfo } = useAppSelector((state) => state.auth);

  // Redirect to login if not logged in
  if (!userInfo) return <Navigate to="/login" replace />;

  const organization = userInfo.organization;
  if (!organization) return <Navigate to="/register" replace />;

  // Redirect to dashboard if logged in
  return <Navigate to={`/${organization.slug}/dashboard`} replace />;
}
