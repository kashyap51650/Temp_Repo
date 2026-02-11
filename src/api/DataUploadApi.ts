import { validateFile, validatePDFFile } from "@/lib";
import { API_CONFIG, apiClient, type ApiResponse } from "@/lib/api";
import {
  API_CUSTOM_TIMEOUT,
  FILE_SIZE_LIMITS,
  type StudyTypeCode,
} from "@/lib/constants";
import type {
  BloodChemistryPDFPayload,
  BloodChemistryPDFUploadResponse,
  GetBloodChemistryReportResponse,
  SaveBloodChemistryDataResponse,
  SaveBloodChemistryPDFPayload,
} from "@/types/bloodChemistry";
import type {
  ClrfExperimentDataUploadPayload,
  ClrfExperimentDataUploadResponse,
  CreateClrfExperimentPayload,
  CreateClrfExperimentResponse,
} from "@/types/clrfExperiment";
import type {
  ConjugationExperimentDataUploadPayload,
  ConjugationExperimentDataUploadResponse,
  ConjugationGelImageDataUploadPayload,
  ConjugationGelImageDataUploadResponse,
  CreateConjugationExperimentPayload,
  CreateConjugationExperimentResponse,
} from "@/types/conjugationExperiment";
import type {
  CreateDirectBindingAssayExperimentPayload,
  CreateDirectBindingAssayExperimentResponse,
  DirectBindingAssayExperimentDataUploadPayload,
  DirectBindingAssayExperimentDataUploadResponse,
} from "@/types/directBindingAssay";
import type {
  CreateDoseRangeFindingPayload,
  CreateDoseRangeFindingResponse,
} from "@/types/doseRangeFinding";
import type {
  ExperimentListFilters,
  ExperimentsListResponse,
} from "@/types/experiment";
import type {
  GetHematologyReportResponse,
  HematologyPDFPayload,
  HematologyPDFUploadResponse,
  SaveHematologyDataResponse,
  SaveHematologyPDFPayload,
} from "@/types/hematology";
import type {
  CreateIrfExperimentPayload,
  CreateIrfExperimentResponse,
  IrfExperimentDataUploadPayload,
  IrfExperimentDataUploadResponse,
} from "@/types/irfExperiment";
import type {
  CalliperingNotesListParams,
  CalliperingNotesListResponse,
  ConfirmExperimentMouseGroupsPayload,
  ConfirmExperimentMouseGroupsResponse,
  CreateCalliperingNotesCommentPayload,
  CreateCalliperingNotesCommentResponse,
  CreateModelStudyPayload,
  CreateModelStudyResponse,
  ModelStudyExperimentMouseGroupsPayload,
  ModelStudyExperimentMouseGroupsResponse,
} from "@/types/modelStudy";
import type { ProjectFilters, ProjectsListResponse } from "@/types/project";
import type {
  CreateReceptorQuantificationExperimentPayload,
  CreateReceptorQuantificationExperimentResponse,
  ReceptorQuantificationExperimentDataUploadPayload,
  ReceptorQuantificationExperimentDataUploadResponse,
} from "@/types/receptorQuantification";

export interface Project {
  id: number;
  project_name: string;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
}

export interface StudyType {
  id: number;
  study_type_name: string;
  study_type_code: StudyTypeCode;
}

export interface StudyTypesResponse {
  success: boolean;
  message: string;
  data: StudyType[];
}

export interface Isotope {
  id: number;
  isotope_name: string;
}

export interface IsotopesResponse {
  success: boolean;
  message: string;
  data: Isotope[];
}

export interface CellLine {
  id: number;
  cell_line_name: string;
  vendor_name: string;
}

export interface CellLinesResponse {
  success: boolean;
  message: string;
  data: CellLine[];
}

export interface MouseStrain {
  id: number;
  mouse_strain_name: string;
}

export interface MouseStrainsResponse {
  success: boolean;
  message: string;
  data: MouseStrain[];
}

export interface CreateExperimentPayload {
  cell_line_ids: number[];
  experiment_name: string;
  isotope_id: number;
  mouse_strain_ids: number[];
  project_id: number;
  specialization: string;
  study_type_id: number;
}

