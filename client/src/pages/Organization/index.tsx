import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, Loader2, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import {
  useGetMyOrganizationQuery,
  useUpdateMyOrganizationMutation,
} from "@/slices/api/organization.api";
import { useUpdateUserMutation } from "@/slices/api/auth.api";
import { setCredentials } from "@/slices/authSlice";
import { ROUTES } from "@/constants/routes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const slugPattern = /^[a-z0-9-]+$/;

export default function OrganizationSettings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orgSlug: orgSlugParam } = useParams();
  const { userInfo } = useAppSelector((state) => state.auth);

  const {
    data: organization,
    isLoading: isGettingOrganization,
    refetch,
  } = useGetMyOrganizationQuery();
  const [updateOrganization, { isLoading: isUpdatingOrganization }] =
    useUpdateMyOrganizationMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateUserMutation();

  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  useEffect(() => {
    if (organization) {
      setOrgName(organization.name ?? "");
      setOrgSlug(organization.slug ?? "");
      setOwnerName(organization.owner?.name ?? userInfo?.name ?? "");
      setOwnerEmail(organization.owner?.email ?? userInfo?.email ?? "");
      return;
    }

    if (userInfo?.organization) {
      setOrgName(userInfo.organization.name ?? "");
      setOrgSlug(userInfo.organization.slug ?? "");
      setOwnerName(userInfo.name ?? "");
      setOwnerEmail(userInfo.email ?? "");
    }
  }, [organization, userInfo]);

  const handleOrganizationSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const cleanedName = orgName.trim();
    const cleanedSlug = orgSlug.trim().toLowerCase();

    if (!cleanedName) {
      toast.error("Organization name is required.");
      return;
    }

    if (!cleanedSlug) {
      toast.error("Workspace URL is required.");
      return;
    }

    if (!slugPattern.test(cleanedSlug)) {
      toast.error(
        "Workspace URL can only contain lowercase letters, numbers, and hyphens.",
      );
      return;
    }

    try {
      const updatedOrg = await updateOrganization({
        name: cleanedName,
        slug: cleanedSlug,
      }).unwrap();

      dispatch(
        setCredentials({
          organization: {
            _id: updatedOrg._id,
            name: updatedOrg.name,
            slug: updatedOrg.slug,
          },
        }),
      );

      toast.success("Organization details updated.");

      if (orgSlugParam && updatedOrg.slug !== orgSlugParam) {
        navigate(ROUTES.ORG_SETTINGS(updatedOrg.slug), { replace: true });
      }
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || "Failed to update organization.";
      toast.error(message);
    }
  };

  const handleOwnerProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const cleanedName = ownerName.trim();
    const cleanedEmail = ownerEmail.trim().toLowerCase();

    if (!cleanedName) {
      toast.error("Owner name is required.");
      return;
    }

    if (!cleanedEmail) {
      toast.error("Owner email is required.");
      return;
    }

    try {
      const updatedUser = await updateProfile({
        name: cleanedName,
        email: cleanedEmail,
      }).unwrap();

      dispatch(setCredentials(updatedUser));
      toast.success("Owner profile updated.");
      refetch();
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || "Failed to update owner profile.";
      toast.error(message);
    }
  };

  if (isGettingOrganization) {
    return (
      <main className="h-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Building2 className="size-5 text-indigo-500" />
          <h2 className="text-lg font-semibold">Organization Details</h2>
        </div>

        <form className="space-y-4" onSubmit={handleOrganizationSubmit}>
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Inc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgSlug">Workspace URL</Label>
            <Input
              id="orgSlug"
              value={orgSlug}
              onChange={(e) => setOrgSlug(e.target.value)}
              placeholder="acme-inc"
            />
          </div>

          <Button
            type="submit"
            disabled={isUpdatingOrganization}
            className="w-full sm:w-auto"
          >
            {isUpdatingOrganization ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Organization"
            )}
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <UserCircle2 className="size-5 text-indigo-500" />
          <h2 className="text-lg font-semibold">Owner Profile</h2>
        </div>

        <form className="space-y-4" onSubmit={handleOwnerProfileSubmit}>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Name</Label>
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Email</Label>
            <Input
              id="ownerEmail"
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="owner@company.com"
            />
          </div>

          <Button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full sm:w-auto"
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}
