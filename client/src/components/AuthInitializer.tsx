/**
 * This component is used to initialize the authentication state.
 * It is used in the App component to check if the user is authenticated.
 */

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
    skip: !token || !!userInfo, // skip if token is not present or user info is already present
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

  // Block rendering until userInfo is populated (or there's no token / an error)
  // This prevents a race condition where isFetching goes false before useEffect
  // dispatches setUserInfo, causing guards to see null userInfo for one frame.
  if (token && !userInfo && !isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="animate-spin text-primary size-8" />
      </div>
    );
  }

  return <>{children}</>;
}
