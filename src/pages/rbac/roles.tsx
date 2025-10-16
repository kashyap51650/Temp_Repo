import { Plus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/atoms/Button/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules/Tabs/Tabs";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import {
  getPermissionColumns,
  getRoleColumns,
} from "@/components/organisms/DataTable/tableColumns";
import type {
  PermissionAssignment,
  RoleRow,
} from "@/components/organisms/DataTable/tableData";
import {
  permissionAssignments,
  rolesTableData,
} from "@/components/organisms/DataTable/tableData";
import { PermissionsTab } from "@/components/organisms/Permissions/PermissionsTab";
import { CreateRoleModal } from "@/components/organisms/Roles/CreateRoleModal";
import { EditRoleModal } from "@/components/organisms/Roles/EditRoleModal";
import { EditAssignmentModal } from "@/components/organisms/UserAssignments/EditAssignmentModal";

export default function RBACRolesPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<RoleRow | null>(null);
  const [roles, setRoles] = React.useState<RoleRow[]>(rolesTableData);

  const [assignments, setAssignments] = React.useState<PermissionAssignment[]>(
    permissionAssignments
  );
  const [editAssignmentModalOpen, setEditAssignmentModalOpen] =
    React.useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    React.useState<PermissionAssignment | null>(null);

  const [permissionsSelectedRole, setPermissionsSelectedRole] =
    React.useState("Administrator");

  const handleCreateRole = async (roleName: string) => {
    setRoles((prev: RoleRow[]) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        name: roleName,
        description: "",
        usersAssigned: 0,
      },
    ]);
  };

  const handleEditRole = (role: RoleRow) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  const handleSaveRole = (updatedRole: {
    id: string;
    name: string;
    description: string;
  }) => {
    setRoles((prev: RoleRow[]) =>
      prev.map((r) =>
        r.id === updatedRole.id
          ? {
              ...r,
              name: updatedRole.name,
              description: updatedRole.description,
            }
          : r
      )
    );
    setEditModalOpen(false);
    setSelectedRole(null);
  };

  const handleEditAssignment = (assignment: PermissionAssignment) => {
    setSelectedAssignment(assignment);
    setEditAssignmentModalOpen(true);
  };

  const handleUpdateAssignment = (updatedAssignment: PermissionAssignment) => {
    setAssignments(
      assignments.map((assignment) =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      )
    );
  };

  const handlePermissionsSave = (permissions: any) => {
    console.log(
      "Saving permissions for role:",
      permissionsSelectedRole,
      permissions
    );
  };

  const handlePermissionsCancel = () => {
    console.log("Permissions configuration cancelled");
  };

  return (
    <div className="px-6 py-6">
      <h1 className="text-3xl font-bold mb-2 text-black">RBAC Management</h1>
      <p className="text-gray-600 mb-0">
        Manage roles, permissions, and user assignments
      </p>
      <Tabs defaultValue="roles" className="mt-8">
        <div className="flex items-center mb-4">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="assignments">User Assignments</TabsTrigger>
          </TabsList>
          <div className="flex-1" />
        </div>
        <TabsContent value="roles">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-black flex-1">Roles</h2>
            <Button
              className="ml-4"
              size="lg"
              onClick={() => setModalOpen(true)}
            >
              <Plus /> Create Role
            </Button>
          </div>
          <DataTable columns={getRoleColumns(handleEditRole)} data={roles} />
          <CreateRoleModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            onCreate={handleCreateRole}
          />
          <EditRoleModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            role={selectedRole}
            onSave={handleSaveRole}
          />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab
            selectedRole={permissionsSelectedRole}
            onRoleChange={setPermissionsSelectedRole}
            onSave={handlePermissionsSave}
            onCancel={handlePermissionsCancel}
          />
        </TabsContent>

        <TabsContent value="assignments">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-black flex-1">
              User Assignments
            </h2>
          </div>
          <DataTable
            columns={getPermissionColumns(handleEditAssignment)}
            data={assignments}
          />

          <EditAssignmentModal
            open={editAssignmentModalOpen}
            onOpenChange={setEditAssignmentModalOpen}
            assignment={selectedAssignment}
            onSave={handleUpdateAssignment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