export type RandomizationStatus = "completed" | "pending";

export interface CreateExperimentResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    experiment_name: string;
    project_id: number;
    specialization: string;
    study_type_id: number;
    isotope_id: number;
    cell_line_ids: number[];
    mouse_strain_ids: number[];
    created_at: string;
    updated_at: string;
    randomization_status: RandomizationStatus;
  };
}

export interface CreateBiodExperimentPayload {
  cell_line_ids: number[];
  experiment_name: string;
  isotope_id: number;
  project_id: number;
  specialization: string;
  study_type_id: number;
}

export type BiodExperimentResponse = ApiResponse<{
  cell_lines: Array<{
    cell_line_name: string;
    id: number;
    vendor_name: string;
  }>;
  created_at: string;
  created_by: number;
  end_date: string;
  experiment_name: string;
  randomization_status: RandomizationStatus;
  fda_tag: boolean;
  id: number;
  isotope: {
    half_life_hours: number;
    id: number;
    isotope_name: string;
  };
  isotope_id: number;
  mouse_strains: Array<{
    mouse_strain_description: string;
    mouse_strain_id: number;
    mouse_strain_name: string;
  }>;
  project: {
    id: number;
    project_name: string;
    project_status: string;
  };
  project_id: number;
  protocol_number: string;
  specialization: string;
  start_date: string;
  status: string;
  study_type: {
    id: number;
    study_type_name: string;
  };
  study_type_id: number;
}>;

export interface ExperimentDropdownItem {
  id: number;
  experiment_name: string;
  randomization_status?: RandomizationStatus;
}

export interface ExperimentsDropdownResponse {
  success: boolean;
  message: string;
  data: ExperimentDropdownItem[];
}

export interface ExperimentFilters {
  project_id: number;
  study_type_id: number;
  specialization: string;
  cell_line_id?: number[];
  mouse_strain_id?: number[];
  status?: string;
}

export type StatusType = "pending" | "approved" | "rejected";

export interface UploadedExperimentDataItem {
  id: number;
  project: {
    id: number;
    project_name: string;
  };
  experiment: {
    id: number;
    experiment_name: string;
  };
  data_type: {
    id: number;
    data_type_name: string;
    data_type_code: string;
  };
  study_type: {
    id: number;
    study_type_name: string;
    study_type_code: string;
  };
  // upload_date to be kept for future use if needed
  upload_date: string;
  created_at: string;
  status: StatusType;
  reviewer: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    full_name: string;
  } | null;
  rejection_reason: string;
  uploaded_data: unknown;
}

export interface UploadedExperimentDataResponse {
  items: UploadedExperimentDataItem[];
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface UploadedExperimentDataFilters {
  page?: number;
  size?: number;
  status?: string;
}

export const projectApi = {
  getProjects: async (): Promise<ProjectsResponse> => {
    return apiClient.get<ProjectsResponse>(
      API_CONFIG.ENDPOINTS.PROJECTS.DROPDOWN
    );
  },

  getProjectsList: async (
    filters?: ProjectFilters
  ): Promise<ProjectsListResponse> => {
    const params = new URLSearchParams();

    if (filters?.page !== undefined) {
      params.append("page", filters.page.toString());
    }
    if (filters?.size !== undefined) {
      params.append("size", filters.size.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.project_status) {
      params.append("project_status", filters.project_status);
    }

    const endpoint = params.toString()
      ? `${API_CONFIG.ENDPOINTS.PROJECTS.LIST}?${params.toString()}`
      : API_CONFIG.ENDPOINTS.PROJECTS.LIST;

    const response = await apiClient.get<ProjectsListResponse>(endpoint);
    return response;
  },

  searchProjects: async (searchTerm: string): Promise<ProjectsResponse> => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("search", searchTerm);
    }

    const endpoint = searchTerm
      ? `${API_CONFIG.ENDPOINTS.PROJECTS.SEARCH}?${params.toString()}`
      : API_CONFIG.ENDPOINTS.PROJECTS.DROPDOWN;

    return apiClient.get<ProjectsResponse>(endpoint);
  },

