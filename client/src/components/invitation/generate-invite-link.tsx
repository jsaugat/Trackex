"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Copy, Link2, Zap, Ban } from "lucide-react";

export function GenerateInviteLink() {
  const [role, setRole] = useState<"member" | "manager">("member");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  function generateLink() {
    // Fake link generator (replace with API call)
    const token = Math.random().toString(36).slice(2);
    setInviteLink(`https://orgdash.io/invite/${token}`);
  }

  function copyLink() {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
  }

  function revokeLink() {
    setInviteLink(null);
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
      <CardHeader>
        <CardTitle className="text-xl font-serif">
          Generate Invite Link
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Choose a role, generate a link, and share it. The link expires in 7
          days and works once.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Role Selector */}
        <RadioGroup
          value={role}
          onValueChange={(v) => setRole(v as "member" | "manager")}
          className="grid grid-cols-2 gap-3"
        >
          {/* Member */}
          <Label
            htmlFor="member"
            className={`cursor-pointer rounded-xl border p-4 transition
            ${
              role === "member"
                ? "border-lime-400 bg-lime-400/10"
                : "border-zinc-800 hover:border-zinc-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem value="member" id="member" />
              <div>
                <div className="font-medium">Member</div>
                <div className="text-xs text-zinc-400">
                  Can view dashboard and enter data
                </div>
              </div>
            </div>
          </Label>

          {/* Manager */}
          <Label
            htmlFor="manager"
            className={`cursor-pointer rounded-xl border p-4 transition
            ${
              role === "manager"
                ? "border-blue-500 bg-blue-500/10"
                : "border-zinc-800 hover:border-zinc-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem value="manager" id="manager" />
              <div>
                <div className="font-medium">Manager</div>
                <div className="text-xs text-zinc-400">
                  Can manage members and view reports
                </div>
              </div>
            </div>
          </Label>
        </RadioGroup>

        {/* Link Display */}
        <div
          className={`flex items-center rounded-lg border px-4 py-3 text-sm font-mono break-all
          ${
            inviteLink
              ? "border-blue-500/40 bg-zinc-950 text-blue-400"
              : "border-zinc-800 bg-zinc-950 text-zinc-500"
          }`}
        >
          {inviteLink || "// Link will appear here after generation"}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={generateLink} className="gap-2">
            <Zap className="h-4 w-4" />
            Generate Link
          </Button>

          {inviteLink && (
            <>
              <Button variant="secondary" onClick={copyLink} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>

              <Button variant="secondary" className="gap-2">
                <Link2 className="h-4 w-4" />
                Preview
              </Button>

              <Button
                variant="destructive"
                onClick={revokeLink}
                className="gap-2"
              >
                <Ban className="h-4 w-4" />
                Revoke
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
