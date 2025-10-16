import type { UserRow } from "./tableColumns";

export const tableData: UserRow[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@oranomed.com",
    role: "Administrator",
    lastLogin: "2024-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@oranomed.com",
    role: "Data Uploader",
    lastLogin: "2024-01-14",
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@oranomed.com",
    role: "Scientist",
    lastLogin: "2024-01-10",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@oranomed.com",
    role: "Scientist",
    lastLogin: "2024-01-12",
    status: "Active",
  },
];

// RBAC Roles Table Data
export type RoleRow = {
  id: string;
  name: string;
  description: string;
  usersAssigned: number;
};

// User Assignments Table Data (Permissions)
export type PermissionAssignment = {
  id: string;
  user: string;
  role: string;
  permissions: string[];
};

export const permissionAssignments: PermissionAssignment[] = [
  {
    id: "1",
    user: "John Smith",
    role: "Administrator",
    permissions: [
      "User Management",
      "Data Upload",
      "Query Builder",
      "View Data",
      "System Settings",
    ],
  },
  {
    id: "2",
    user: "Sarah Johnson",
    role: "Data Uploader",
    permissions: ["Data Upload", "View Data"],
  },
  {
    id: "3",
    user: "Michael Chen",
    role: "Scientist",
    permissions: ["Query Builder", "View Data"],
  },
  {
    id: "4",
    user: "Emily Rodriguez",
    role: "Scientist",
    permissions: ["Query Builder", "View Data"],
  },
];

export const rolesTableData: RoleRow[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access",
    usersAssigned: 3,
  },
  {
    id: "2",
    name: "Data Uploader",
    description: "Can upload and manage datasets",
    usersAssigned: 5,
  },
  {
    id: "3",
    name: "Scientist",
    description: "Can view and query data",
    usersAssigned: 12,
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access",
    usersAssigned: 8,
  },
];
