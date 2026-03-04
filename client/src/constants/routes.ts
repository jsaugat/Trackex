const ROUTES = {
  HOME: "/",
  DASHBOARD: (orgSlug: string) => `/${orgSlug}/dashboard`,
  TRANSACTIONS: (orgSlug: string) => `/${orgSlug}/transactions`,
  ORG_SETTINGS: (orgSlug: string) => `/${orgSlug}/admin/organization`,
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  INVITE: "/invite",
  NOT_AUTHORIZED: "/not-authorized",
};

export { ROUTES };
