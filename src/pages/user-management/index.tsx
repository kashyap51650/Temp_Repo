import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/atoms";
import { DataTable } from "@/components/organisms";
import {
  getUserColumns,
  type UserRow,
} from "@/components/organisms/DataTable/tableColumns";
import { tableData } from "@/components/organisms/DataTable/tableData";
import { AddUserModal } from "@/components/user-management/AddUserModal";
import { DisableAccountModal } from "@/components/user-management/DisableAccountModal";
import { EditUserModal } from "@/components/user-management/EditUserModal";
import { ResetPasswordModal } from "@/components/user-management/ResetPasswordModal";
import { UserFilterBar } from "@/components/user-management/UserFilterBar";

export default function UserManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [resetUser, setResetUser] = useState<UserRow | null>(null);
  const [disableUser, setDisableUser] = useState<UserRow | null>(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const filteredData = useMemo(() => {
    return tableData.filter((user) => {
      const matchesSearch =
        search.trim() === "" ||
        user.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        user.email.toLowerCase().includes(search.trim().toLowerCase());
      const matchesRole = !role || user.role === role;
      const matchesStatus = !status || user.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, role, status]);

  const handleResetFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
  };

  const handleSave = (_data: {
    username: string;
    email: string;
    expiry: string | null;
  }) => {
    setModalOpen(false);
  };

  const columns = getUserColumns({
    onEdit: (user) => setEditUser(user),
    onResetPassword: (user) => setResetUser(user),
    onDisable: (user) => setDisableUser(user),
  });

  return (
    <div className="px-6 py-6">
      <AddUserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
      />
      <EditUserModal
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        user={
          editUser
            ? {
                username: editUser.name,
                email: editUser.email,
                expiry: undefined,
              }
            : { username: "", email: "" }
        }
        onSave={() => setEditUser(null)}
      />
      <ResetPasswordModal
        open={!!resetUser}
        onOpenChange={(open) => !open && setResetUser(null)}
        onSuccess={() => setResetUser(null)}
      />
      <DisableAccountModal
        open={!!disableUser}
        onOpenChange={(open) => !open && setDisableUser(null)}
        onDisable={() => setDisableUser(null)}
        username={disableUser?.name}
      />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-black">
            User Management
          </h1>
          <p className="text-gray-600 mb-0">
            Manage users and their access to the platform Add User
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
      />

      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
