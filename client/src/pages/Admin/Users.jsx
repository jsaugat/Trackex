import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "@/slices/admin/users.api.js";
import {
  addFetchedUsers,
  removeUserLocally,
  updateUserLocally,
} from "@/slices/admin/usersSlice.js";
import SearchBar from "@/components/SearchBar";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = useSelector((state) => state.auth.userInfo);
  const usersData = useSelector((state) => state.users.data || []);
  const {
    data: fetchedUsers,
    isLoading: isGettingUsers,
    error,
    refetch: refetchUsers,
  } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const dispatch = useDispatch();

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
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      {/* SearchBar */}
      <SearchBar
        searchQuery={searchQuery}
        handleSearchInputChange={handleSearchInputChange}
        placeholder={"Search members"}
        className="mb-3"
      />

      {/* Users List */}
      <article className="text-[0.9rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-3">
        {isGettingUsers ? (
          <Loader />
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : !filteredUsers.length ? (
          <NoUsersMessage />
        ) : (
          filteredUsers
            .filter((user) => user._id !== currentUser._id)
            .map((user, idx) => (
              <UserCard
                key={idx}
                name={user.name}
                email={user.email}
                userId={user._id}
                isAdmin={user.isAdmin}
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
  isAdmin,
  handleDeleteUser,
  isDeleting,
  refetchUsers,
}) => {
  // const [updateUser, { isLoading: isChangingRole, error: changeRoleError }] =
  //   useUpdateUserMutation();
  const currentUser = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const [isChangingRole, setIsChangingRole] = useState(false);

  // const handleRoleChange = async (idToUpdate) => {
  //   try {
  //     console.log("ID To Update ", idToUpdate);
  //     const update = { isAdmin: !isAdmin };
  //     await updateUser({
  //       id: idToUpdate,
  //       update,
  //     });
  //     // dispatch(updateUserLocally());
  //     console.log("Success");
  //   } catch (error) {
  //     console.log("Error changing role:", error);
  //   }
  // };

  const handleRoleChange = async (idToUpdate) => {
    console.log("ID to update:", idToUpdate);
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${idToUpdate}`;

    // Define the data to send
    const dataToSend = {
      isAdmin: !isAdmin,
    };

    // Define the bearer token
    const token = currentUser.token;
    // console.log("token: " + token);

    try {
      setIsChangingRole(true);
      // Send the PUT request
      const response = await fetch(url, {
        method: "PUT", // Specify the HTTP method
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
          authorization: `Bearer ${token}`, // Add the authorization header with the bearer token
        },
        body: JSON.stringify(dataToSend), // Convert the data to a JSON string
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json(); // Parse the JSON response
      console.log("Success:", data); // Handle the response data

      // Dispatch the updateUserLocally action
      dispatch(updateUserLocally(data));
      refetchUsers();
    } catch (error) {
      console.error("Error:", error); // Handle any errors
    } finally {
      setIsChangingRole(false);
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
              {isAdmin && (
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
                variant={isAdmin ? "secondary" : "default"}
                size="sm"
                className="flex items-center gap-2"
              >
                {isAdmin ? (
                  <>
                    <ShieldX className="size-4" strokeWidth={"2px"} />
                    <span>Revoke Admin</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" strokeWidth={"2px"} />
                    <span>Make Admin</span>
                  </>
                )}
              </Button>
            }
            userId={userId}
            makeAdmin={isAdmin ? false : true}
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
  makeAdmin,
  userId,
  handleRoleChange,
  isChangingRole,
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        {makeAdmin ? (
          <AlertDialogDescription>
            Granting admin access to this user. This action cannot be undone.
          </AlertDialogDescription>
        ) : (
          <AlertDialogDescription>
            Revoking all admin privileges from this user. This action cannot be
            undone.
          </AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => handleRoleChange(userId)}>
          {isChangingRole && <LoaderLucide className="size-4 animate-spin" />}
          {!isChangingRole && <span>Confirm</span>}
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

const Loader = () => (
  <div className="flex items-center gap-2 opacity-60">
    <LoaderLucide className="animate-spin size-5" />
    Fetching Users
  </div>
);

const NoUsersMessage = () => (
  <section className="border rounded-lg p-12 text-muted-foreground bg-muted/50 backdrop-blur-[1px] w-full flex flex-col items-center justify-center">
    <div className="flex items-center gap-2 justify-center">
      <CircleAlert
        strokeWidth={"1.5px"}
        className="text-muted-foreground size-5"
      />
      <div>Zero users right now</div>
    </div>
  </section>
);
