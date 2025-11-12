// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_superuser: boolean;
  // Optional fields that may or may not be in the response
  status?: string;
  is_active?: boolean;
  is_email_verified?: boolean;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// API Response structure that matches the actual backend response
export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    token: TokenData;
    user: AuthUser;
    must_change_password: boolean;
  };
}

// Internal response structure for our app
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
  must_change_password: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  access_token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserRole {
  id: number;
  role_name: string;
  description: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  roles: UserRole[] | null;
  status: "active" | "inactive";
  last_login_at: string | null;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    items: User[];
    pagination: {
      page: number;
      size: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export interface UserFilters {
  search?: string;
  role_ids?: string;
  statuses?: string;
  page?: number;
  size?: number;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string | null;
  user_count: number;
}

export interface RolesResponse {
  success: boolean;
  message: string;
  data: {
    items: Role[];
    pagination: {
      page: number;
      size: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export const transformUserToRow = (
  user: User
): import("@/components/organisms/DataTable/tableColumns").UserRow => ({
  id: user.id.toString(),
  name: user.full_name,
  email: user.email,
  role: user.roles?.[0]?.role_name || "No Role",
  lastLogin: user.last_login_at
    ? new Date(user.last_login_at).toLocaleDateString()
    : "Never",
  status: user.status === "active" ? "Active" : "Inactive",
});
