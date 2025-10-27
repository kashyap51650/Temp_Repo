import type { PermissionGroup } from "../Permissions/PermissionsTab";

export const sidebarData = {
  user: {
    name: "Admin user",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "User Management",
      url: "/user-management",
      icon: "IconDashboard",
    },
    {
      title: "RBAC",
      url: "/rbac",
      icon: "IconListDetails",
    },
    {
      title: "Data Upload",
      url: "/data-upload",
      icon: "IconChartBar",
    },
    {
      title: "Data Validate",
      url: "/data-validate",
      icon: "IconFolder",
    },
    {
      title: "Templates",
      url: "/templates",
      icon: "IconHelp",
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: "IconReport",
    },
    {
      title: "Settings",
      url: "/settings",
      icon: "IconSettings",
    },
  ],
};

export const initialPermissions: PermissionGroup[] = [
  {
    id: "user-management",
    name: "User Management",
    expanded: true,
    checked: false,
    indeterminate: true,
    permissions: [
      { id: "add-user", name: "Add User", checked: true },
      { id: "delete-user", name: "Delete User", checked: true },
      { id: "view-users-list", name: "View Users List", checked: true },
      { id: "edit-user-details", name: "Edit User Details", checked: false },
    ],
  },
  {
    id: "rbac",
    name: "RBAC",
    expanded: true,
    checked: false,
    indeterminate: true,
    permissions: [
      { id: "create-role", name: "Create Role", checked: false },
      { id: "view-roles", name: "View Roles", checked: false },
      { id: "assign-permissions", name: "Assign Permissions", checked: false },
      {
        id: "assign-roles-to-users",
        name: "Assign Roles to Users",
        checked: false,
      },
      {
        id: "view-assigned-roles",
        name: "View Assigned Roles",
        checked: false,
      },
    ],
  },
  {
    id: "data-upload",
    name: "Data Upload",
    expanded: false,
    checked: false,
    indeterminate: false,
    permissions: [
      { id: "upload-data", name: "Upload Data", checked: false },
      { id: "view-uploaded-data", name: "View Uploaded Data", checked: false },
    ],
  },
  {
    id: "data-validate",
    name: "Data Validate",
    expanded: false,
    checked: false,
    indeterminate: false,
    permissions: [
      {
        id: "view-calculated-data",
        name: "View Calculated Data",
        checked: false,
      },
      {
        id: "approve-reject-calculated-data",
        name: "Approve/Reject Calculated Data",
        checked: false,
      },
    ],
  },
  {
    id: "templates",
    name: "Templates",
    expanded: false,
    checked: false,
    indeterminate: false,
    permissions: [
      {
        id: "view-visual-data-filters",
        name: "View Visual Data Filters",
        checked: false,
      },
      {
        id: "create-visual-data-filters",
        name: "Create Visual Data Filters",
        checked: false,
      },
      {
        id: "share-visual-data-filters",
        name: "Share Visual Data Filters",
        checked: false,
      },
    ],
  },
  {
    id: "notifications",
    name: "Notifications",
    expanded: false,
    checked: false,
    indeterminate: false,
    permissions: [
      {
        id: "create-send-notification",
        name: "Create & Send Notification",
        checked: false,
      },
      {
        id: "create-notification-templates",
        name: "Create Notification Templates",
        checked: false,
      },
      {
        id: "view-notification-templates",
        name: "View Notification Templates",
        checked: false,
      },
      {
        id: "view-notification-history",
        name: "View Notification History",
        checked: false,
      },
    ],
  },
];
