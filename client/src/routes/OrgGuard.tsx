import { Outlet, Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/storeHooks";
import { ROUTES } from "@/constants/routes";

export default function OrgGuard() {
  const { orgSlug } = useParams();
  const { userInfo } = useAppSelector((state) => state.auth);

  // Check if user is a member of the organization
  const isMember = userInfo?.organization?.slug === orgSlug;
  console.log("userInfo in org guard", userInfo, orgSlug);

  if (!isMember) {
    return <Navigate to={ROUTES.NOT_AUTHORIZED} replace />;
  }

  return (
    <div className="org-layout">
      {/* Sidebar, header, org switcher etc */}
      <Outlet />
    </div>
  );
}
