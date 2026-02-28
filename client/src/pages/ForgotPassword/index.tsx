import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import FormContainer from "@/components/AuthForm";
import Icon from "@/components/Logo/Icon";
import { Toaster } from "@/components/ui/toaster";
import { toast as sonnerToast } from "sonner";
import { Loader } from "lucide-react";
import { useForgotPasswordMutation } from "@/slices/api/auth.api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "") {
      sonnerToast.error("Please enter your email address!");
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();
      sonnerToast.success(
        response?.message ||
          "If an account exists, a reset link has been sent.",
      );
    } catch (err: any) {
      sonnerToast.error(
        err?.data?.message || err?.error || "Something went wrong",
      );
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
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Button>
        <FormContainer submitHandler={handleForgotPassword} className="py-20">
          <h3 className="text-3xl font-bold mb-16 flex items-center gap-3">
            Forgot Password
          </h3>
          <p className="text-muted-foreground mb-6 max-w-[20rem]">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <div className="flex flex-col items-start">
            <label htmlFor="email" className="mb-1 mt-3 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              ref={ref}
              className={`${inputCSS}`}
            />
            <Button
              disabled={isLoading}
              variant="default"
              className="mt-10 w-full rounded-lg"
            >
              {isLoading && <Loader className="animate-spin size-4" />}
              {!isLoading && <span>Send Reset Link</span>}
            </Button>
          </div>
          <div className="mt-12 text-center">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </div>
        </FormContainer>
        <Toaster />
      </main>
    </ThemeProvider>
  );
}

export default ForgotPassword;
