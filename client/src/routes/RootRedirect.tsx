import { useAppSelector } from "@/hooks/storeHooks";
import { Navigate } from "react-router";

export function RootRedirect() {
  const { userInfo } = useAppSelector((state) => state.auth);

  if (!userInfo) return <Navigate to="/login" replace />;

  const organization = userInfo.organization;
  if (!organization) return <Navigate to="/register" replace />;

  return <Navigate to={`/${organization.workspaceSlug}/dashboard`} replace />;
}
