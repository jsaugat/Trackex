const ROUTES = {
  HOME: "/",
  DASHBOARD: (orgSlug: string) => `/${orgSlug}/dashboard`,
  TRANSACTIONS: (orgSlug: string) => `/${orgSlug}/transactions`,
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  INVITE: "/invite",
  NOT_AUTHORIZED: "/not-authorized",
};

export { ROUTES };
