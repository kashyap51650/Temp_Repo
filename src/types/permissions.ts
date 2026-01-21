import type { ApiResponse } from "@/lib/api";

export type MyPermissionResponse = ApiResponse<{
  user: User;
  roles: Role[];
}>;

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  is_primary: boolean;
  assigned_at: string; // ISO date string
  assigned_permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  action: string;
  resource_key: string; // e.g. "data_upload:view"
  description: string;
}
