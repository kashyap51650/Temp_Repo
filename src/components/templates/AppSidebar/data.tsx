import { objectToFlattenArray } from "@/lib";
import { type Permission, PERMISSIONS } from "@/lib/permissions";

export const sidebarData = {
  user: {
    name: "Admin user",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: "IconHome",
      permissions: null,
    },
    {
      title: "User Management",
      url: "/user-management",
      icon: "IconDashboard",
      permissions: [PERMISSIONS.USER_MANAGEMENT.VIEW_USERS],
    },
    {
      title: "RBAC",
      url: "/rbac",
      icon: "IconListDetails",
      permissions: [
        PERMISSIONS.RBAC.VIEW_ROLES,
        PERMISSIONS.RBAC.VIEW_ROLE_PERMISSIONS,
        PERMISSIONS.RBAC.VIEW_USER_ASSIGNED_ROLES,
      ],
    },
    {
      title: "Data Upload",
      url: "/data-upload",
      icon: "IconChartBar",
      permissions: objectToFlattenArray<Permission>(PERMISSIONS.DATA_UPLOAD),
    },
    {
      title: "Data Validate",
      url: "/data-validate",
      icon: "IconFolder",
      permissions: objectToFlattenArray<Permission>(PERMISSIONS.DATA_VALIDATE),
    },
    {
      title: "Templates",
      url: "/templates",
      icon: "IconHelp",
      permissions: [PERMISSIONS.TEMPLATES.VIEW],
    },
    {
      title: "Project Folders",
      url: "/project-folders",
      icon: "IconFolder",
      permissions: [PERMISSIONS.PROJECTS.VIEW],
    },
    {
      title: "Master Data",
      url: "/master-data",
      icon: "IconDatabase",
      permissions: [PERMISSIONS.MASTER_DATA.VIEW],
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: "IconReport",
      permissions: [
        PERMISSIONS.NOTIFICATIONS.SEND,
        PERMISSIONS.NOTIFICATIONS.VIEW_HISTORY,
        PERMISSIONS.NOTIFICATIONS.VIEW_TEMPLATES,
      ],
    },
  ],
};
