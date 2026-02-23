import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { useRegisterMutation } from "@/slices/api/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
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

  const { userInfo } = useSelector((state: any) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();
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

    console.log("registerform", form);

    try {
      const res = await register({ ...form }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (error: any) {
      toast.error(error?.data?.message || error.error || "An error occurred");
    }
  };

  return { form, handleChange, handleSubmit, isLoading, nameRef };
}
