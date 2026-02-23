import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/storeHooks";

// Components
import FormContainer from "@/components/AuthForm";
import { ThemeProvider } from "@/components/theme-provider";
import Icon from "@/components/Logo/Icon";
import { toast } from "sonner";
import { Loader, Building2, Lock, ArrowRight, UserRound } from "lucide-react";

function Invite() {
  const ref = useRef(null);
  const { token } = useParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [organizationName, setOrganizationName] = useState(
    "Global Innovations Ltd.",
  ); // fallback
  const [role, setRole] = useState("Standard User"); // fallback

  const { userInfo } = useAppSelector((state) => state.auth);
  // Placeholder for mutation loading state
  const isLoading = false;
  const navigate = useNavigate();

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    if (token) {
      try {
        // Assuming token is a JWT that contains organizationId
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.organizationId) {
          setOrganizationId(payload.organizationId);
        }
        if (payload?.organizationName) {
          setOrganizationName(payload.organizationName);
        }
        if (payload?.role) {
          setRole(payload.role);
        }
      } catch (e) {
        console.error("Could not parse token to derive organizationId");
      }
    }
  }, [token]);

  useEffect(() => {
    // Navigate to the Dashboard if logged in already.
    if (userInfo) navigate("/");
  }, [navigate, userInfo]);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (
      fullName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      toast.error("Please fill in all the fields!");
    } else {
      // Implement the API call here when ready
      console.log("Submit invite with:", {
        token,
        organizationId,
        fullName,
        email,
        password,
        confirmPassword,
      });
      toast("Invite accepted! (Placeholder)");
    }
  };

  const inputCSS =
    "rounded-lg px-3 py-2 bg-transparent border focus:ring-white/20 focus:border-white/10 w-full placeholder-muted-foreground/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

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
            <h3 className="text-2xl font-bold tracking-tight">
              You're Invited
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5">
              Complete your profile to join {organizationName}.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3  w-full">
            {/* Hidden fields */}
            <input type="hidden" name="token" value={token || ""} />
            <input type="hidden" name="organizationId" value={organizationId} />

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
                className={`${inputCSS}`}
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

            {/* Role badge */}
            <p className="text-sm text-muted-foreground mt-1 flex gap-2">
              You’re joining as a{" "}
              <span className="font-semibold text-foreground flex items-center gap-0.5">
                <UserRound size={14} /> {role}
              </span>
              .
            </p>

            <Button
              className="mt-4 w-full font-semibold rounded-lg text-md py-5"
              disabled={isLoading}
            >
              {isLoading && <Loader className="animate-spin size-4 mr-2" />}
              {/* <SquareArrowRightEnter size={16} className="mr-2" /> */}
              <span>Get Started</span>
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

/*  

name, email, password, orgId, role

*/
