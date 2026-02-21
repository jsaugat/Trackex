// ==============================
// External & React Imports
// ==============================
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/storeHooks";

// ==============================
// API & Redux Imports
// ==============================
import { useRegisterMutation } from "@/slices/api/auth.api";
import { setCredentials } from "@/slices/authSlice";

// ==============================
// UI Components & Utilities
// ==============================
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { TriangleAlert, Loader } from "lucide-react";
import FormContainer from "@/components/AuthForm";
import { ThemeProvider } from "@/components/theme-provider";
import Icon from "@/components/Logo/Icon";
import { useRegisterForm } from "@/hooks/useRegisterForm";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  refProp?: React.RefObject<HTMLInputElement>;
}

// ==============================
// InputField Component
// ==============================
function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  refProp,
}: InputFieldProps) {
  return (
    <div className="flex flex-col items-start">
      <label className="mb-1 mt-3 text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        ref={refProp}
        className="rounded-lg px-3 py-1 bg-transparent border focus:ring-white/20 focus:border-white/10 w-[20rem] placeholder-muted-foreground/50 transition-all duration-200"
      />
    </div>
  );
}

// ==============================
// Register Component
// ==============================
export default function Register() {
  const { form, handleChange, handleSubmit, isLoading, nameRef } =
    useRegisterForm();
  const { userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

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

        <FormContainer submitHandler={handleSubmit} className="py-12">
          <h3 className="text-3xl font-bold mb-[3rem] text-center">
            Create Your <br /> Tracker Account
          </h3>

          <InputField
            label="Name"
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="John Doe"
            refProp={nameRef}
          />
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="john@example.com"
          />
          <InputField
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="________"
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="________"
          />

          <Button
            variant="default"
            className="mt-12 w-full rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin size-4" />
            ) : (
              "Create an Account"
            )}
          </Button>

          <div className="mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </FormContainer>

        <Toaster />
      </main>
    </ThemeProvider>
  );
}
