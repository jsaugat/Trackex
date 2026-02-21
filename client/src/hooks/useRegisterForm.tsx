import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { useRegisterMutation } from "@/slices/api/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { TriangleAlert } from "lucide-react";

export function useRegisterForm() {
  const nameRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { userInfo } = useSelector((state: any) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  const handleChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    if (!form.name || !form.email || !form.password) {
      toast({
        variant: "destructive",
        title: "Please fill in all the fields!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    try {
      const res = await register({ ...form }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (error: any) {
      toast({
        title: (
          <span className="flex items-center gap-3">
            <TriangleAlert className="size-5 text-yellow-500" />
            {error?.data?.message || error.error || "An error occurred"}
          </span>
        ),
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return { form, handleChange, handleSubmit, isLoading, nameRef };
}
