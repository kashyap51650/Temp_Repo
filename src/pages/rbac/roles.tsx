import { useQuery } from "@tanstack/react-query";
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
import { PermissionsTab } from "@/components/organisms/Permissions/PermissionsTab";
import { CreateRoleModal } from "@/components/organisms/Roles/CreateRoleModal";
import { EditRoleModal } from "@/components/organisms/Roles/EditRoleModal";
import { EditAssignmentModal } from "@/components/organisms/UserAssignments/EditAssignmentModal";
import { roleApi } from "@/lib/api";
import {
  transformRoleToRow,
  transformUserAssignmentToRow,
  type UserAssignment,
} from "@/types/auth";

export default function RBACRolesPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<RoleRow | null>(null);
  const [page] = React.useState(1);
  const [size] = React.useState(10);

  const {
    data: rolesResponse,
    isLoading: rolesLoading,
    isFetching: rolesFetching,
    error: rolesError,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ["roles", page, size],
    queryFn: () => roleApi.getRoles(page, size),
    retry: 2,
  });

  const {
    data: userAssignmentsResponse,
    isLoading: assignmentsLoading,
    isFetching: assignmentsFetching,
    error: assignmentsError,
    refetch: refetchAssignments,
  } = useQuery({
    queryKey: ["userAssignments", page, size],
    queryFn: () => roleApi.getUsersWithRoles(page, size),
    retry: 2,
  });

  const roles: RoleRow[] = React.useMemo(() => {
    if (!rolesResponse?.data?.items) return [];
    return rolesResponse.data.items.map(transformRoleToRow);
  }, [rolesResponse]);

  const assignments: PermissionAssignment[] = React.useMemo(() => {
    if (!userAssignmentsResponse?.data?.items) return [];
    return userAssignmentsResponse.data.items.map(transformUserAssignmentToRow);
  }, [userAssignmentsResponse]);

  const [editAssignmentModalOpen, setEditAssignmentModalOpen] =
    React.useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    React.useState<PermissionAssignment | null>(null);
  const [selectedUserAssignment, setSelectedUserAssignment] =
    React.useState<UserAssignment | null>(null);

  const [permissionsSelectedRole, setPermissionsSelectedRole] =
    React.useState("1");

  const handleCreateRole = async (roleData: {
    name: string;
    description: string;
  }) => {
    try {
      await roleApi.createRole(roleData);
      refetchRoles();
    } catch (error) {
      // TBR by sonar in future
      console.error("Error creating role:", error);
    }
  };

  const handleEditRole = (role: RoleRow) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  const handleSaveRole = async (updatedRole: {
    id: string;
    name: string;
    description: string;
  }) => {
    try {
      await roleApi.updateRole(updatedRole.id, {
        name: updatedRole.name,
        description: updatedRole.description,
      });
      setEditModalOpen(false);
      setSelectedRole(null);
      refetchRoles();
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleEditAssignment = (assignment: PermissionAssignment) => {
    setSelectedAssignment(assignment);

    // Find the full user assignment data from the API response
    const fullUserAssignment = userAssignmentsResponse?.data?.items.find(
      (userAssignment) => userAssignment.user.id.toString() === assignment.id
    );

    setSelectedUserAssignment(fullUserAssignment || null);
    setEditAssignmentModalOpen(true);
  };

  const handleUpdateAssignment = (_updatedAssignment: PermissionAssignment) => {
    // Since assignments are now from API, we need to refetch to get updated data
    // In a real implementation, you would call an API to update the assignment
    // and then refetch the data
    refetchAssignments();
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

  if (rolesLoading) {
    return (
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold mb-2 text-black">RBAC Management</h1>
        <p className="text-gray-600 mb-0">
          Manage roles, permissions, and user assignments
        </p>
        <div className="mt-8 flex items-center justify-center py-8">
          <div className="text-gray-500">Loading roles...</div>
        </div>
      </div>
    );
  }

  if (rolesError) {
    return (
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold mb-2 text-black">RBAC Management</h1>
        <p className="text-gray-600 mb-0">
          Manage roles, permissions, and user assignments
        </p>
        <div className="mt-8 flex items-center justify-center py-8">
          <div className="text-red-500">
            Error loading roles. Please try again later.
          </div>
        </div>
      </div>
    );
  }

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

          <div className="relative">
            {rolesFetching && !rolesLoading && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                  <p className="text-sm text-gray-600">Refreshing roles...</p>
                </div>
              </div>
            )}
            <DataTable columns={getRoleColumns(handleEditRole)} data={roles} />
          </div>

          {/* {rolesResponse?.data?.pagination && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {rolesResponse.data.pagination.page} of{" "}
              {rolesResponse.data.pagination.pages} pages (
              {rolesResponse.data.pagination.total} total roles)
            </div>
          )} */}

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
            roles={roles}
          />
        </TabsContent>

        <TabsContent value="assignments">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-black flex-1">
              User Assignments
            </h2>
          </div>
          {assignmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading user assignments...</div>
            </div>
          ) : assignmentsError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-500">
                Error loading user assignments. Please try again later.
              </div>
            </div>
          ) : (
            <div className="relative">
              {assignmentsFetching && !assignmentsLoading && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-md">
                    <p className="text-sm text-gray-600">
                      Refreshing assignments...
                    </p>
                  </div>
                </div>
              )}
              <DataTable
                columns={getPermissionColumns(handleEditAssignment)}
                data={assignments}
              />
            </div>
          )}

          {/* {userAssignmentsResponse?.data?.pagination && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {userAssignmentsResponse.data.pagination.page} of{" "}
              {userAssignmentsResponse.data.pagination.pages} pages (
              {userAssignmentsResponse.data.pagination.total} total assignments)
            </div>
          )} */}

          <EditAssignmentModal
            open={editAssignmentModalOpen}
            onOpenChange={setEditAssignmentModalOpen}
            assignment={selectedAssignment}
            userAssignment={selectedUserAssignment}
            roles={rolesResponse?.data?.items || []}
            onSave={handleUpdateAssignment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
