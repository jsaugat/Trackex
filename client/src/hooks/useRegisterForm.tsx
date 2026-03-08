import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import {
  useRegisterMutation,
  useVerifyLoginOtpMutation,
} from "@/slices/api/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { generateSlugWithSuffix } from "@/utils/generateSlugWithSuffix";

export function useRegisterForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    orgName: "",
    orgSlug: "",
    password: "",
    confirmPassword: "",
  });
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  const { userInfo } = useSelector((state: any) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();
  const [verifyLoginOtp, { isLoading: isOtpLoading }] =
    useVerifyLoginOtpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  const handleChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => {
        const newState = { ...prev, [field]: value };

        // Auto-generate slug if orgName is changed
        if (field === "orgName") {
          newState.orgSlug = generateSlugWithSuffix(value);
        }

        return newState;
      });
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.orgName ||
      !form.orgSlug
    ) {
      toast.error("Please fill in all the fields!");
      return;
    }

    try {
      const res = await register({ ...form }).unwrap();
      if (res?.otpRequired) {
        setIsOtpStep(true);
        toast.success("OTP sent. Check your email.", {
          description: "For now OTP is logged on the server console.",
        });
      }
    } catch (error: any) {
      const message =
        error?.data?.errors?.[0]?.message ||
        error?.data?.message ||
        error?.error ||
        "An error occurred";
      toast.warning(message);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }

    try {
      const res = await verifyLoginOtp({ email: form.email, otp }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (error: any) {
      toast.error(
        error?.data?.message || error.error || "OTP verification failed",
      );
    }
  };

  const resendOtp = async () => {
    try {
      await register({ ...form }).unwrap();
      toast.success("OTP resent.");
    } catch (error: any) {
      toast.error(
        error?.data?.message || error.error || "Failed to resend OTP",
      );
    }
  };

  return {
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
  };
}
