import { Outlet, Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/storeHooks";

export default function OrgLayout() {
  const { workspaceSlug } = useParams();
  const { userInfo } = useAppSelector((state) => state.auth);

  // Not logged in → let PrivateRoute handle it
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is a member of the organization
  console.log("userinfo", userInfo, userInfo.organization.slug, workspaceSlug);
  const isMember = userInfo.organization.slug === workspaceSlug;

  // Org not found or user not part of it
  if (!isMember) {
    return <Navigate to="/not-authorized" replace />;
  }

  return (
    <div className="org-layout">
      {/* Sidebar, header, org switcher etc */}
      <Outlet />
    </div>
  );
}