  createProject: async (projectData: {
    project_name: string;
    description: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: Project;
  }> => {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: Project;
    }>(API_CONFIG.ENDPOINTS.PROJECTS.CREATE, projectData);
  },

  updateProjectStatus: async (
    projectId: number,
    status: string
  ): Promise<ApiResponse> => {
    return apiClient.patch<ApiResponse>(
      API_CONFIG.ENDPOINTS.PROJECTS.STATUS_UPDATE(projectId),
      { project_status: status }
    );
  },
};

export const studyTypeApi = {
  getStudyTypes: async (
    specialisation?: string
  ): Promise<StudyTypesResponse> => {
    const params = new URLSearchParams();
    if (specialisation) {
      params.append("specialization", specialisation.toUpperCase());
    }

    const endpoint = specialisation
      ? `${API_CONFIG.ENDPOINTS.STUDY_TYPES.LIST}?${params.toString()}`
      : API_CONFIG.ENDPOINTS.STUDY_TYPES.LIST;
    return apiClient.get<StudyTypesResponse>(endpoint);
  },
};

export const isotopeApi = {
  getIsotopes: async (): Promise<IsotopesResponse> => {
    return apiClient.get<IsotopesResponse>(API_CONFIG.ENDPOINTS.ISOTOPES.LIST);
  },
};

export const cellLineApi = {
  getCellLines: async (experimentId?: string): Promise<CellLinesResponse> => {
    return apiClient.get<CellLinesResponse>(
      API_CONFIG.ENDPOINTS.CELL_LINES.LIST,
      {
        params: { experiment_id: experimentId },
      }
    );
  },
};

export const mouseStrainApi = {
  getMouseStrains: async (
    experimentId?: string
  ): Promise<MouseStrainsResponse> => {
    return apiClient.get<MouseStrainsResponse>(
      API_CONFIG.ENDPOINTS.MOUSE_STRAINS.LIST,
      {
        params: { experiment_id: experimentId },
      }
    );
  },
};

export const experimentApi = {
  createExperiment: async (
    payload: CreateExperimentPayload
  ): Promise<CreateExperimentResponse> => {
    return apiClient.post<CreateExperimentResponse>(
      API_CONFIG.ENDPOINTS.EXPERIMENTS.CREATE,
      payload
    );
  },

  createBiodExperiment: async (
    payload: CreateBiodExperimentPayload
  ): Promise<BiodExperimentResponse> => {
    return apiClient.post<BiodExperimentResponse>(
      API_CONFIG.ENDPOINTS.BIOD_EXPERIMENTS.CREATE,
      payload
    );
  },

  getExperimentsDropdown: async (
    filters: ExperimentFilters
  ): Promise<ExperimentsDropdownResponse> => {
    const params = new URLSearchParams({
      project_id: filters.project_id.toString(),
      study_type_id: filters.study_type_id.toString(),
      specialization: filters.specialization,
    });

    // Add optional filters only if they are provided
    if (filters.cell_line_id && filters.cell_line_id.length > 0) {
      params.append("cell_line_id", filters.cell_line_id.join(","));
    }

    if (filters.mouse_strain_id && filters.mouse_strain_id.length > 0) {
      params.append("mouse_strain_id", filters.mouse_strain_id.join(","));
    }

    if (filters.status) {
      params.append("status", filters.status);
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.EXPERIMENTS.DROPDOWN}?${params.toString()}`;
    return apiClient.get<ExperimentsDropdownResponse>(endpoint);
  },

  getExperimentsList: async (
    filters?: ExperimentListFilters
  ): Promise<ExperimentsListResponse> => {
    const params = new URLSearchParams();

    if (filters?.project_id !== undefined && filters.project_id !== null) {
      params.append("project_id", filters.project_id.toString());
    }
    if (filters?.page !== undefined) {
      params.append("page", filters.page.toString());
    }
    if (filters?.size !== undefined) {
      params.append("size", filters.size.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    if (filters?.status) {
      params.append("status", filters.status);
    }

    const endpoint = params.toString()
      ? `${API_CONFIG.ENDPOINTS.EXPERIMENTS.LIST}?${params.toString()}`
      : API_CONFIG.ENDPOINTS.EXPERIMENTS.LIST;

    const response = await apiClient.get<ExperimentsListResponse>(endpoint);
    return response;
  },

  updateExperimentStatus: async (
    experimentId: number,
    status: string
  ): Promise<ApiResponse> => {
    return apiClient.patch<ApiResponse>(
      API_CONFIG.ENDPOINTS.EXPERIMENTS.STATUS_UPDATE(experimentId),
      { status }
    );
  },
};

export interface DataType {
  id: number;
  data_type_name: string;
  study_type_id: number;
}

export interface DataTypesResponse {
  success: boolean;
  message: string;
  data: DataType[];
}

export interface DataTypeFilters {
  study_type_id: number;
}

export const dataTypeApi = {
  getDataTypes: async (
    filters: DataTypeFilters
  ): Promise<DataTypesResponse> => {
    const params = new URLSearchParams({
      study_type_id: filters.study_type_id.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.DATA_TYPES.DROPDOWN}?${params.toString()}`;
    return apiClient.get<DataTypesResponse>(endpoint);
  },
};

