import type { ApiResponse } from "@/lib/api";

import type { PaginationData } from "./pagination";

export interface MasterDataItemType {
  id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  updator: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  createdBy: string;
  updatedBy: string;
  [key: string]: unknown;
}

export type MasterDataListResponse = ApiResponse<{
  items: MasterDataItemType[];
  pagination: PaginationData;
}>;

export type CreateMasterDataItemResponse = ApiResponse<MasterDataItemType>;
export type UpdateMasterDataItemResponse = ApiResponse<MasterDataItemType>;
