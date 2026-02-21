import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import ErrorBoundary from "./utils/ErrorBoundary";
// RTK
import { Provider } from "react-redux";
import { store } from "@/store";
// router
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
// import V0 from "./components/v0";
import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Invite from "@/pages/Invite";
import PrivateRoute from "@/components/PrivateRoute";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import Users from "./pages/Admin/Users";
import AdminRoute from "./components/AdminRoute";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const routes = createRoutesFromElements(
  <Route errorElement={<div>Something went wrong</div>}>
    <Route path="/" element={<App />}>
      <Route index element={<Dashboard />} />
      <Route path="transactions" element={<Transactions />} />
      <Route element={<PrivateRoute />}>
        <Route path="admin/*" element={<AdminRoute />}>
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Route>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Signup />} />
    <Route path="/invite/:token" element={<Invite />} />
  </Route>,
);

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary fallback="Something went wrong :(">
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </ErrorBoundary>,
);
