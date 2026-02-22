import React, { useEffect } from "react";
import { useGetProfileQuery } from "@/slices/api/auth.api";
import { useAppSelector, useAppDispatch } from "@/hooks/storeHooks";
import { setUserInfo } from "@/slices/authSlice";
import { Loader } from "lucide-react";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    data: userProfile,
    isFetching,
    isError,
  } = useGetProfileQuery(undefined, {
    skip: !token || !!userInfo,
  });

  useEffect(() => {
    if (userProfile) {
      dispatch(setUserInfo(userProfile));
    } else if (isError) {
      // If the backend returns 401/403 (e.g. token expired/invalid), clear the token
      import("@/slices/authSlice").then(({ clearCredentials }) => {
        dispatch(clearCredentials());
      });
    }
  }, [userProfile, isError, dispatch]);

  if (isFetching && !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="animate-spin text-primary size-8" />
      </div>
    );
  }

  return <>{children}</>;
}