export interface SampleFileFilters {
  study_type_id: number;
  data_type_id: number;
}

export interface SampleFileResponse {
  success: boolean;
  message: string;
  data: {
    download_url: string;
    expires_in: number;
    file_name: string;
  };
}

export const sampleFileApi = {
  getSampleFileDownload: async (
    filters: SampleFileFilters
  ): Promise<SampleFileResponse> => {
    const params = new URLSearchParams({
      study_type_id: filters.study_type_id.toString(),
      data_type_id: filters.data_type_id.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.SAMPLE_FILES.DOWNLOAD}?${params.toString()}`;
    return apiClient.get<SampleFileResponse>(endpoint);
  },
};

export const uploadedExperimentDataApi = {
  getMyExperimentData: async (
    filters?: UploadedExperimentDataFilters
  ): Promise<UploadedExperimentDataResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.size) params.append("size", filters.size.toString());
    if (filters?.status && filters.status !== "All Status") {
      params.append("status", filters.status.toLowerCase());
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.MY_EXPERIMENT_DATA}?${queryString}`
      : API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.MY_EXPERIMENT_DATA;

    return apiClient.get<UploadedExperimentDataResponse>(endpoint);
  },
};

export interface RandomizationGroup {
  id: number;
  experiment_id: number;
  group_code: string;
  group_name: string;
  group_type: string;
  cell_line_id: number | null;
  cell_dose: number | null;
  strain: string | null;
  is_locked: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface MouseGroup {
  id: number;
  experiment_id: number;
  group_code: string;
  group_name: string;
  group_type: string;
  cell_line_id: number | null;
  mouse_strain_id: number | null; // 👈 Add this property
  cell_dose: number | null;
  strain: string | null;
  is_locked: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

export const mouseGroupApi = {
  getMouseGroupsByExperiment: async (
    experimentId: number
  ): Promise<ApiResponse<MouseGroup[]>> => {
    return await apiClient.get(
      API_CONFIG.ENDPOINTS.MOUSE_GROUPS.MOUSE_GROUPS_BY_EXPERIMENT(experimentId)
    );
  },
  getMouseGroupWithOrganWeights: async (
    experimentId: number
  ): Promise<ApiResponse<MouseGroup[]>> => {
    return await apiClient.get(
      API_CONFIG.ENDPOINTS.MOUSE_GROUPS.MOUSE_GROUPS_WITH_ORGAN_WEIGHTS(
        experimentId
      )
    );
  },
};

export const necropsyApi = {
  downloadOrganSheet: async (payload: {
    experimentId: number;
    groupIds: number[];
  }): Promise<Blob> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.NECROPSY.EXPORT_ORGAN_WEIGHT_SHEET,
      {
        experiment_id: payload.experimentId,
        group_ids: payload.groupIds,
      },
      {
        responseType: "blob",
      }
    );
  },
};

export interface ImportExperimentDataPayload {
  experiment_id: number | null;
  data_type_id: number | null;
  file: File;
}

export interface ImportAGCDataPayload {
  experiment_id: number;
  group_ids: string[];
  file: File;
}

export interface ImportPDFDataPayload {
  experiment_id: number;
  file: File;
}

export type ImportNecropsyDataPayload = ImportPDFDataPayload;
export type ImportNecropsyDataResponse = ApiResponse<{
  filename: string;
  experiment_id: number;
  uploaded_by: number;
}>;

export interface ImportExperimentDataResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const importExperimentDataApi = {
  importExperimentData: async (
    payload: ImportExperimentDataPayload
  ): Promise<ImportExperimentDataResponse> => {
    if (!payload.file) {
      throw new Error("File is required");
    }

    if (payload.experiment_id === null || payload.experiment_id === undefined) {
      throw new Error("Experiment ID is required");
    }

    if (payload.data_type_id === null || payload.data_type_id === undefined) {
      throw new Error("Data Type ID is required");
    }

    const fileName = payload.file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx")) {
      throw new Error("Only .xlsx files are allowed");
    }

    if (payload.file.size > FILE_SIZE_LIMITS.EXCEL_FILE) {
      throw new Error("File size must be less than 10MB");
    }

    if (payload.file.size === 0) {
      throw new Error("File cannot be empty");
    }

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("data_type_id", payload.data_type_id.toString());

    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData<ImportExperimentDataResponse>(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment data import error:", error);
      throw error;
    }
  },

  importAGCExperimentData: async (payload: ImportAGCDataPayload) => {
    if (!payload.file) {
      throw new Error("File is required");
    }

    const fileName = payload.file.name.toLowerCase();

    if (!fileName.endsWith(".xlsx")) {
      throw new Error("Only .xlsx files are allowed");
    }

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("group_ids", payload.group_ids.join(","));
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT_AGC_EXPERIMENT_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment agc data import error:", error);
      throw error;
    }
  },

  importNecropsyData: async (
    payload: ImportNecropsyDataPayload
  ): Promise<ImportNecropsyDataResponse> => {
    validatePDFFile(payload.file);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT_NECROPSY_EXPERIMENT_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment necropsy data import error:", error);
      throw error;
    }
  },

  importHematologyData: async (
    payload: HematologyPDFPayload
  ): Promise<HematologyPDFUploadResponse> => {
    validatePDFFile(payload.file);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.HEMATOLOGY.EXTRACT_HEMATOLOGY,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment hematology data import error:", error);
      throw error;
    }
  },

  importBloodChemistryData: async (
    payload: BloodChemistryPDFPayload
  ): Promise<BloodChemistryPDFUploadResponse> => {
    validatePDFFile(payload.file);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.BLOOD_CHEMISTRY.EXTRACT_BLOOD_CHEMISTRY,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment blood chemistry data import error:", error);
      throw error;
    }
  },

  importClrfExperimentDataApi: async (
    payload: ClrfExperimentDataUploadPayload
  ): Promise<ClrfExperimentDataUploadResponse> => {
    validateFile(payload.file, ["PDF", "DOCX", "JPEG", "JPG", "PNG", "EXCEL"]);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT_CLRF_EXPERIMENT_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment CLRF data import error:", error);
      throw error;
    }
  },

  importDirectBindingAssayExperimentDataApi: async (
    payload: DirectBindingAssayExperimentDataUploadPayload
  ): Promise<DirectBindingAssayExperimentDataUploadResponse> => {
    validateFile(payload.file, ["PDF", "DOCX", "JPEG", "JPG", "PNG", "EXCEL"]);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA
          .IMPORT_DIRECT_BINDING_ASSAY_EXPERIMENT_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error(
        "Experiment Direct binding assay data import error:",
        error
      );
      throw error;
    }
  },

  importConjugationExperimentDataApi: async (
    payload: ConjugationExperimentDataUploadPayload
  ): Promise<ConjugationExperimentDataUploadResponse> => {
    validateFile(payload.file, ["PDF"]);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT_CONJUGATION_EXPERIMENT_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment Conjugation data import error:", error);
      throw error;
    }
  },

  importConjugationGelImageDataApi: async (
    payload: ConjugationGelImageDataUploadPayload
  ): Promise<ConjugationGelImageDataUploadResponse> => {
    validateFile(payload.file, ["JPEG", "JPG", "PNG"]);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT_CONJUGATION_GEL_IMAGE_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment Gel Image data import error:", error);
      throw error;
    }
  },

  importIrfExperimentDataApi: async (
    payload: IrfExperimentDataUploadPayload
  ): Promise<IrfExperimentDataUploadResponse> => {
    validateFile(payload.file, ["PDF", "DOCX", "JPEG", "JPG", "PNG", "EXCEL"]);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT_IRF_EXPERIMENT_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment IRF data import error:", error);
      throw error;
    }
  },

  importReceptorQuantificationExperimentDataApi: async (
    payload: ReceptorQuantificationExperimentDataUploadPayload
  ): Promise<ReceptorQuantificationExperimentDataUploadResponse> => {
    validateFile(payload.file, ["PDF", "DOCX", "JPEG", "JPG", "PNG", "EXCEL"]);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA
          .IMPORT_RECEPTOR_QUANTIFICATION_EXPERIMENT_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error(
        "Experiment Receptor Quantification data import error:",
        error
      );
      throw error;
    }
  },

  saveHematologyData: async (
    payload: SaveHematologyPDFPayload
  ): Promise<ApiResponse<SaveHematologyDataResponse>> => {
    return apiClient.post<ApiResponse<SaveHematologyDataResponse>>(
      API_CONFIG.ENDPOINTS.HEMATOLOGY.SAVE_HEMATOLOGY_REPORT,
      payload
    );
  },

  saveBloodChemistryData: async (
    payload: SaveBloodChemistryPDFPayload
  ): Promise<ApiResponse<SaveBloodChemistryDataResponse>> => {
    return apiClient.post<ApiResponse<SaveBloodChemistryDataResponse>>(
      API_CONFIG.ENDPOINTS.BLOOD_CHEMISTRY.SAVE_BLOOD_CHEMISTRY_REPORT,
      payload
    );
  },
};

