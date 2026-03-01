import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ErrorFallback() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-muted to-muted text-white flex items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-zinc-900/40 backdrop-blur">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-800 to-orange-800 text-white">
            <AlertTriangle size={38} strokeWidth={1.2} />
          </div>
          <h1 className="text-3xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-white/70">
            We hit an unexpected error while loading this workspace. Try
            refreshing or return to the dashboard to continue managing your
            transactions.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
