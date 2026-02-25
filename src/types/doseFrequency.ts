import type { ApiResponse } from "@/lib";

export type CreateDoseFrequencyPayload = {
  frequency_code: string;
  description: string;
};

export type CreateDoseFrequencyResponse = ApiResponse<{
  id: number;
  frequency_code: string;
  description: string;
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
  created_at: string;
  updated_at: string;
}>;

export type DoseFrequencyDropdownResponse = ApiResponse<
  Array<{
    id: number;
    frequency_code: string;
  }>
>;
