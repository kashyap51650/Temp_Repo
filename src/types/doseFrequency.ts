import type { ApiResponse } from "@/lib";

export type CreateDoseFrequencyPayload = {
  frequency_code: string;
  description: string;
  no_of_days: number;
};

export type CreateDoseFrequencyResponse = ApiResponse<{
  id: number;
  frequency_code: string;
  description: string;
  no_of_days: number;
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
