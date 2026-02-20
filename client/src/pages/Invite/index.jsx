import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// Components
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import FormContainer from "@/components/AuthForm";
import { ThemeProvider } from "@/components/theme-provider";
import Icon from "@/components/Logo/Icon";
import { Toaster } from "@/components/ui/toaster";
import { Loader, Building2, Lock, Info } from "lucide-react";

function Invite() {
  const ref = useRef(null);
  const { token } = useParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [organizationName, setOrganizationName] = useState(
    "Global Innovations Ltd.",
  ); // fallback
  const [role, setRole] = useState("Standard User"); // fallback

  const { userInfo } = useSelector((state) => state.auth);
  // Placeholder for mutation loading state
  const isLoading = false;
  const navigate = useNavigate();
  const { toast } = useToast();

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
    if (fullName === "" || email === "" || password === "") {
      toast({
        variant: "destructive",
        title: "Please fill in all the fields!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      // Implement the API call here when ready
      console.log("Submit invite with:", {
        token,
        organizationId,
        fullName,
        email,
        password,
      });
      toast({
        title: "Invite accepted! (Placeholder)",
      });
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
          className="py-8 px-6 sm:px-10 max-w-sm sm:max-w-lg min-w-[600px] w-full mx-auto"
        >
          <div className="mb-6 flex flex-col items-start text-left">
            <h3 className="text-2xl font-bold tracking-tight">
              Join your team
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5">
              Complete your profile to join {organizationName}.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
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
                placeholder="John Doe"
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
                placeholder="alex.smith@company.com"
                className={`${inputCSS}`}
              />
            </div>

            <div className="w-full space-y-1">
              <label className="text-sm font-semibold mb-1.5 block text-left">
                Joining Organization
              </label>
              <div className="flex items-center px-3 py-3 bg-muted/40 border rounded-lg w-full">
                <Building2 className="size-4 text-muted-foreground mr-2 shrink-0" />
                <span className="text-sm italic text-muted-foreground flex-1 truncate text-left">
                  {organizationName}
                </span>
                <Lock className="size-4 text-muted-foreground/60 ml-2 shrink-0" />
              </div>
            </div>

            <div className="w-full bg-yellow-500/10 dark:bg-yellow-500/10 border border-yellow-500/20 dark:border-yellow-500/20 rounded-lg p-3 flex items-center gap-2.5">
              <Info className="size-[1.1rem] text-yellow-600 dark:text-yellow-500 shrink-0" />
              <span className="text-sm text-yellow-800 dark:text-yellow-400">
                Role: <strong className="font-bold">{role}</strong>
              </span>
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
              {/* Password Strength Indicator (Commented out for now)
              <div className="flex gap-1.5 mt-2.5">
                <div className="h-1 bg-muted rounded-full flex-1" />
                <div className="h-1 bg-muted rounded-full flex-1" />
                <div className="h-1 bg-muted rounded-full flex-1" />
                <div className="h-1 bg-muted rounded-full flex-1" />
              </div>
              */}
            </div>

            <Button
              className="mt-4 w-full font-semibold rounded-lg text-md py-5"
              disabled={isLoading}
            >
              {isLoading && <Loader className="animate-spin size-4 mr-2" />}
              <span>Join Organization</span>
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
        <Toaster />
      </main>
    </ThemeProvider>
  );
}

export default Invite;
