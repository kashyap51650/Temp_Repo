import { STUDY_TYPE_CODE, type StudyTypeCode } from "@/lib";
import { API_CONFIG, apiClient, type ApiResponse } from "@/lib/api";
import type { PermissionModuleType } from "@/types/auth";
import type { PaginationData } from "@/types/pagination";

export interface ExperimentDataFilters {
  status?: string;
  data_type?: string;
  study_type?: string;
  specialization?: string;
  page?: number;
  size?: number;
  module?: PermissionModuleType;
}

export interface ExperimentDataItem {
  id: number;
  created_at: string;
  measurement_date?: string;
  treatment_date?: string;
  randomization_status: string;
  status: string;
  data_type: {
    id: number;
    data_type_code: string;
    data_type_name: string;
  };
  experiment: {
    id: number;
    experiment_name: string;
    randomization_status?: string;
    specialization: string;
  };
  project: {
    id: number;
    project_name: string;
  };
  study_type: {
    id: number;
    study_type_code: string;
    study_type_name: string;
  };
  reviewer?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    username: string;
  };
}

export type ExperimentDataResponse = ApiResponse<{
  items: ExperimentDataItem[];
  pagination: PaginationData;
}>;

export const experimentDataApi = {
  getExperimentData: async (
    filters?: ExperimentDataFilters
  ): Promise<ExperimentDataResponse> => {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.data_type) params.append("data_type_id", filters.data_type);
    if (filters?.study_type) params.append("study_type_id", filters.study_type);
    if (filters?.specialization)
      params.append("specialization", filters.specialization.toUpperCase());
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.size) params.append("size", filters.size.toString());
    if (filters?.module) {
      params.append("module_perm", filters.module);
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.LIST}?${queryString}`
      : API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.LIST;

    return apiClient.get<ExperimentDataResponse>(endpoint);
  },

  updateTreatmentDate: async (
    experimentDataId: string,
    treatmentDate: string
  ): Promise<ApiResponse> => {
    return apiClient.patch<ApiResponse>(
      API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.UPDATE_TREATMENT_DATE(
        experimentDataId
      ),
      { treatment_date: treatmentDate }
    );
  },
};

export const experimentDrugApi = {
  getExperimentDrugsDropdown: async (): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: number;
      drug_name: string;
      om_number: string;
    }>;
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.EXPERIMENT_DRUGS.DROPDOWN);
  },
};

export interface PerformBioDPayload {
  group_ids: number[];
  source_experiment_id: number;
  target_experiment_id: number;
}

export interface PerformBioDResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const performBioDApi = {
  performBioD: async (
    payload: PerformBioDPayload,
    studyTypeCode: StudyTypeCode
  ): Promise<PerformBioDResponse> => {
    let endpoint: string | null = null;
    if (studyTypeCode === STUDY_TYPE_CODE.MODEL_STUDY) {
      endpoint = API_CONFIG.ENDPOINTS.PERFORM_BIOD.MODEL_STUDY;
    } else if (studyTypeCode === STUDY_TYPE_CODE.EFFICACY) {
      endpoint = API_CONFIG.ENDPOINTS.PERFORM_BIOD.EFFICACY;
    }

    if (!endpoint) {
      throw new Error("Invalid study type code for perform BioD");
    }

    return apiClient.post<PerformBioDResponse>(endpoint, payload);
  },
};

export interface CaliperHistoryMeasurement {
  width_mm: number;
  length_mm: number;
  volume_mm3: number;
}

export interface CaliperHistoryMouseData {
  id: number;
  mouse_code: string;
  delivery_id: string;
}

export interface CaliperHistoryTab {
  tab_id: string;
  tab_label: string;
  metadata: {
    sex: string;
    strain: string;
    date_of_birth: string;
    cell_line: string;
    cell_injection_date: string;
  };
  mouse_data_by_delivery_id: Record<string, CaliperHistoryMouseData>;
  caliper_measurements: Record<
    string,
    Record<string, CaliperHistoryMeasurement>
  >;
  caliper_measurements_dates: string[];
}

export interface CaliperHistoryByMouseResponse {
  success: boolean;
  message: string;
  data: {
    tabs: CaliperHistoryTab[];
  };
}

export interface CaliperHistoryGroupData {
  id: number;
  group_code: string;
  group_name: string;
}

export interface CaliperHistoryGroupTab {
  tab_id: string;
  tab_label: string;
  metadata: {
    sex: string;
    strain: string;
    date_of_birth: string;
    cell_line: string;
    cell_injection_date: string;
  };
  group_data_by_group_id: Record<string, CaliperHistoryGroupData>;
  mouse_data_by_delivery_id: Record<string, CaliperHistoryMouseData>;
  caliper_measurements: Record<
    string,
    Record<string, Record<string, CaliperHistoryMeasurement>>
  >;
  caliper_measurements_dates: string[];
}

export interface CaliperHistoryByGroupResponse {
  success: boolean;
  message: string;
  data: {
    tabs: CaliperHistoryGroupTab[];
  };
}

export const caliperMeasurementsApi = {
  getHistoryByMouse: async (
    experimentId: number
  ): Promise<CaliperHistoryByMouseResponse> => {
    return apiClient.get<CaliperHistoryByMouseResponse>(
      API_CONFIG.ENDPOINTS.CALIPER_MEASUREMENTS.HISTORY_BY_MOUSE(experimentId)
    );
  },

  getHistoryByGroup: async (
    experimentId: number
  ): Promise<CaliperHistoryByGroupResponse> => {
    return apiClient.get<CaliperHistoryByGroupResponse>(
      API_CONFIG.ENDPOINTS.CALIPER_MEASUREMENTS.HISTORY_BY_GROUP(experimentId)
    );
  },
};

export interface ValidateCellLineMouseStrainPayload {
  mouse_strain_id: number;
}

export interface ValidateCellLineMouseStrainResponse {
  success: boolean;
  message: string;
  data: {
    is_valid: boolean;
    cell_line_name: string;
    mouse_strain_name: string;
    message: string;
  };
}

export const cellLineValidationApi = {
  validateMouseStrain: async (
    cellLineId: number,
    payload: ValidateCellLineMouseStrainPayload
  ): Promise<ValidateCellLineMouseStrainResponse> => {
    return apiClient.post<ValidateCellLineMouseStrainResponse>(
      API_CONFIG.ENDPOINTS.CELL_LINE_VALIDATION.VALIDATE_MOUSE_STRAIN(
        cellLineId
      ),
      payload
    );
  },
};
