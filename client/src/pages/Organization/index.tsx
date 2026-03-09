import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  Loader2,
  Save,
  UserCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import {
  useGetMyOrganizationQuery,
  useDeleteMyOrganizationMutation,
  useUpdateMyOrganizationMutation,
} from "@/slices/api/organization.api";
import { useUpdateUserMutation } from "@/slices/api/auth.api";
import { clearCredentials, setCredentials } from "@/slices/authSlice";
import { ROUTES } from "@/constants/routes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { emptySplitApi } from "@/slices/api/emptySplitApi";

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
  const [deleteOrganization, { isLoading: isDeletingOrganization }] =
    useDeleteMyOrganizationMutation();
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
        error?.data?.message ||
        error?.message ||
        "Failed to update organization.";
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
        error?.data?.message ||
        error?.message ||
        "Failed to update owner profile.";
      toast.error(message);
    }
  };

  const handleDangerousAction = async () => {
    try {
      const response = await deleteOrganization().unwrap();
      dispatch(clearCredentials());
      dispatch(emptySplitApi.util.resetApiState());
      toast.success(response?.message || "Workspace deleted successfully.");
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message || "Failed to delete workspace.";
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
    <main className="mx-auto w-full max-w-5xl space-y-4">
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="border p-2 rounded-xl">
                <Building2 className="size-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col ">
                <CardTitle className="text-lg">Organization Details</CardTitle>
                <CardDescription className="text-xs">
                  Public-facing workspace info
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                  <div className="flex gap-1 items-center font-semibold">
                    <Save size={14} />
                    Save Organization
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 border rounded-xl">
                <UserCircle2 className="size-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-lg">Owner Profile</CardTitle>
                <CardDescription className="text-xs">
                  Your personal account settings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                  <div className="flex gap-1 items-center font-semibold">
                    <Save size={14} />
                    Save Profile
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <Card className="border-destructive/30 bg-destructive/10">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-700" />
            <CardTitle className="text-lg text-red-700">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Destructive actions for this workspace. These changes cannot be
            undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Delete this workspace and permanently remove associated data.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={isDeletingOrganization}
              >
                {isDeletingOrganization ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Workspace"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                <AlertDialogDescription>
                  This is a permanent action and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDangerousAction}
                  disabled={isDeletingOrganization}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </main>
  );
}
