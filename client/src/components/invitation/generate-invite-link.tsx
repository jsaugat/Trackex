"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Ban,
  Check,
  Loader,
  Sparkles,
  Shield,
  ShieldCheck,
  User,
  Share2,
  Link,
  Info,
} from "lucide-react";
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

  const INVITE_COOLDOWN_SECONDS = 10;

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  async function generateLink() {
    if (cooldown > 0) return;

    try {
      const res = await createInvitation({ role }).unwrap();

      setInviteLink(res.inviteLink);
      setInviteToken(res.token);
      setCopied(false);

      setCooldown(INVITE_COOLDOWN_SECONDS); // 👈 start cooldown

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
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-gradient-to-t from-[#18181b] to-[#0c0c0e] border rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl text-zinc-100">
        {/* Shared Header */}
        <div className="p-4 md:p-6 md:pt-6 md:pb-6 border-b border-zinc-900 md:border-b-0">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-dmSerif text-2xl md:text-3xl text-white mb-2">
                Invite New Member
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                Configure access level and generate a secure, single-use invite
                link for your team member.
              </p>
            </div>

            {/* Security Policy (Desktop Only) */}
            <div className="hidden md:flex items-center gap-2 border p-1 pr-1.5 italic rounded-full text-muted-foreground">
              <Info className="w-4 h-4 " />
              <span className="text-xs">
                Links are single-use and encrypted. Expire automatically after
                168 hours.
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal separator for desktop */}
        <div className="hidden md:block border-t border-zinc-900"></div>

        <div className="flex flex-col md:flex-row">
          {/* Left Side: Configuration */}
          <div className="w-full md:w-[480px] md:border-r border-zinc-900 p-2 md:p-6">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black ml-1">
                Member Role
              </label>

              {/* Member Card */}
              <button
                onClick={() => setRole("member")}
                className={`w-full p-4 rounded-2xl flex items-start gap-4 text-left transition-all duration-200 border group ${
                  role === "member"
                    ? "border-lime-500/50 bg-[#111113]"
                    : "border-[#1f1f22] bg-[#09090b] hover:border-zinc-700"
                }`}
              >
                <div className="mt-1">
                  <div
                    className={`w-3 h-3 rounded-full border transition-all flex items-center justify-center ${
                      role === "member"
                        ? "border-lime-500 shadow-[0_0_8px_rgba(190,242,100,0.5)]"
                        : "border-zinc-700"
                    }`}
                  >
                    {role === "member" && (
                      <div className="w-1 h-1 bg-lime-500 rounded-full" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span
                    className={`text-sm font-bold block transition-colors ${
                      role === "member"
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    Workspace Member
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block leading-tight">
                    Full access to dashboards and team projects.
                  </span>
                </div>
                <User
                  className={`w-4 h-4 mt-0.5 ${role === "member" ? "text-lime-500" : "text-zinc-700"}`}
                />
              </button>

              {/* Manager Card */}
              <button
                onClick={() => setRole("manager")}
                className={`w-full p-4 rounded-2xl flex items-start gap-4 text-left transition-all duration-200 border group ${
                  role === "manager"
                    ? "border-lime-500/50 bg-[#111113]"
                    : "border-[#1f1f22] bg-[#09090b] hover:border-zinc-700"
                }`}
              >
                <div className="mt-1">
                  <div
                    className={`w-3 h-3 rounded-full border transition-all flex items-center justify-center ${
                      role === "manager"
                        ? "border-lime-500 shadow-[0_0_8px_rgba(190,242,100,0.5)]"
                        : "border-zinc-700"
                    }`}
                  >
                    {role === "manager" && (
                      <div className="w-1 h-1 bg-lime-500 rounded-full" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span
                    className={`text-sm font-bold block transition-colors ${
                      role === "manager"
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  >
                    System Manager
                  </span>
                  <span className="text-[11px] text-zinc-500 mt-1 block leading-tight">
                    Administrative tools, billing, and team control.
                  </span>
                </div>
                <ShieldCheck
                  className={`w-4 h-4 mt-0.5 ${role === "manager" ? "text-lime-500" : "text-zinc-700"}`}
                />
              </button>
            </div>
          </div>

          {/* Right Side: Action & Link Result */}
          <div className="flex-1 p-2 md:p-8 bg-zinc-900/10 flex flex-col">
            <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full py-4 md:py-0">
              {/* Ready State Graphic (Desktop Only) */}
              {!inviteLink && !isCreating && (
                <div className="hidden md:flex md:justify-center md:gap-3 text-center mb-8">
                  <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center mb-4 border border-zinc-800">
                    <Link className="w-8 h-8 text-lime-400 fill-lime-400/20" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold text-xl">
                      Ready to Generate
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1">
                      The link will be tied to the{" "}
                      <span className="text-lime-500 font-semibold">
                        {role}
                      </span>{" "}
                      role.
                    </p>
                  </div>
                </div>
              )}

              {/* Link Console */}
              <div className="relative group mb-4">
                <div className="absolute -top-2.5 left-4 bg-[#050505] px-2 text-[10px] font-bold text-zinc-500 tracking-tighter border border-zinc-900 rounded z-10">
                  Invite Link
                </div>

                <div
                  className={`bg-[#050505] border border-[#1f1f22] rounded-2xl p-2 md:p-2 md:pl-3 ${inviteLink && "md:pl-4"} shadow-inner min-h-[60px] flex items-center gap-4`}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[13px] whitespace-nowrap overflow-x-auto custom-scrollbar transition-colors duration-300 ${
                        inviteLink ? "text-lime-400" : "text-zinc-600"
                      }`}
                    >
                      {isCreating ? (
                        <span className="flex items-center gap-2 italic">
                          <Loader className="h-3 w-3 animate-spin" />
                          Encrypting handshake...
                        </span>
                      ) : (
                        inviteLink || "Awaiting generation..."
                      )}
                    </div>
                  </div>

                  {/* Contextual Actions */}
                  {inviteLink && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={copyLink}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all active:scale-90"
                        title="Copy Link"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-lime-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={handleRevoke}
                        disabled={isRevoking}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-600 hover:text-red-400 transition-all active:scale-90 disabled:opacity-50"
                        title="Revoke Link"
                      >
                        {isRevoking ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Ban className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Action Button */}
              <Button
                onClick={generateLink}
                disabled={isCreating || cooldown > 0}
                className="w-full bg-white hover:bg-zinc-200 text-black h-10 text-sm font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-white/5 disabled:opacity-50"
              >
                {isCreating ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : cooldown > 0 ? (
                  <Shield className="w-5 h-5" />
                ) : (
                  <Share2 className="w-5 h-5" />
                )}

                {isCreating
                  ? "Generating Link..."
                  : cooldown > 0
                    ? `Cooldown (${cooldown}s)`
                    : "Generate Secure Invite Link"}
              </Button>
            </div>

            {/* Footer Note (Mobile) */}
            <div className="md:hidden mt-6 pt-6 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-600">
              <span>Single-use • 7 day expiry</span>
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-tighter">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
                Secure Environment
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f1f22;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #27272a;
        }
      `}</style>
    </div>
  );
}
