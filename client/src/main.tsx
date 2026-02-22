import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import ErrorBoundary from "./utils/ErrorBoundary";
import { ThemeProvider } from "@/components/theme-provider";
// RTK
import { Provider } from "react-redux";
import { store } from "@/store";
// router
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import {
  Dashboard,
  Transactions,
  Login,
  Register,
  Invite,
  ForgotPassword,
  ResetPassword,
  NotAuthorized,
} from "@/pages";

import AuthGuard from "@/routes/AuthGuard";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import Users from "./pages/Admin/Users";
import AdminGuard from "./routes/AdminGuard";
import OrgGuard from "./routes/OrgGuard";
import { RootRedirect } from "./routes/RootRedirect";

import { PersistGate } from "redux-persist/integration/react";
import AuthInitializer from "./components/AuthInitializer";
import { persistor } from "@/store";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const routes = createRoutesFromElements(
  <Route errorElement={<div>Something went wrong</div>}>
    {/* Root Redirect to Dashboard if logged in */}
    <Route path="/" element={<RootRedirect />} />

    {/* Authenticated routes */}
    <Route element={<AuthGuard />}>
      {/* Under Workspace — org membership check */}
      <Route path="/:orgSlug" element={<OrgGuard />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        {/* Admin-only routes */}
        <Route path="admin/*" element={<AdminGuard />}>
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Route>

    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
    <Route path="/invite/:token" element={<Invite />} />
    <Route path="/not-authorized" element={<NotAuthorized />} />
  </Route>,
);

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <ErrorBoundary fallback="Something went wrong :(">
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </PersistGate>
    </Provider>
  </ThemeProvider>,
);
