import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LinkExpired() {
  const navigate = useNavigate();

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
          <Clock className="h-6 w-6 text-amber-500" />
        </div>
        <CardTitle className="text-xl font-serif">Link Expired</CardTitle>
        <CardDescription className="text-zinc-400">
          This invitation link has expired after 7 days. Ask the owner to
          generate a new one.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          variant="outline"
          className="gap-2 border-zinc-800 hover:bg-zinc-800 text-zinc-100"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Button>
      </CardContent>
    </Card>
  );
}
