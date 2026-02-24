import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/storeHooks";
import { setCredentials } from "@/slices/authSlice";

// API hooks
import {
  useValidateInvitationQuery,
  useAcceptInvitationMutation,
} from "@/slices/api/invite.api";

// Components
import FormContainer from "@/components/AuthForm";
import { ThemeProvider } from "@/components/theme-provider";
import Icon from "@/components/Logo/Icon";
import { toast } from "sonner";
import { Loader, Building2, Lock, ArrowRight, UserRound } from "lucide-react";
import { LinkAlreadyUsed, LinkExpired } from "@/components/invitation";

function Invite() {
  const ref = useRef<HTMLInputElement>(null);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useAppSelector((state) => state.auth);

  // ── Validate the invite token on mount ──────────────────────────────
  const {
    data: inviteData,
    isLoading: isValidating,
    isError: isValidationError,
    error: validationError,
  } = useValidateInvitationQuery(token!, { skip: !token });

  // ── Accept invitation mutation ──────────────────────────────────────
  const [acceptInvitation, { isLoading: isAccepting }] =
    useAcceptInvitationMutation();

  // Focus the name input
  useEffect(() => {
    ref.current?.focus();
  }, [inviteData]);

  // If already logged in, redirect to home
  useEffect(() => {
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  // Pre-fill email if the invite was sent to a specific address
  useEffect(() => {
    if (inviteData?.email) {
      setEmail(inviteData.email);
    }
  }, [inviteData]);

  // ── Derived state ──────────────────────────────────────────────────
  const organizationName = inviteData?.orgName ?? "Organization";
  const role = inviteData?.role ?? "member";
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  // Check for used / expired status from the validation error
  const errorData = (validationError as any)?.data;
  const isAlreadyAccepted = errorData?.status === "used";
  const isExpired = errorData?.status === "expired";

  // ── Submit handler ──────────────────────────────────────────────────
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all the fields!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      const res = await acceptInvitation({
        token: token!,
        name: fullName,
        email,
        password,
      }).unwrap();

      // Store credentials and redirect
      dispatch(setCredentials(res));
      toast.success("Welcome! Your account has been created.");
      navigate(`/${res.organization.slug}/dashboard`);
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to accept invitation.";
      toast.error(message);
    }
  };

  const inputCSS =
    "rounded-lg px-3 py-2 bg-transparent border focus:ring-white/20 focus:border-white/10 w-full placeholder-muted-foreground/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  // ── Loading state ──────────────────────────────────────────────────
  if (isValidating) {
    return (
      <ThemeProvider>
        <main className="h-screen w-full flex items-center justify-center bg-secondary/20">
          <Loader className="animate-spin size-8 text-muted-foreground" />
        </main>
      </ThemeProvider>
    );
  }

  // ── Error states ──────────────────────────────────────────────────
  if (isAlreadyAccepted) {
    return (
      <ThemeProvider>
        <main className="h-screen w-full flex items-center justify-center bg-secondary/20 p-4">
          <LinkAlreadyUsed />
        </main>
      </ThemeProvider>
    );
  }

  if (isExpired) {
    return (
      <ThemeProvider>
        <main className="h-screen w-full flex items-center justify-center bg-secondary/20 p-4">
          <LinkExpired />
        </main>
      </ThemeProvider>
    );
  }

  if (isValidationError && !isAlreadyAccepted && !isExpired) {
    return (
      <ThemeProvider>
        <main className="h-screen w-full flex flex-col items-center justify-center bg-secondary/20 p-4 gap-4">
          <p className="text-muted-foreground text-sm">
            Invalid or expired invitation link.
          </p>
          <Button variant="outline" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </main>
      </ThemeProvider>
    );
  }

  // ── Valid invite — render the registration form ─────────────────────
  return (
    <ThemeProvider>
      <main className="relative h-screen w-full bg-secondary/20 flex items-center justify-center p-4">
        <Icon className="absolute top-6 left-6 size-8" />
        <Button
          variant="outline"
          className="absolute top-6 right-6"
          onClick={() => navigate("/login")}
        >
          Log In
        </Button>
        <FormContainer
          submitHandler={handleInviteSubmit}
          className="py-8 px-6 sm:px-10 max-w-sm sm:max-w-md w-full mx-auto"
        >
          <div className="mb-6 flex flex-col items-start text-left w-full">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs text-blue-400 font-mono mb-5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
              <span>{organizationName}</span>
            </div>

            <h3 className="text-2xl font-bold tracking-tight">
              Join as {displayRole}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5">
              You've been invited to collaborate on the {organizationName}{" "}
              dashboard. Create your account to get started.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3  w-full">
            {/* Hidden fields */}
            <input type="hidden" name="token" value={token || ""} />

            <div className="w-full space-y-1">
              <label
                htmlFor="fullName"
                className="text-sm font-semibold mb-1.5 block text-left"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Saugat Joshi"
                ref={ref}
                className={`${inputCSS}`}
              />
            </div>

            <div className="w-full space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-semibold mb-1.5 block text-left"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jsaugat@company.com"
                disabled={!!inviteData?.email} // Lock if invite was sent to specific email
                className={`${inputCSS} ${inviteData?.email ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="password"
                className="text-sm font-semibold mb-1.5 block text-left"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputCSS}`}
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold mb-1.5 block text-left"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputCSS}`}
              />
            </div>

            {/* Org */}
            <div className="w-full space-y-1">
              <label className="text-sm font-semibold mb-1.5 block text-left">
                Joining Organization
              </label>
              <div className="flex items-center px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg w-full">
                <Building2 className="size-4 text-blue-400 mr-2 shrink-0" />
                <span className="text-sm italic text-blue-400 font-semibold flex-1 truncate text-left">
                  {organizationName}
                </span>
                <Lock className="size-4 text-blue-400 ml-2 shrink-0" />
              </div>
            </div>

            {/* Role */}
            <div className="w-full space-y-1">
              <label className="text-sm font-semibold mb-1.5 block text-left">
                Assigned Role
              </label>
              <div className="flex items-center px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg w-full">
                <UserRound className="size-4 text-blue-400 mr-2 shrink-0" />
                <span className="text-sm italic text-blue-400 font-semibold flex-1 truncate text-left">
                  {displayRole}
                </span>
                <Lock className="size-4 text-blue-400 ml-2 shrink-0" />
              </div>
            </div>

            <Button
              className="mt-4 w-full font-semibold rounded-lg text-md py-5"
              disabled={isAccepting}
            >
              {isAccepting && <Loader className="animate-spin size-4 mr-2" />}
              <span>Create Account & Join</span>
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          <p className="text-[13px] text-center text-muted-foreground mt-7 px-2">
            By clicking continue, you agree to our{" "}
            <Link
              to="#"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="#"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </FormContainer>
      </main>
    </ThemeProvider>
  );
}

export default Invite;