export const exportSheetApi = {
  caliperSheet: async (payload: { experimentId: number }): Promise<Blob> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.EXCEL_EXPORT.EXPORT_CALIPER_SHEET,
      {
        experiment_id: payload.experimentId,
      },
      {
        responseType: "blob",
      }
    );
  },

  weightSheet: async (payload: { experimentId: number }): Promise<Blob> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.EXCEL_EXPORT.EXPORT_WEIGHT_SHEET,
      {
        experiment_id: payload.experimentId,
      },
      {
        responseType: "blob",
      }
    );
  },
};

export const cellInjectionCountsApi = {
  getCellInjectionCounts: async (): Promise<
    ApiResponse<{ items: Array<{ id: number; value: string }> }>
  > => {
    return apiClient.get(API_CONFIG.ENDPOINTS.CELL_INJECTION_COUNTS.LIST);
  },
};

export const vehiclesDropdownApi = {
  getVehiclesDropdown: async (): Promise<
    ApiResponse<{
      vehicles: Array<{ id: number; vehicle_name: string }>;
    }>
  > => {
    return apiClient.get(API_CONFIG.ENDPOINTS.VEHICLES.LIST);
  },
};

export const modelStudyExperimentApi = {
  createModelStudyExperiment: async (
    payload: CreateModelStudyPayload
  ): Promise<CreateModelStudyResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.MODEL_STUDY_EXPERIMENTS.CREATE,
      payload
    );
  },

  experimentMouseGroups: async (
    payload: ModelStudyExperimentMouseGroupsPayload
  ): Promise<ModelStudyExperimentMouseGroupsResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.MODEL_STUDY_EXPERIMENTS.MOUSE_GROUPS,
      payload
    );
  },

  confirmMouseGroups: async (
    payload: ConfirmExperimentMouseGroupsPayload
  ): Promise<ConfirmExperimentMouseGroupsResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.MODEL_STUDY_EXPERIMENTS.CONFIRM_MOUSE_GROUPS,
      payload
    );
  },
};

