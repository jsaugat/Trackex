import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/storeHooks";
import {
  useLoginMutation,
  useVerifyLoginOtpMutation,
} from "@/slices/api/auth.api";
import { setCredentials } from "@/slices/authSlice";
import { toast } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import FormContainer from "@/components/AuthForm";
import Icon from "@/components/Logo/Icon";
import { Loader, Eye, EyeOff, RefreshCw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const { userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [verifyLoginOtp, { isLoading: isOtpLoading }] =
    useVerifyLoginOtpMutation();

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password === "" || email === "") {
      toast.error("Please fill in all the fields!");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      if (res?.otpRequired) {
        setIsOtpStep(true);
        toast.success("OTP sent. Check your email.", {
          description: "For now OTP is logged on the server console.",
        });
      }
    } catch (err: any) {
      console.log(err?.data?.message || err?.error);
      toast.error(err?.data?.message || err?.error || "Login failed", {
        description: "There was a problem in your request.",
      });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }

    try {
      const res = await verifyLoginOtp({ email, otp }).unwrap();
      dispatch(setCredentials({ ...res }));
      // toast.success(`Logged in as ${res.name}`, {
      //   description: "Your preferences are now personalized.",
      // });
      navigate("/");
    } catch (err: any) {
      console.log(err?.data?.message || err?.error);
      toast.error(
        err?.data?.message || err?.error || "OTP verification failed",
        {
          description: "Please try again.",
        },
      );
    }
  };

  const resendOtp = async () => {
    if (!email || !password) {
      toast.error("Please enter credentials first.");
      return;
    }

    try {
      await login({ email, password }).unwrap();
      toast.success("OTP resent.");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || "Failed to resend OTP");
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
        <FormContainer
          submitHandler={isOtpStep ? handleOtpSubmit : handleCredentialSubmit}
          className=""
        >
          <div className="mb-6 text-left w-full">
            {!isOtpStep ? (
              <h3 className="text-3xl font-bold">Welcome back</h3>
            ) : (
              <h3 className="text-[22px] font-semibold tracking-tight text-white mb-2">
                Verify your login
              </h3>
            )}
            {!isOtpStep && (
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to access your workspace.
              </p>
            )}
            {isOtpStep && (
              <p className="text-sm text-muted-foreground/90 mt-2 pr-6">
                Enter the verification code we sent to your email address:{" "}
                <span className="text-white font-medium">{email}</span>.
              </p>
            )}
          </div>

          {!isOtpStep && (
            <div className="flex flex-col items-start">
              <label htmlFor="email" className="mb-1 mt-3 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailInputRef}
                className={inputCSS}
              />
              <label htmlFor="password" className="mb-1 mt-3 font-medium">
                Password
              </label>
              <div className="relative w-full sm:w-[20rem]">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCSS} w-full pr-10`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white hover:bg-transparent transition-colors h-auto w-auto p-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
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
                disabled={isLoginLoading}
                variant="default"
                className="mt-14 w-full rounded-lg"
              >
                {isLoginLoading && <Loader className="animate-spin size-4" />}
                {!isLoginLoading && (
                  <span className="font-semibold">Sign In</span>
                )}
              </Button>
            </div>
          )}

          {isOtpStep && (
            <div className="flex flex-col items-start w-full">
              <div className="flex w-full items-center justify-between mb-3 mt-1">
                <label
                  onClick={() => document.getElementById("otp")?.focus()}
                  className="font-semibold text-[15px] cursor-text"
                >
                  Verification code
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={resendOtp}
                  className="px-2"
                >
                  <RefreshCw className="size-3.5 mr-1.5" />
                  Resend Code
                </Button>
              </div>

              <InputOTP
                id="otp"
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                containerClassName="justify-start mx-auto text-xl"
              >
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Button
                type="button"
                variant="link"
                className="text-[#999999] mt-5 text-[14.5px] p-0 h-auto font-normal underline underline-offset-[5px] decoration-[#505050] hover:text-white hover:decoration-white/80 transition-all justify-start"
                onClick={() => {
                  setIsOtpStep(false);
                  setOtp("");
                }}
              >
                I no longer have access to this email address.
              </Button>

              <Button
                disabled={isOtpLoading}
                variant="default"
                className="w-full mt-4"
              >
                {isOtpLoading && (
                  <Loader className="animate-spin size-4 mr-2" />
                )}
                <span className="font-medium text-[15px] py-1">Verify</span>
              </Button>
            </div>
          )}

          {!isOtpStep && (
            <div className="mt-4 mx-auto">
              Not associated with any organization?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </div>
          )}
        </FormContainer>
      </main>
    </ThemeProvider>
  );
}

export default Login;
