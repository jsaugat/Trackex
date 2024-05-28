import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // to get user data from state and also dispatch
import { useLoginMutation } from "@/slices/api/auth.api"; // hit backend api
import { setCredentials } from "@/slices/authSlice"; // after hitting backend api and getting data we gotta set it to STATE and LOCAL-STORAGE
// toast
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { toast as sonnerToast } from "sonner";
import Logo from "@/components/Logo/Logo";
import { ThemeProvider } from "@/components/theme-provider";
import FormContainer from "@/components/AuthForm";
import Icon from "@/components/Logo/Icon";
import { Toaster } from "@/components/ui/toaster";
import { Loader } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    ref.current.focus();
  }, []);

  const { userInfo } = useSelector((state) => state.auth);
  // check auth state in devtools
  // (notion: https://shorturl.at/eDKZ0)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { toast } = useToast();

  //? Navigate to the Dashboard if logged in already.
  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    // empty fields validation
    if (password === "" || email === "") {
      sonnerToast.error("Please fill in all the fields !!");
    }
    try {
      //? Step 1: Hit backend api and retrieve data
      const res = await login({ email, password }).unwrap(); // unwrap unwraps the promise?
      //? Step 2: Dispatch and set authenticated 'userInfo' in authSlice and local-storage.
      dispatch(setCredentials({ ...res }));
      navigate("/");
      toast({
        title: `Logged in as ${res.name}`,
        description: "Your preferences are now personalized.",
        action: <ToastAction altText="Okay">Okay</ToastAction>,
      });
    } catch (err) {
      console.log(err?.data?.message || err.error);
      toast({
        variant: "destructive",
        title: err?.data?.message || err.error,
        description: "There was a problem in your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
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
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
        <FormContainer submitHandler={handleLogin} className="py-20">
          <h3 className="text-3xl font-bold mb-[4rem] flex items-center gap-3">
            Log in to Tracker
          </h3>
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className={`${inputCSS}`}
            />
            <Button
              disabled={isLoading}
              variant=""
              className="mt-14 w-full rounded-lg"
            >
              {isLoading && <Loader className="animate-spin size-4" />}
              {!isLoading && <span>Log In</span>}
            </Button>
          </div>
          <div className="mt-12">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </div>
          {/* {error && <div className="error">{error}</div>} */}
        </FormContainer>
        <Toaster />
      </main>
    </ThemeProvider>
  );
}

export default Login;