export const calliperingNotesCommentsApi = {
  getNotesComments: async ({
    id,
    params,
  }: {
    id: number;
    params: CalliperingNotesListParams;
  }): Promise<CalliperingNotesListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.desc !== undefined)
      queryParams.append("desc", params.desc.toString());
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());

    const queryString = queryParams.toString();

    const baseEndpoint = `${API_CONFIG.ENDPOINTS.CALLIPER_MEASUREMENT_COMMENTS.LIST}/${id}`;
    const endpoint = queryString
      ? `${baseEndpoint}?${queryString}`
      : baseEndpoint;

    return apiClient.get(endpoint);
  },

  createNoteComment: async (
    payload: CreateCalliperingNotesCommentPayload
  ): Promise<CreateCalliperingNotesCommentResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.CALLIPER_MEASUREMENT_COMMENTS.CREATE,
      payload
    );
  },
};

export const doseRangeFindingExperimentApi = {
  createDoseRangeExperiment: async (
    payload: CreateDoseRangeFindingPayload
  ): Promise<CreateDoseRangeFindingResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.DOSE_RANGE_FINDING_EXPERIMENTS.CREATE,
      payload
    );
  },
};

export const dosesApi = {
  getDosesDropdown: async (): Promise<
    ApiResponse<
      Array<{
        id: number;
        name: string;
      }>
    >
  > => {
    return apiClient.get(API_CONFIG.ENDPOINTS.DOSES.DROPDOWN);
  },
};

