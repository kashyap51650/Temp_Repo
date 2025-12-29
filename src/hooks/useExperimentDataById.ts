import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import { DEFAULT_RETRY_DELAY, REACT_QUERY_CONFIG } from "@/lib/constants";
import type { ExperimentDataForBioDOrganSheetResponse } from "@/types/organ-sheet";

// Type definitions for the API response
interface Mouse {
  id: number;
  mouse_delivery_id: string;
  mouse_code: string | null;
  experiment_id: number;
}

interface BodyWeightMeasurement {
  id: number;
  mouse: Mouse;
  measurement_date: string;
  body_weight_grams: number;
  baseline_weight_grams: number;
  percent_change: number;
  is_flagged: boolean;
  terminated: boolean;
  treatment_date: string | null;
  treatment_phase: string;
}

interface CellLine {
  id: number;
  cell_line_name: string;
  vendor_name: string;
}

interface Project {
  id: number;
  project_name: string;
}

interface Experiment {
  id: number;
  experiment_name: string;
}

interface DataType {
  id: number;
  data_type_name: string;
  data_type_code: string;
}

interface StudyType {
  id: number;
  study_type_name: string;
  study_type_code: string;
}

interface Reviewer {
  id: number;
  email: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
}

type ExperimentStatus = "approved" | "pending" | "rejected";
type RandomizationStatus = "completed" | "pending";
type TreatmentPhase = "Baseline" | "Treatment" | "Post-Treatment";
export interface ExperimentDataResponse {
  id: number;
  project: Project;
  experiment: Experiment;
  data_type: DataType;
  study_type: StudyType;
  created_at: string;
  measurement_date: string;
  treatment_date: string | null;
  status: string;
  randomization_status: string;
  reviewer: Reviewer | null;
  rejection_reason: string | null;
  uploaded_data: {
    body_weight_measurements: BodyWeightMeasurement[];
    sex: string;
    strain: string;
    date_of_birth: string;
    cell_line: CellLine;
    cell_inj_date: string | null;
    treatment_date: string | null;
    measurement_date: string;
  };
}

export type ExperimentDataForCaliperingResponse = {
  id: number;
  project: Project;
  experiment: Experiment;
  data_type: DataType;
  study_type: StudyType;
  created_at: string;
  measurement_date: string;
  treatment_date: string;
  status: ExperimentStatus;
  randomization_status: RandomizationStatus;
  reviewer: Reviewer;
  rejection_reason: string | null;
  uploaded_data: {
    calliper_measurements: {
      id: number;
      mouse: Mouse;
      measurement_date: string;
      treatment_date: string | null;
      length_mm: number;
      width_mm: number;
      volume_mm3: number;
      is_flagged: boolean;
    }[];
    sex: "Male" | "Female";
    strain: string;
    date_of_birth: string;
    cell_line: CellLine;
    cell_inj_date: string | null;
    treatment_date: string;
    measurement_date: string;
  };
};

export type ExperimentDataForWeightSheetResponse = {
  id: number;
  project: Project;
  experiment: Experiment;
  data_type: DataType;
  study_type: StudyType;
  created_at: string;
  measurement_date: string;
  treatment_date: string;
  status: ExperimentStatus;
  randomization_status: RandomizationStatus;
  reviewer: Reviewer;
  rejection_reason: string | null;
  uploaded_data: {
    body_weight_measurements: {
      id: number;
      mouse: Mouse;
      measurement_date: string;
      body_weight_grams: number;
      baseline_weight_grams: number;
      percent_change: number;
      is_flagged: boolean;
      terminated: boolean;
      treatment_date: string | null;
      treatment_phase: TreatmentPhase;
    }[];
    sex: "Male" | "Female";
    strain: string;
    date_of_birth: string;
    cell_line: CellLine;
    cell_inj_date: string | null;
    treatment_date: string | null;
    measurement_date: string;
  };
};

const fetchExperimentDataForWeightSheet = async (
  experimentDataId: string
): Promise<ExperimentDataForWeightSheetResponse> => {
  const endpoint = `/api/v1/experiment-data/${experimentDataId}/weight-sheet`;
  return apiClient.get<ExperimentDataForWeightSheetResponse>(endpoint);
};

const fetchExperimentDataForCalliperingSheet = async (
  experimentDataId: string
): Promise<ExperimentDataForCaliperingResponse> => {
  const endpoint = `/api/v1/experiment-data/${experimentDataId}/callipering-sheet`;
  return apiClient.get<ExperimentDataForCaliperingResponse>(endpoint);
};

const fetchExperimentDataForBioDOrganSheet = async (
  experimentDataId: string
): Promise<ExperimentDataForBioDOrganSheetResponse> => {
  const endpoint = `/api/v1/experiment-data/${experimentDataId}/necropsy-sheet`;
  const response =
    apiClient.get<ExperimentDataForBioDOrganSheetResponse>(endpoint);
  return response;
};

export function useExperimentDataByIdForWeightSheet(experimentDataId: string) {
  return useQuery({
    queryKey: ["experimentData", "weightSheet", experimentDataId],
    queryFn: () => fetchExperimentDataForWeightSheet(experimentDataId),
    enabled: !!experimentDataId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.LONG,
    retry: REACT_QUERY_CONFIG.RETRY,
    retryDelay: DEFAULT_RETRY_DELAY,
  });
}

export function useExperimentDataByIdForCalliperingSheet(
  experimentDataId: string
) {
  return useQuery({
    queryKey: ["experimentData", "calliperingSheet", experimentDataId],
    queryFn: () => fetchExperimentDataForCalliperingSheet(experimentDataId),
    enabled: !!experimentDataId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.LONG,
    retry: REACT_QUERY_CONFIG.RETRY,
    retryDelay: DEFAULT_RETRY_DELAY,
  });
}

export function useExperimentDataByIdForOrganSheet(experimentDataId: string) {
  return useQuery({
    queryKey: ["experimentData", "organSheet", experimentDataId],
    queryFn: () => fetchExperimentDataForBioDOrganSheet(experimentDataId),
    enabled: !!experimentDataId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.LONG,
    retry: REACT_QUERY_CONFIG.RETRY,
    retryDelay: DEFAULT_RETRY_DELAY,
  });
}
