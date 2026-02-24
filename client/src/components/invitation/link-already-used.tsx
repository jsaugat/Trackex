import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LinkAlreadyUsed() {
  const navigate = useNavigate();

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/20">
          <AlertCircle className="h-6 w-6 text-blue-500" />
        </div>
        <CardTitle className="text-xl font-serif">Already Used</CardTitle>
        <CardDescription className="text-zinc-400">
          This invitation has already been accepted. Each link can only be used
          once.
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
