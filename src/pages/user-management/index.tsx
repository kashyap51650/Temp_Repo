import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms";
import { DataTable } from "@/components/organisms";
import {
  getUserColumns,
  type UserRow,
} from "@/components/organisms/DataTable/tableColumns";
import { DisableAccountModal } from "@/components/user-management/DisableAccountModal";
import { ResetPasswordModal } from "@/components/user-management/ResetPasswordModal";
import { UserFilterBar } from "@/components/user-management/UserFilterBar";
import { UserModal } from "@/components/user-management/UserModal";
import {
  useCreateUser,
  useRoles,
  useUpdateUser,
  useUpdateUserStatus,
  useUsers,
} from "@/hooks/useFetch";
import { handleApiError } from "@/lib/api";
import { transformUserToRow, type UserFilters } from "@/types/auth";

export default function UserManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [resetUser, setResetUser] = useState<UserRow | null>(null);
  const [disableUser, setDisableUser] = useState<UserRow | null>(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const filters = useMemo(() => {
    const apiFilters: UserFilters = {
      page: currentPage,
      size: pageSize,
    };

    if (search.trim()) apiFilters.search = search.trim();
    if (role) apiFilters.role_ids = role;
    if (status) apiFilters.statuses = status.toLowerCase();

    return apiFilters;
  }, [search, role, status, currentPage]);

  const {
    data: usersData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useUsers(filters);
  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const updateUserStatusMutation = useUpdateUserStatus();

  const transformedData = useMemo(() => {
    if (!usersData?.data?.items) return [];
    return usersData.data.items.map(transformUserToRow);
  }, [usersData]);

  const roles = useMemo(() => {
    return rolesData?.data?.items || [];
  }, [rolesData]);

  const handleResetFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setCurrentPage(1);
  };

  const handleSave = async ({
    firstName,
    lastName,
    email,
    roleId,
    expiry,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
    expiry: string | null;
  }) => {
    try {
      await createUserMutation.mutateAsync({
        email,
        first_name: firstName,
        last_name: lastName,
        role_id: parseInt(roleId),
        account_expiry_date: expiry ? expiry.split("T")[0] : null,
      });

      toast.success("User created successfully!");
      setModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating user:", error);
      const errorMessage = handleApiError(error, "Failed to create user");
      toast.error(errorMessage);
    }
  };

  const handleEditSave = async ({
    firstName,
    lastName,
    email,
    roleId,
    expiry,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
    expiry: string | null;
  }) => {
    if (!editUser) return;

    try {
      await updateUserMutation.mutateAsync({
        userId: editUser.id,
        userData: {
          email,
          first_name: firstName,
          last_name: lastName,
          role_id: parseInt(roleId),
          account_expiry_date: expiry ? expiry.split("T")[0] : null,
          status: editUser.status.toLowerCase(),
        },
      });

      toast.success("User updated successfully!");
      setEditUser(null);
      refetch();

      // Will be used in future
      // // Call the user-roles API only if the role has changed
      // const currentRoleId = roles.find(r => r.name === editUser.role)?.id.toString();
      // const hasRoleChanged = currentRoleId !== roleId;

      // if (hasRoleChanged) {
      //   try {
      //     await roleApi.assignUserRole({
      //       role_id: parseInt(roleId),
      //       user_id: parseInt(editUser.id)
      //     });
      //     console.log('User role assignment updated successfully');
      //   } catch (userRolesError) {
      //     console.error('Error calling user-roles API:', userRolesError);
      //   }
      // } else {
      //   console.log('Role unchanged, skipping user-roles API call');
      // }
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage = handleApiError(error, "Failed to update user");
      toast.error(errorMessage);
    }
  };

  const handleToggleUserStatus = async () => {
    if (!disableUser) return;

    const isCurrentlyActive = disableUser.status === "Active";
    const statusToSet = isCurrentlyActive ? "inactive" : "active";
    const successMessage = isCurrentlyActive
      ? "User disabled successfully!"
      : "User enabled successfully!";

    try {
      await updateUserStatusMutation.mutateAsync({
        userId: disableUser.id,
        status: statusToSet,
      });
      toast.success(successMessage);
      setDisableUser(null);
    } catch (error) {
      console.error(
        `Error ${isCurrentlyActive ? "disabling" : "enabling"} user:`,
        error
      );
      const errorMessage = handleApiError(
        error,
        `Failed to ${isCurrentlyActive ? "disable" : "enable"} user`
      );
      toast.error(errorMessage);
    }
  };

  const columns = getUserColumns({
    onEdit: (user) => setEditUser(user),
    onResetPassword: (user) => setResetUser(user),
    onDisable: (user) => setDisableUser(user),
  });

  if (error) {
    return (
      <div className="px-6 py-6">
        <div className="text-center text-red-600">
          <p>
            Error loading users:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <UserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode="add"
        onSave={handleSave}
        isLoading={createUserMutation.isPending}
      />
      <UserModal
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        mode="edit"
        user={
          editUser
            ? (() => {
                const { name = "", email = "", role = "" } = editUser;
                const [firstName = "", ...lastNameParts] = name.split(" ");
                const lastName = lastNameParts.join(" ");
                const roleId =
                  roles.find((r) => r.name === role)?.id.toString() || "";

                return {
                  firstName,
                  lastName,
                  email,
                  roleId,
                  expiry: undefined,
                };
              })()
            : { firstName: "", lastName: "", email: "", roleId: "" }
        }
        onSave={handleEditSave}
        isLoading={updateUserMutation.isPending}
      />
      <ResetPasswordModal
        open={!!resetUser}
        onOpenChange={(open) => !open && setResetUser(null)}
        onSuccess={() => {
          setResetUser(null);
          refetch();
        }}
      />
      <DisableAccountModal
        open={!!disableUser}
        onOpenChange={(open) => !open && setDisableUser(null)}
        onToggleStatus={handleToggleUserStatus}
        username={disableUser?.name}
        userStatus={disableUser?.status || "Active"}
        isLoading={updateUserStatusMutation.isPending}
      />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-black">
            User Management
          </h1>
          <p className="text-gray-600 mb-0">
            Manage users and their access to the platform
          </p>
        </div>
        <Button
          variant={"default"}
          size={"lg"}
          onClick={() => setModalOpen(true)}
        >
          <Plus /> Add User
        </Button>
      </div>

      <UserFilterBar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        onReset={handleResetFilters}
        roles={roles}
        rolesLoading={rolesLoading}
      />

      {isLoading ? (
        <div className="text-center py-8">
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="relative">
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                <p className="text-sm text-gray-600">Refreshing...</p>
              </div>
            </div>
          )}
          <DataTable columns={columns} data={transformedData} />
        </div>
      )}
    </div>
  );
}
