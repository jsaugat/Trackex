import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.scss";
import ErrorBoundary from "./utils/ErrorBoundary.jsx";
// RTK
import { Provider } from "react-redux";
import { store } from "@/store.js";
// router
import {
  Route,
  Router,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
// import V0 from "./components/v0";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import PrivateRoute from "@/components/PrivateRoute";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import Users from "./pages/Admin/Users.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const routes = createRoutesFromElements(
  <Route>
    <Route path="/" element={<App />}>
      {/* Place Outlet in App.jsx */}
      <Route path="" element={<Dashboard />} />
      <Route path="transactions" element={<Transactions />} />
      {/* Private Routes */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="admin/*" element={<AdminRoute />}>
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Route>
    {/* Separate routes for Login and Signup without layout */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Route>
);

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary fallback="Something went wrong :(">
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ErrorBoundary>
);
