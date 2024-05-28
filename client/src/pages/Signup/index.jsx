import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "@/slices/api/auth.api.js";
// after hitting backend api and getting data we gotta set it to STATE and LOCAL-STORAGE
import { setCredentials } from "@/slices/authSlice.js";
// Components
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import FormContainer from "@/components/AuthForm";
import { toast as sonnerToast } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Icon from "@/components/Logo/Icon";
import { Toaster } from "@/components/ui/toaster";
import { TriangleAlert, Loader } from "lucide-react";

function Signup() {
  const ref = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    ref.current.focus();
  }, []);

  useEffect(() => {
    // Navigate to the Dashboard if logged in already.
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  //? REGISTER Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    } else if (name === "" || email === "" || password === "") {
      toast({
        variant: "destructive",
        title: "Please fill in all the fields!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
      } catch (error) {
        console.log(error?.data?.message || error.error);
        toast({
          // variant: "destructive",
          title: (
            <span className="flex items-center gap-3">
              {" "}
              <TriangleAlert className="size-5 text-yellow-500" />{" "}
              {error?.data?.message || error.error}
            </span>
          ),
          // description: "Please try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const inputCSS =
    "rounded-lg px-3 py-1 bg-transparent border focus:ring-white/20 focus:border-white/10 w-[20rem] placeholder-muted-foreground/50";

  return (
    <ThemeProvider>
      <main className="relative h-screen w-full bg-secondary/20 flex items-center justify-center">
        <Icon className="absolute top-6 left-6 size-8" />
        <Button
          variant="outline"
          className="absolute top-6 right-6"
          onClick={() => navigate("/login")}
        >
          Log In
        </Button>
        <FormContainer submitHandler={handleSignup} className="py-12">
          <h3 className="text-3xl font-bold mb-[3rem] text-center">
            Create Your <br /> Tracker Account
          </h3>
          <div className="flex flex-col items-start">
            <label htmlFor="" className="mb-2 ">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              ref={ref}
              className={`${inputCSS}`}
            />
            <label htmlFor="" className="mb-1 mt-3 ">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className={`${inputCSS}`}
            />
            <label htmlFor="" className="mb-1 mt-3 ">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="________"
              className={`${inputCSS}`}
            />
            <label htmlFor="" className="mb-1 mt-3 ">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="________"
              className={`${inputCSS}`}
            />
            <Button
              variant=""
              className="mt-12 w-full rounded-lg"
              disabled={isLoading}
            >
              {isLoading && <Loader className="animate-spin size-4" />}
              {!isLoading && <span>Create an Account</span>}
            </Button>
          </div>
          <div className="mt-6">
            Already have an account ?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
          {/* {error && <div className="error">{error}</div>} */}
        </FormContainer>
        <Toaster />
      </main>
    </ThemeProvider>
  );
}

export default Signup;
