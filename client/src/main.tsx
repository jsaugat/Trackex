import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import ErrorBoundary from "./utils/ErrorBoundary";
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

import PrivateRoute from "@/routes/PrivateRoute";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import Users from "./pages/Admin/Users";
import AdminRoute from "./routes/AdminRoute";
import OrgLayout from "./OrgLayout";
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

    {/* Under Workspace */}
    <Route path="/:orgId" element={<OrgLayout />}>
      <Route element={<PrivateRoute />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="admin/*" element={<AdminRoute />}>
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Route>

    {/* Under Root */}
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
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </PersistGate>
  </Provider>,
);
