import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import FormContainer from "@/components/AuthForm";
import Icon from "@/components/Logo/Icon";
import { Toaster } from "@/components/ui/toaster";
import { toast as sonnerToast } from "sonner";
import { Loader } from "lucide-react";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password === "" || confirmPassword === "") {
      sonnerToast.error("Please fill in all fields!");
      return;
    }

    if (password !== confirmPassword) {
      sonnerToast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      // Logic will be added later
      console.log("Resetting password with token:", token);
      sonnerToast.success("Password has been reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      sonnerToast.error(err?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const inputCSS =
    "rounded-lg px-3 py-1 bg-transparent border focus:ring-white/20 focus:border-white/20 w-[20rem] placeholder-muted-foreground/50";

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="h-screen w-full flex items-center justify-center bg-secondary/20">
        <Icon className="absolute top-6 left-6 size-8" />
        <FormContainer submitHandler={handleResetPassword} className="py-20">
          <h3 className="text-3xl font-bold mb-16 flex items-center gap-3">
            Reset Password
          </h3>
          <div className="flex flex-col items-start">
            <label htmlFor="password" className="mb-1 mt-3 font-medium">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputCSS}`}
            />
            <label htmlFor="confirmPassword" className="mb-1 mt-3 font-medium">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputCSS}`}
            />
            <Button
              disabled={isLoading}
              variant="default"
              className="mt-10 w-full rounded-lg"
            >
              {isLoading && <Loader className="animate-spin size-4" />}
              {!isLoading && <span>Reset Password</span>}
            </Button>
          </div>
        </FormContainer>
        <Toaster />
      </main>
    </ThemeProvider>
  );
}

export default ResetPassword;
