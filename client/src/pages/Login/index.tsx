import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/storeHooks"; // to get user data from state and also dispatch
import { useLoginMutation } from "@/slices/api/auth.api"; // hit backend api
import { setCredentials } from "@/slices/authSlice"; // after hitting backend api and getting data we gotta set it to STATE and LOCAL-STORAGE
// toast
import { toast } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import FormContainer from "@/components/AuthForm";
import Icon from "@/components/Logo/Icon";
import { Loader, Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  const { userInfo } = useAppSelector((state) => state.auth);
  // check auth state in devtools
  // (notion: https://shorturl.at/eDKZ0)
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  //? Navigate to the Dashboard if logged in already.
  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // empty fields validation
    if (password === "" || email === "") {
      toast.error("Please fill in all the fields!");
      return; // Stop execution
    }

    try {
      //? Step 1: Hit backend api and retrieve data
      const res = await login({ email, password }).unwrap(); // unwrap unwraps the promise?
      //? Step 2: Dispatch and set authenticated 'userInfo' in authSlice and local-storage.
      dispatch(setCredentials({ ...res }));
      navigate("/");
      toast.success(`Logged in as ${res.name}`, {
        description: "Your preferences are now personalized.",
      });
    } catch (err) {
      console.log(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error || "Login failed", {
        description: "There was a problem in your request.",
      });
    }
  };

  const inputCSS =
    "rounded-lg px-3 py-1 bg-transparent border focus:ring-white/20 focus:border-white/20 w-[20rem] placeholder-muted-foreground/50";

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="h-screen w-full flex items-center justify-center bg-secondary/20">
        <Icon className="absolute top-6 left-6 size-8" />
        <Button
          variant="outline"
          className="absolute top-6 right-6"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </Button>
        <FormContainer submitHandler={handleLogin} className="py-20">
          <div className="mb-6 text-left w-full">
            <h3 className="text-3xl font-bold">Welcome back</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to access your workspace.
            </p>
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="" className="mb-1 mt-3 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              ref={ref}
              className={`${inputCSS}`}
            />
            <label htmlFor="" className="mb-1 mt-3 font-medium">
              Password
            </label>
            <div className="relative w-full sm:w-[20rem]">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className={`${inputCSS} w-full pr-10`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="w-full flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-xs text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              disabled={isLoading}
              variant="default"
              className="mt-14 w-full rounded-lg"
            >
              {isLoading && <Loader className="animate-spin size-4" />}
              {!isLoading && <span className="font-semibold">Sign In</span>}
            </Button>
          </div>
          <div className="mt-4 mx-auto">
            Not associated with any organization?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </div>
          {/* {error && <div className="error">{error}</div>} */}
        </FormContainer>
      </main>
    </ThemeProvider>
  );
}

export default Login;
