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
import { Copy, Link2, Zap, Ban, Check, Loader } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateInvitationMutation,
  useRevokeInvitationMutation,
} from "@/slices/api/invite.api";

export function GenerateInviteLink() {
  const [role, setRole] = useState<"member" | "manager">("member");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [createInvitation, { isLoading: isCreating }] =
    useCreateInvitationMutation();
  const [revokeInvitation, { isLoading: isRevoking }] =
    useRevokeInvitationMutation();

  async function generateLink() {
    try {
      const res = await createInvitation({ role }).unwrap();
      setInviteLink(res.inviteLink);
      setInviteToken(res.token);
      setCopied(false);
      toast.success("Invite link generated!");
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to generate invite link.";
      toast.error(message);
    }
  }

  async function copyLink() {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  }

  async function handleRevoke() {
    if (!inviteToken) return;
    try {
      await revokeInvitation(inviteToken).unwrap();
      setInviteLink(null);
      setInviteToken(null);
      setCopied(false);
      toast.success("Invitation revoked.");
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to revoke invitation.";
      toast.error(message);
    }
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
          <Button
            onClick={generateLink}
            className="gap-2"
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {isCreating ? "Generating..." : "Generate Link"}
          </Button>

          {inviteLink && (
            <>
              <Button variant="secondary" onClick={copyLink} className="gap-2">
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </Button>

              <Button
                variant="destructive"
                onClick={handleRevoke}
                className="gap-2"
                disabled={isRevoking}
              >
                {isRevoking ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                {isRevoking ? "Revoking..." : "Revoke"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
