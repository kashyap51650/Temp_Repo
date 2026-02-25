import type { ApiResponse } from "@/lib/api";

import type { PaginationData } from "./pagination";

export interface ProjectItem {
  id: number;
  project_name: string;
  description: string;
  project_status: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

export type ProjectsListResponse = ApiResponse<{
  items: ProjectItem[];
  pagination: PaginationData;
}>;

export interface ProjectFilters {
  page?: number;
  size?: number;
  search?: string;
  project_status?: string;
}

export type View = "projects" | "experiments" | "study-types" | "study-sheets";
