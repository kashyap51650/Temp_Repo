// src/lib/permissions.ts
export const PERMISSIONS = {
  // ─────────────────────────────
  // User Management
  // ─────────────────────────────
  USER_MANAGEMENT: {
    VIEW_USERS: "user_management:view_user",
    ADD_USER: "user_management:create_user",
    UPDATE_USER: "user_management:update_user",
    DELETE_USER: "user_management:delete_user",
    RESET_PASSWORD: "user_management:reset_user_password", // NOSONAR - This is a permission key, not a hardcoded password
    CHANGE_STATUS: "user_management:change_user_status",
  },

  // ─────────────────────────────
  // RBAC
  // ─────────────────────────────
  RBAC: {
    VIEW_ROLES: "rbac:view_role",
    CREATE_ROLE: "rbac:create_role",
    UPDATE_ROLE: "rbac:update_role",
    DELETE_ROLE: "rbac:delete_role",
    VIEW_ROLE_PERMISSIONS: "rbac:view_role_permissions",
    VIEW_USER_ASSIGNED_ROLES: "rbac:view_user_assigned_roles",
    ASSIGN_ROLES: "rbac:assign_roles_to_user",
    ASSIGN_ROLE_PERMISSIONS: "rbac:assign_permissions_to_role",
  },

  // ─────────────────────────────
  // Data Upload (Root)
  // ─────────────────────────────
  DATA_UPLOAD: {
    VIEW: "data_upload:view_data",
    UPLOAD: "data_upload:upload_data",
    UPDATE: "data_upload:update_data",
    DELETE: "data_upload:delete_data",

    PRECLINICAL: {
      BIOD: {
        WEIGHT: "data_upload__preclinical__biod:weight_sheet_upload",
        CALLIPERING: "data_upload__preclinical__biod:callipering_sheet_upload",
        ORGAN_WEIGHT:
          "data_upload__preclinical__biod:organ_weight_sheet_upload",
        AGC: "data_upload__preclinical__biod:agc_sheet_upload",
        HOTLAB: "data_upload__preclinical__biod:hotlab_sheet_upload",
      },
      MODEL_STUDY: {
        WEIGHT: "data_upload__preclinical__model_study:weight_sheet_upload",
        CALLIPERING:
          "data_upload__preclinical__model_study:callipering_sheet_upload",
        HOTLAB: "data_upload__preclinical__model_study:hotlab_sheet_upload",
      },
      DRF: {
        WEIGHT: "data_upload__preclinical__drf:weight_sheet_upload",
        HEMATOLOGY: "data_upload__preclinical__drf:hematology_upload",
        BLOOD_CHEMISTRY: "data_upload__preclinical__drf:blood_chemistry_upload",
        NECROPSY: "data_upload__preclinical__drf:necropsy_upload",
        HOTLAB: "data_upload__preclinical__drf:hotlab_sheet_upload",
      },
      TOXICITY: {
        WEIGHT: "data_upload__preclinical__toxicity:weight_sheet_upload",
        HEMATOLOGY: "data_upload__preclinical__toxicity:hematology_upload",
        BLOOD_CHEMISTRY:
          "data_upload__preclinical__toxicity:blood_chemistry_upload",
        NECROPSY: "data_upload__preclinical__toxicity:necropsy_upload",
        HOTLAB: "data_upload__preclinical__toxicity:hotlab_sheet_upload",
      },
      EFFICACY: {
        WEIGHT: "data_upload__preclinical__efficacy:weight_sheet_upload",
        CALLIPERING:
          "data_upload__preclinical__efficacy:callipering_sheet_upload",
        HOTLAB: "data_upload__preclinical__efficacy:hotlab_sheet_upload",
      },
    },
  },

  // ─────────────────────────────
  // Data Validate (Root)
  // ─────────────────────────────
  DATA_VALIDATE: {
    VIEW_DATA: "data_validate:view_data",
    EDIT_DATA: "data_validate:update_data",
    APPROVE_REJECT_DATA: "data_validate:approve_reject_data",
    PERFORM_BIOD: "data_validate:perform_biod",

    PRECLINICAL: {
      BIOD: {
        WEIGHT: "data_validate__preclinical__biod:weight_sheet_validate",
        CALLIPERING:
          "data_validate__preclinical__biod:callipering_sheet_validate",
        ORGAN_WEIGHT:
          "data_validate__preclinical__biod:organ_weight_sheet_validate",
        AGC: "data_validate__preclinical__biod:agc_sheet_validate",
        HOTLAB: "data_validate__preclinical__biod:hotlab_sheet_validate",
      },
      MODEL_STUDY: {
        WEIGHT: "data_validate__preclinical__model_study:weight_sheet_validate",
        CALLIPERING:
          "data_validate__preclinical__model_study:callipering_sheet_validate",
        HOTLAB: "data_validate__preclinical__model_study:hotlab_sheet_validate",
        PERFORM_BIOD: "data_validate__preclinical__model_study:perform_biod",
      },
      DRF: {
        WEIGHT: "data_validate__preclinical__drf:weight_sheet_validate",
        HEMATOLOGY: "data_validate__preclinical__drf:hematology_validate",
        BLOOD_CHEMISTRY:
          "data_validate__preclinical__drf:blood_chemistry_validate",
        NECROPSY: "data_validate__preclinical__drf:necropsy_validate",
        HOTLAB: "data_validate__preclinical__drf:hotlab_sheet_validate",
      },
      TOXICITY: {
        WEIGHT: "data_validate__preclinical__toxicity:weight_sheet_validate",
        HEMATOLOGY: "data_validate__preclinical__toxicity:hematology_validate",
        BLOOD_CHEMISTRY:
          "data_validate__preclinical__toxicity:blood_chemistry_validate",
        NECROPSY: "data_validate__preclinical__toxicity:necropsy_validate",
        HOTLAB: "data_validate__preclinical__toxicity:hotlab_sheet_validate",
      },
      EFFICACY: {
        WEIGHT: "data_validate__preclinical__efficacy:weight_sheet_validate",
        CALLIPERING:
          "data_validate__preclinical__efficacy:callipering_sheet_validate",
        HOTLAB: "data_validate__preclinical__efficacy:hotlab_sheet_validate",
        PERFORM_BIOD: "data_validate__preclinical__efficacy:perform_biod",
      },
    },
  },

  // ─────────────────────────────
  // Experiment
  // ─────────────────────────────
  EXPERIMENT: {
    VIEW: "experiment:view_experiment",
    CREATE: "experiment:create_experiment",
    UPDATE: "experiment:update_experiment",
    DELETE: "experiment:delete_experiment",
    CLOSE: "experiment:close_experiment",
  },

  // ─────────────────────────────
  // Master Data
  // ─────────────────────────────
  MASTER_DATA: {
    VIEW: "master_data:view_master_data",
    CREATE: "master_data:create_master_data",
    UPDATE: "master_data:update_master_data",
    DELETE: "master_data:delete_master_data",
  },

  // ─────────────────────────────
  // Mouse
  // ─────────────────────────────
  MOUSE: {
    RANDOMIZATION: "mouse:randomization",
    MOVE_MICE: "mouse:move_mice",
    TERMINATE_MICE: "mouse:terminate_mice",
  },

  // ─────────────────────────────
  // Templates
  // ─────────────────────────────
  TEMPLATES: {
    VIEW: "templates:view_filter",
    CREATE: "templates:create_filter",
    SHARE: "templates:share_filter",
  },

  // ─────────────────────────────
  // Projects
  // ─────────────────────────────
  PROJECTS: {
    VIEW: "project:view_project",
    CREATE: "project:create_project",
    UPDATE: "project:update_project",
    DELETE: "project:delete_project",
    CLOSE: "project:close_project",
  },

  // ─────────────────────────────
  // Notifications
  // ─────────────────────────────
  NOTIFICATIONS: {
    SEND: "notifications:send_notification",
    VIEW_HISTORY: "notifications:view_notification_history",
    DELETE: "notifications:delete_notification",
    CREATE_TEMPLATE: "notifications:create_template",
    VIEW_TEMPLATES: "notifications:view_template",
    EDIT_TEMPLATES: "notifications:update_template",
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
