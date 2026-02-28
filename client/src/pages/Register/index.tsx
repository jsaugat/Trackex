// ==============================
// External & React Imports
// ==============================
import React, {
  ChangeEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/storeHooks";

// ==============================
// API & Redux Imports
// ==============================
import { Button } from "@/components/ui/button";
import { Loader, Building, ShieldCheck, Eye, EyeOff } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import { ThemeProvider } from "@/components/theme-provider";
import Icon from "@/components/Logo/Icon";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { cn } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  refProp?: RefObject<HTMLInputElement>;
  prefix?: string;
  className?: string;
}

// ==============================
// InputField Component
// ==============================
const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  refProp,
  prefix,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={cn("flex flex-col items-start w-full", className)}>
      <label className="mb-1 mt-3 text-sm font-medium">{label}</label>
      <div className="flex w-full relative">
        {prefix && (
          <span className="flex items-center px-3 rounded-l-lg border border-r-0 bg-muted/20 text-muted-foreground text-xs">
            {prefix}
          </span>
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          ref={refProp}
          className={`rounded-lg px-3 py-1 bg-transparent border focus:ring-white/20 focus:border-white/10 flex-1 placeholder-muted-foreground/50 transition-all duration-200 ${
            prefix ? "rounded-l-none" : ""
          } ${type === "password" ? "pr-10" : ""}`}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

// ==============================
// Register Component
// ==============================
export default function Register() {
  const {
    form,
    handleChange,
    handleSubmit,
    isLoading,
    nameRef,
    isOtpStep,
    otp,
    setOtp,
    handleVerifyOtp,
    resendOtp,
    isOtpLoading,
    setIsOtpStep,
  } = useRegisterForm();
  const { userInfo } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Focus first input
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

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

        <AuthForm
          submitHandler={isOtpStep ? handleVerifyOtp : handleSubmit}
          className="py-12"
        >
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-2">
            <Building />
          </div>

          <div className="mb-6 text-left w-full">
            {!isOtpStep && (
              <>
                <h3 className="text-3xl font-bold">Register Organization</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Set up your organization and create your owner account.
                </p>
              </>
            )}
            {isOtpStep && (
              <>
                <h3 className="text-3xl font-bold">Verify Email</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter the 6-digit OTP sent to {form.email}.
                </p>
              </>
            )}
          </div>

          {!isOtpStep && (
            <>
              <InputField
                label="Full Name"
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Saugat Joshi"
                refProp={nameRef}
              />

              <InputField
                label="Email Address"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="john@example.com"
              />

              <InputField
                label="Organization Name"
                type="text"
                value={form.orgName}
                onChange={handleChange("orgName")}
                placeholder="Acme Corp"
              />

              <div className="flex flex-col w-full">
                <InputField
                  label="Workspace URL"
                  type="text"
                  value={form.orgSlug}
                  onChange={handleChange("orgSlug")}
                  placeholder="acme-corp"
                  prefix="trackex1.com/"
                />
                <p className="text-xs text-muted-foreground/60 ml-1 mt-1">
                  This will be your unique organization identifier.
                </p>
              </div>

              <InputField
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
              />
              <InputField
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="••••••••"
              />

              <div className="flex items-start space-x-2 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 mb-4 w-full mt-4">
                <ShieldCheck className="text-blue-400" />
                <p className="text-sm text-blue-400 leading-relaxed">
                  You’re creating a new workspace and will have full Owner
                  access.
                </p>
              </div>

              <Button
                variant="default"
                className="mt-12 w-full rounded-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin size-4" />
                ) : (
                  "Create Workspace"
                )}
              </Button>
            </>
          )}

          {isOtpStep && (
            <div className="w-full mt-3">
              <InputOTP
                id="register-otp"
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                containerClassName="w-full justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button
                variant="default"
                className="mt-10 w-full rounded-lg font-semibold"
                disabled={isOtpLoading}
              >
                {isOtpLoading ? (
                  <Loader className="animate-spin size-4" />
                ) : (
                  "Verify OTP"
                )}
              </Button>
              <div className="mt-4 flex w-full justify-between text-sm">
                <button
                  type="button"
                  className="text-muted-foreground hover:underline"
                  onClick={() => {
                    setIsOtpStep(false);
                    setOtp("");
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={resendOtp}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 mx-auto">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Sign in
            </Link>
          </div>
        </AuthForm>
      </main>
    </ThemeProvider>
  );
}
