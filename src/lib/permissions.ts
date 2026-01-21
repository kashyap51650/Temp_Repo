// src/lib/permissions.ts
export const PERMISSIONS = {
  // User Management
  USER_MANAGEMENT: {
    VIEW_USERS: "user_management:view_user",
    ADD_USER: "user_management:create_user",
    UPDATE_USER: "user_management:update_user",
    DELETE_USER: "user_management:delete_user",
    RESET_PASSWORD: "user_management:reset_user_password", // NOSONAR - This is a permission key, not a hardcoded password
    CHANGE_STATUS: "user_management:change_user_status",
  },

  // RBAC
  RBAC: {
    VIEW_ROLES: "rbac:view_role",
    CREATE_ROLE: "rbac:create_role",
    UPDATE_ROLE: "rbac:update_role",
    DELETE_ROLE: "rbac:delete_role",
    VIEW_ROLE_PERMISSIONS: "rbac:view_role_permissions",
    ASSIGN_ROLE_PERMISSIONS: "rbac:assign_permissions_to_role",
    VIEW_USER_ASSIGNED_ROLES: "rbac:view_user_assigned_roles",
    ASSIGN_ROLES: "rbac:assign_roles_to_user",
  },

  // Data Upload
  DATA_UPLOAD: {
    VIEW: "data_upload:view_data",
    UPLOAD: "data_upload:upload_data",
    UPDATE: "data_upload:update_data",
    DELETE: "data_upload:delete_data",
  },

  // Data Validate
  DATA_VALIDATE: {
    VIEW_DATA: "data_validate:view_data",
    EDIT_DATA: "data_validate:update_data",
    APPROVE_REJECT_DATA: "data_validate:approve_reject_data",
  },

  // Experiment
  EXPERIMENT: {
    VIEW: "experiment:view_experiment",
    CREATE: "experiment:create_experiment",
    UPDATE: "experiment:update_experiment",
    DELETE: "experiment:delete_experiment",
    CLOSE: "experiment:close_experiment",
  },

  // Master Data
  MASTER_DATA: {
    CREATE: "master_data:create_master_data",
    VIEW: "master_data:view_master_data",
    UPDATE: "master_data:update_master_data",
    DELETE: "master_data:delete_master_data",
  },

  // Mouse
  MOUSE: {
    RANDOMIZATION: "mouse:randomization",
    MOVE_MICE: "mouse:move_mice",
    TERMINATE_MICE: "mouse:terminate_mice",
  },

  // Templates
  TEMPLATES: {
    VIEW: "templates:view_filter",
    CREATE: "templates:create_filter",
    SHARE: "templates:share_filter",
  },

  // Project Folders
  PROJECTS: {
    VIEW: "project:view_project",
    CREATE: "project:create_project",
    UPDATE: "project:update_project",
    DELETE: "project:delete_project",
    CLOSE: "project:close_project",
  },

  // Notifications
  NOTIFICATIONS: {
    SEND: "notifications:send_notification",
    VIEW_HISTORY: "notifications:view_notification_history",
    CREATE_TEMPLATE: "notifications:create_template",
    VIEW_TEMPLATES: "notifications:view_template",
    EDIT_TEMPLATES: "notifications:update_template",
    DELETE: "notifications:delete_notification",
    DELETE_TEMPLATES: "notifications:delete_template",
  },
} as const;

// ─────────────────────────────────────────────
// Type-safe permission union
// ─────────────────────────────────────────────
type NestedValues<T> = T extends object
  ? { [K in keyof T]: T[K] extends string ? T[K] : NestedValues<T[K]> }[keyof T]
  : never;

export type Permission = NestedValues<typeof PERMISSIONS>;
