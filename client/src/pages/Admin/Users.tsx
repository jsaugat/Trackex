import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/storeHooks";
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
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Loader as LoaderLucide,
  Search,
  ShieldX,
  ShieldCheck,
  CircleAlert,
  Crown,
} from "lucide-react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/slices/admin/users.api";
import {
  addFetchedUsers,
  removeUserLocally,
  updateUserLocally,
} from "@/slices/admin/usersSlice";
import SearchBar from "@/components/SearchBar";
import { GenerateInviteLink } from "@/components/invitation/generate-invite-link";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import NoRecords from "@/components/NoRecords";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = useAppSelector((state) => state.auth.userInfo);
  const usersData = useAppSelector((state) => state.users.data || []);
  const {
    data: fetchedUsers,
    isLoading: isGettingUsers,
    error,
    refetch: refetchUsers,
  } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (fetchedUsers) {
      dispatch(addFetchedUsers(fetchedUsers));
    }
  }, [dispatch, fetchedUsers]);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      dispatch(removeUserLocally(userId));
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = usersData.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const usersToDisplay = filteredUsers.filter(
    (user) => user._id !== currentUser._id,
  );

  console.log("filteredUsers", filteredUsers);

  return (
    <main>
      {/* Generate Invite Link */}
      <section className="mb-6">
        <GenerateInviteLink />
      </section>

      {/* SearchBar */}
      <SearchBar
        searchQuery={searchQuery}
        handleSearchInputChange={handleSearchInputChange}
        placeholder={"Search members"}
        className="mb-3 mx-auto mt-10"
      />

      {/* Users List */}
      <article className="text-[0.9rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-3">
        {isGettingUsers ? (
          <LoadingState message="Fetching Users" className="col-span-full" />
        ) : error ? (
          <div className="col-span-full text-red-500">
            Error: {error.message}
          </div>
        ) : !usersToDisplay.length ? (
          <NoRecords
            icon={ShieldX}
            missingThing="users"
            className="col-span-full"
          />
        ) : (
          usersToDisplay.map((user, idx) => (
            <UserCard
              key={idx}
              name={user.name}
              email={user.email}
              userId={user._id}
              role={user.role}
              registeredOn={user.createdAt}
              handleDeleteUser={handleDeleteUser}
              isDeleting={isDeleting}
              //
              refetchUsers={refetchUsers}
            />
          ))
        )}
      </article>
    </main>
  );
}

const UserCard = ({
  name,
  email,
  userId,
  role,
  handleDeleteUser,
  isDeleting,
  refetchUsers,
}) => {
  const [updateUser, { isLoading: isChangingRole }] = useUpdateUserMutation();
  const dispatch = useAppDispatch();
  const canChangeRole = role !== "owner";
  const nextRole = role === "manager" ? "member" : "manager";

  const handleRoleChange = async (idToUpdate) => {
    try {
      if (!canChangeRole) {
        return;
      }

      const data = await updateUser({
        id: idToUpdate,
        role: nextRole,
      });
      const updated = await data.unwrap();

      // Dispatch the updateUserLocally action
      dispatch(updateUserLocally(updated));
      refetchUsers();
    } catch (error) {
      console.error("Error:", error); // Handle any errors
    }
  };

  return (
    <figure className="p-4 bg-background border rounded-2xl shadow-md shadow-indigo-400 dark:shadow-none backdrop-blur-sm flex justify-around items-center gap-4">
      <section>
        <img
          width={90}
          src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${name}`}
          alt="avatar"
          className="rounded-full bg-muted dark:bg-foreground"
        />
      </section>
      <section className="space-y-2">
        <section className="flex flex-1 justify-between items-center">
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <p>{name}</p>
              {role === "owner" && (
                <Crown className="size-5 text-amber-500" strokeWidth={"2.5px"} />
              )}
              {role === "manager" && (
                <ShieldCheck
                  className="size-5 text-emerald-500"
                  strokeWidth={"2.5px"}
                />
              )}
            </h3>
            <span className="text-googleBlue">{email}</span>
          </div>
        </section>
        <section className="buttons grid gap-2">
          <ChangeRoleAlertDialog
            trigger={
              <Button
                variant={role === "manager" ? "secondary" : "default"}
                size="sm"
                className="flex items-center gap-2"
                disabled={!canChangeRole}
              >
                {role === "manager" ? (
                  <>
                    <ShieldX className="size-4" strokeWidth={"2px"} />
                    <span>Set Member</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" strokeWidth={"2px"} />
                    <span>Set Manager</span>
                  </>
                )}
              </Button>
            }
            userId={userId}
            makeManager={role === "manager" ? false : true}
            canChangeRole={canChangeRole}
            nextRole={nextRole}
            isChangingRole={isChangingRole}
            handleRoleChange={handleRoleChange}
          />
          <DeleteAlertDialog
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="size-3" strokeWidth={"1.5px"} />
                <span>Remove</span>
              </Button>
            }
            userId={userId}
            handleDeleteUser={handleDeleteUser}
            isDeleting={isDeleting}
          />
        </section>
      </section>
    </figure>
  );
};

const ChangeRoleAlertDialog = ({
  trigger,
  makeManager,
  canChangeRole,
  nextRole,
  userId,
  handleRoleChange,
  isChangingRole,
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        {!canChangeRole ? (
          <AlertDialogDescription>
            Owner role cannot be changed.
          </AlertDialogDescription>
        ) : makeManager ? (
          <AlertDialogDescription>
            This user will be promoted to manager.
          </AlertDialogDescription>
        ) : (
          <AlertDialogDescription>
            This user will be moved back to member role.
          </AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => handleRoleChange(userId)}
          disabled={!canChangeRole}
        >
          {isChangingRole && <LoaderLucide className="size-4 animate-spin" />}
          {!isChangingRole && <span>{`Confirm (${nextRole})`}</span>}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const DeleteAlertDialog = ({
  trigger,
  userId,
  handleDeleteUser,
  isDeleting,
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm deletion of this user?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete this member from the database.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => handleDeleteUser(userId)}
          className="border hover:border-transparent text-red-500 bg-red-500/0 hover:bg-red-500/10"
        >
          {isDeleting ? (
            <LoaderLucide className="animate-spin" />
          ) : (
            <span>Delete</span>
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
