import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/hooks/storeHooks";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { userInfo } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) navigate(ROUTES.REGISTER);
  }, [navigate, userInfo]);

  return children;
}