export const hematologyApi = {
  getHematologyReportData: async (
    experimentDataId: number
  ): Promise<GetHematologyReportResponse> => {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.HEMATOLOGY.GET_HEMATOLOGY_REPORT(experimentDataId)
    );
  },
};

export const bloodChemistryApi = {
  getBloodChemistryReportData: async (
    experimentDataId: number
  ): Promise<GetBloodChemistryReportResponse> => {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.BLOOD_CHEMISTRY.GET_BLOOD_CHEMISTRY_REPORT(
        experimentDataId
      )
    );
  },
};

export const experimentAntibodiesApi = {
  getExperimentAntibodiesDropdown: async (): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: number;
      antibody_name: string;
      description: string;
    }>;
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.ANTIBODIES.DROPDOWN);
  },
};

export const clrfExperimentApi = {
  createClrfExperiment: async (
    payload: CreateClrfExperimentPayload
  ): Promise<CreateClrfExperimentResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.CLRF_EXPERIMENTS.CREATE,
      payload
    );
  },
};

export const directBindingAssayExperimentApi = {
  createDirectBindingAssayExperiment: async (
    payload: CreateDirectBindingAssayExperimentPayload
  ): Promise<CreateDirectBindingAssayExperimentResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.DIRECT_BINDING_ASSAY_EXPERIMENTS.CREATE,
      payload
    );
  },
};

export const conjugationExperimentApi = {
  createConjugationExperiment: async (
    payload: CreateConjugationExperimentPayload
  ): Promise<CreateConjugationExperimentResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.CONJUGATION_EXPERIMENTS.CREATE,
      payload
    );
  },
};

export const irfExperimentApi = {
  createIrfExperiment: async (
    payload: CreateIrfExperimentPayload
  ): Promise<CreateIrfExperimentResponse> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.IRF.CREATE, payload);
  },
};

export const receptorQuantificationExperimentApi = {
  createReceptorQuantificationExperiment: async (
    payload: CreateReceptorQuantificationExperimentPayload
  ): Promise<CreateReceptorQuantificationExperimentResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.RECEPTOR_QUANTIFICATION.CREATE,
      payload
    );
  },
};
