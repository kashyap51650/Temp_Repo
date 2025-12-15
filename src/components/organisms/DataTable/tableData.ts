import type { StatusType } from "@/lib/api";

import type { UserRow } from "./tableColumns";

export const tableData: UserRow[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@oranomed.com",
    role: "Administrator",
    lastLogin: "2024-01-15",
    status: "Active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@oranomed.com",
    role: "Data Uploader",
    lastLogin: "2024-01-14",
    status: "Active",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@oranomed.com",
    role: "Scientist",
    lastLogin: "2024-01-10",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@oranomed.com",
    role: "Scientist",
    lastLogin: "2024-01-12",
    status: "Active",
  },
];

// RBAC Roles Table Data
export type RoleRow = {
  id: string;
  name: string;
  description: string;
  usersAssigned: number;
};

// User Assignments Table Data (Permissions)
export type PermissionAssignment = {
  id: string;
  user: string;
  role: string;
  permissions: string[];
};

export const permissionAssignments: PermissionAssignment[] = [
  {
    id: "1",
    user: "John Smith",
    role: "Administrator",
    permissions: [
      "User Management",
      "Data Upload",
      "Query Builder",
      "View Data",
      "System Settings",
    ],
  },
  {
    id: "2",
    user: "Sarah Johnson",
    role: "Data Uploader",
    permissions: ["Data Upload", "View Data"],
  },
  {
    id: "3",
    user: "Michael Chen",
    role: "Scientist",
    permissions: ["Query Builder", "View Data"],
  },
  {
    id: "4",
    user: "Emily Rodriguez",
    role: "Scientist",
    permissions: ["Query Builder", "View Data"],
  },
];

export const rolesTableData: RoleRow[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access",
    usersAssigned: 3,
  },
  {
    id: "2",
    name: "Data Uploader",
    description: "Can upload and manage datasets",
    usersAssigned: 5,
  },
  {
    id: "3",
    name: "Scientist",
    description: "Can view and query data",
    usersAssigned: 12,
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access",
    usersAssigned: 8,
  },
];

export type NotificationStatus = "Delivered" | "Failed" | "Pending";

// Notification Table Data
export type NotificationRow = {
  id: string;
  title: string;
  sentTo: string[];
  sentBy: string;
  date: string;
  type: string[];
  recipients: number;
  status: NotificationStatus | string;
};

export const notificationData: NotificationRow[] = [
  {
    id: "n1",
    title: "New dataset uploaded: Patient Vitals",
    sentTo: ["Data Uploader", "Scientist"],
    sentBy: "System",
    date: "2025-10-22 09:15",
    type: ["Email"],
    recipients: 12,
    status: "Delivered",
  },
  {
    id: "n2",
    title: "RBAC role changed for John Smith",
    sentTo: ["Administrator"],
    sentBy: "Admin Console",
    date: "2025-10-21 16:40",
    type: ["In-app"],
    recipients: 1,
    status: "Delivered",
  },
  {
    id: "n3",
    title: "Scheduled export failed: storage quota",
    sentTo: ["Administrator"],
    sentBy: "Export Service",
    date: "2025-10-20 02:05",
    type: ["Email", "In-app"],
    recipients: 2,
    status: "Failed",
  },
];

// Template Table Data
export type TemplateRow = {
  id: string;
  name: string;
  subject: string;
  createdBy: string;
  createdDate: string;
  usageCount: number;
  isActive: boolean;
  content: string;
};

export const templateData: TemplateRow[] = [
  {
    id: "t1",
    name: "System Maintenance Template",
    subject: "Scheduled System Maintenance",
    createdBy: "John Smith",
    createdDate: "2024-01-10",
    usageCount: 8,
    isActive: true,
    content: "Content of System Maintenance Template",
  },
  {
    id: "t2",
    name: "Data Upload Reminder",
    subject: "Data Upload Reminder",
    createdBy: "Sarah Johnson",
    createdDate: "2024-01-08",
    usageCount: 15,
    isActive: true,
    content: "Content of Data Upload Reminder",
  },
  {
    id: "t3",
    name: "Welcome New User",
    subject: "Welcome to Orano Med Research Platform",
    createdBy: "Emily Rodriguez",
    createdDate: "2024-01-05",
    usageCount: 22,
    isActive: true,
    content: "Content of Welcome New User",
  },
];

// Uploaded Dataset Table Data
export type UploadedDatasetRow = {
  id: string;
  projectName: string;
  experimentName: string;
  dataType: string;
  uploadDateTime: string;
  currentStatus: "Pending" | "Approved" | "Rejected";
  reviewer: string;
  rejectionReason: string;
};

export const uploadedDatasetData: UploadedDatasetRow[] = [
  {
    id: "ud1",
    projectName: "OM-112_TROP2",
    experimentName: "PROT-001-Biodistribution",
    dataType: "Callipering",
    uploadDateTime: "2024-01-15 10:30:00",
    currentStatus: "Pending",
    reviewer: "-",
    rejectionReason: "-",
  },
  {
    id: "ud2",
    projectName: "OM-113_SORT-1",
    experimentName: "PROT-002-Biodistribution",
    dataType: "Biodistribution_ProtXXX",
    uploadDateTime: "2024-01-14 14:45:00",
    currentStatus: "Approved",
    reviewer: "Dr. Sarah Johnson (Validator)",
    rejectionReason: "-",
  },
  {
    id: "ud3",
    projectName: "OM-116_Molecular Partners",
    experimentName: "PROT-003-DoseRangeFinding",
    dataType: "Weight Sheet",
    uploadDateTime: "2024-01-13 09:15:00",
    currentStatus: "Rejected",
    reviewer: "Dr. Michael Chen (Validator)",
    rejectionReason: "Incomplete data - missing weight measurement...",
  },
  {
    id: "ud4",
    projectName: "OM-112_TROP2",
    experimentName: "PROT-004-Biodistribution",
    dataType: "Cage Cards",
    uploadDateTime: "2024-01-12 16:20:00",
    currentStatus: "Approved",
    reviewer: "Dr. Emily Rodriguez (Validator)",
    rejectionReason: "-",
  },
  {
    id: "ud5",
    projectName: "OM-113_SORT-1",
    experimentName: "PROT-005-DoseRangeFinding",
    dataType: "Hematology",
    uploadDateTime: "2024-01-11 11:30:00",
    currentStatus: "Pending",
    reviewer: "-",
    rejectionReason: "-",
  },
];
// Data Validation Table Data
export type ValidationRow = {
  id: string;
  experimentName: string;
  dataType: string;
  studyType: string;
  uploadedDate: string;
  status: StatusType;
  randomisationDate?: string;
  projectName: string;
  measurementDate?: string;
  treatmentDate?: string;
  randomizationStatus: string;
  reviewer?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
};

// Data View Modal Data (for individual experiment data types)
export type DataViewItem = {
  id: string;
  name: string;
  status: "Pending" | "Validated" | "Error";
  canView: boolean;
  canEdit: boolean;
  canApprove: boolean;
  canReject: boolean;
};

export const getDataViewItems = (
  experimentName: string,
  studyType?: string,
  dataType?: string
): DataViewItem[] => {
  const isBiodistribution =
    experimentName.toLowerCase().includes("biodistribution") ||
    studyType?.toLowerCase().includes("biodistribution") ||
    studyType?.toLowerCase().includes("biod") ||
    dataType?.toLowerCase().includes("biodistribution");

  if (isBiodistribution) {
    return [
      {
        id: "dv1",
        name: "Organ Calculation",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv2",
        name: "BioD Organ",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv3",
        name: "Callipering Data",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv4",
        name: "Randomized Data",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv5",
        name: "Cells & Drugs Data",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv6",
        name: "Cage Cards",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
    ];
  }

  if (studyType?.toLowerCase().includes("toxicity")) {
    return [
      {
        id: "dv1",
        name: "Weight Sheet",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv2",
        name: "Hematology",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv3",
        name: "Blood Chemistry",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv4",
        name: "Necropsy",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
    ];
  }

  if (
    studyType?.toLowerCase().includes("dose") ||
    studyType?.toLowerCase().includes("range")
  ) {
    return [
      {
        id: "dv1",
        name: "Weight Sheet",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv2",
        name: "Hematology",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv3",
        name: "Blood Chemistry",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv4",
        name: "Necropsy",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
    ];
  }

  if (studyType?.toLowerCase().includes("efficacy")) {
    return [
      {
        id: "dv1",
        name: "Weight Sheet",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
      {
        id: "dv2",
        name: "Callipering",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
    ];
  }

  // Default data types for other study types
  return [
    {
      id: "dv1",
      name: "Study Protocol",
      status: "Pending",
      canView: true,
      canEdit: true,
      canApprove: true,
      canReject: true,
    },
    {
      id: "dv2",
      name: "Cage Cards",
      status: "Validated",
      canView: true,
      canEdit: true,
      canApprove: true,
      canReject: true,
    },
  ];
};

// BioD Organ Table Column Definitions
export interface BioDOrganColumn {
  id: string;
  label: string;
  width?: string;
  sticky?: boolean;
}

export const createBioDOrganColumns = (
  mouseColumns: string[]
): BioDOrganColumn[] => [
  {
    id: "label",
    label: "Mouse",
    width: "min-w-48",
    sticky: true,
  },
  ...mouseColumns.map((mouse) => ({
    id: mouse,
    label: mouse,
    width: "min-w-20",
  })),
];

export const getBioDOrganTableColumns = (data: BioDOrganData) =>
  createBioDOrganColumns(data.mouse);

// BioD Organ Data Structure for Experiment Tables
export interface BioDOrganData {
  mouse: string[];
  rows: BioDOrganRow[];
}

export interface BioDOrganRow {
  id: string;
  label: string;
  isRequired?: boolean;
  data: Record<string, string | number>;
}

// Sample data for BioD Organ experiments
export const bioDOrganData: BioDOrganData = {
  mouse: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5"],
  rows: [
    {
      id: "longGroupName",
      label: "Long Group Name",
      isRequired: true,
      data: {
        A1: "A-1H",
        A2: "",
        A3: "",
        A4: "",
        A5: "",
        B1: "B-4H",
        B2: "",
        B3: "",
        B4: "",
        B5: "",
      },
    },
    {
      id: "cellLine",
      label: "Cell line",
      isRequired: true,
      data: {
        A1: "BxPC3",
        A2: "",
        A3: "",
        A4: "",
        A5: "",
        B1: "BxPC3",
        B2: "",
        B3: "",
        B4: "",
        B5: "",
      },
    },
    {
      id: "drugName",
      label: "Drug Name",
      isRequired: true,
      data: {
        A1: "DOTAM-Malemeide",
        A2: "",
        A3: "",
        A4: "",
        A5: "",
        B1: "DOTAM",
        B2: "",
        B3: "",
        B4: "",
        B5: "",
      },
    },
    {
      id: "injection212Pb",
      label: "212Pb injection time",
      data: {},
    },
    {
      id: "necropsyTime",
      label: "Necropsy time",
      data: {},
    },
    {
      id: "blood",
      label: "Blood",
      data: {},
    },
    {
      id: "bladder",
      label: "Bladder",
      data: {},
    },
    {
      id: "reproductiveOrgans",
      label: "Reproductive organs",
      data: {},
    },
    {
      id: "smallIntestine",
      label: "Small intestine",
      data: {},
    },
    {
      id: "colon",
      label: "Colon",
      data: {},
    },
    {
      id: "spleen",
      label: "Spleen",
      data: {},
    },
    {
      id: "pancreas",
      label: "Pancreas",
      data: {},
    },
    {
      id: "kidneys",
      label: "Kidneys",
      data: {},
    },
    {
      id: "stomach",
      label: "Stomach",
      data: {},
    },
    {
      id: "liver",
      label: "Liver",
      data: {},
    },
    {
      id: "lung",
      label: "Lung",
      data: {},
    },
    {
      id: "heart",
      label: "Heart",
      data: {},
    },
    {
      id: "brain",
      label: "Brain",
      data: {},
    },
    {
      id: "femoralBone",
      label: "Femoral Bone",
      data: {},
    },
    {
      id: "abdominalFat",
      label: "Abdominal Fat",
      data: {},
    },
    {
      id: "skeletalMuscle",
      label: "Skeletal Muscle",
      data: {},
    },
    {
      id: "tail",
      label: "Tail",
      data: {},
    },
    {
      id: "cellLine2",
      label: "cell line",
      data: {},
    },
  ],
};

// Visual Data Filter Table Data
export type VisualFilterRow = {
  id: string;
  filterName: string;
  createdDate: string;
  createdBy: string;
  filterType: "Text Box" | "Dropdown" | "Radio Button";
  filterOptions?: string[];
};

export const visualFilterData: VisualFilterRow[] = [
  {
    id: "vf1",
    filterName: "Active Experiments Filter",
    createdDate: "2024-01-10",
    createdBy: "John Smith",
    filterType: "Dropdown",
    filterOptions: ["Active", "Inactive", "Pending"],
  },
  {
    id: "vf2",
    filterName: "Study Type Filter",
    createdDate: "2024-01-08",
    createdBy: "Sarah Johnson",
    filterType: "Radio Button",
    filterOptions: ["Clinical", "Pre-clinical", "Research"],
  },
  {
    id: "vf3",
    filterName: "Search Experiments",
    createdDate: "2024-01-05",
    createdBy: "Michael Chen",
    filterType: "Text Box",
  },
];

// Project Folders Data
export type ProjectRow = {
  id: string;
  name: string;
  status: "Active" | "Inactive" | "Closed";
};

export type ExperimentRow = {
  id: string;
  name: string;
  status: "Approved" | "Pending" | "Rejected" | "Completed" | "Active";
  projectId: string;
};

export type StudyType = {
  id: string;
  name: string;
  color: string;
};

export type StudySheet = {
  id: string;
  name: string;
  studyTypeId: string;
};

export const projectData: ProjectRow[] = [
  {
    id: "p1",
    name: "OM-112_TROP2",
    status: "Active",
  },
  {
    id: "p2",
    name: "OM-113_SORT-1",
    status: "Active",
  },
  {
    id: "p3",
    name: "OM-116_Molecular Partners",
    status: "Active",
  },
];

export const experimentData: ExperimentRow[] = [
  {
    id: "e1",
    name: "EXP001_Biodistribution_MCF-7",
    status: "Approved",
    projectId: "p1",
  },
  {
    id: "e2",
    name: "EXP002_Toxicity_A549",
    status: "Pending",
    projectId: "p1",
  },
  {
    id: "e3",
    name: "EXP003_Efficacy_HeLa",
    status: "Rejected",
    projectId: "p1",
  },
];

export const studyTypes: StudyType[] = [
  {
    id: "biod",
    name: "BioD",
    color: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  },
  {
    id: "dose-range",
    name: "Dose Range Finding",
    color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
  },
  {
    id: "toxicity",
    name: "Toxicity",
    color:
      "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
  },
  {
    id: "efficacy",
    name: "Efficacy",
    color:
      "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
  },
  {
    id: "model-study",
    name: "Model Study",
    color: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200",
  },
];

export const biodSheets: StudySheet[] = [
  {
    id: "biod-organ",
    name: "Organ Sheet",
    studyTypeId: "biod",
  },
  {
    id: "biod-agc",
    name: "AGC Sheet",
    studyTypeId: "biod",
  },
  {
    id: "biod-graph",
    name: "Graph",
    studyTypeId: "biod",
  },
  {
    id: "biod-cage",
    name: "Cage Cards",
    studyTypeId: "biod",
  },
  {
    id: "biod-cells",
    name: "Cells & Drugs Prep",
    studyTypeId: "biod",
  },
];

export const doseRangeSheets: StudySheet[] = [
  {
    id: "dose-weight",
    name: "Weight Sheet",
    studyTypeId: "dose-range",
  },
  {
    id: "dose-hematology",
    name: "Hematology",
    studyTypeId: "dose-range",
  },
  {
    id: "dose-blood",
    name: "Blood Chemistry",
    studyTypeId: "dose-range",
  },
  {
    id: "dose-necropsy",
    name: "Necropsy",
    studyTypeId: "dose-range",
  },
];

export const efficacySheets: StudySheet[] = [
  {
    id: "efficacy-weight",
    name: "Weight Sheet",
    studyTypeId: "efficacy",
  },
  {
    id: "efficacy-callipering",
    name: "Callipering",
    studyTypeId: "efficacy",
  },
];

export const toxicitySheets: StudySheet[] = [
  {
    id: "toxicity-weight",
    name: "Weight Sheet",
    studyTypeId: "toxicity",
  },
  {
    id: "toxicity-hematology",
    name: "Hematology",
    studyTypeId: "toxicity",
  },
  {
    id: "toxicity-blood",
    name: "Blood Chemistry",
    studyTypeId: "toxicity",
  },
  {
    id: "toxicity-necropsy",
    name: "Necropsy",
    studyTypeId: "toxicity",
  },
];

export const modelStudySheets: StudySheet[] = [
  {
    id: "model-weight",
    name: "Weight Sheet",
    studyTypeId: "model-study",
  },
  {
    id: "model-callipering",
    name: "Callipering",
    studyTypeId: "model-study",
  },
];

// Master Data Types
export type MasterDataType =
  | "isotope"
  | "organ-list"
  | "cell-line"
  | "dose-values"
  | "vehicles";

export interface BaseMasterDataEntity {
  id: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Isotope extends BaseMasterDataEntity {
  isotopeId: string;
  isotopeName: string;
  halfLifeHours: number;
}

export interface OrganList extends BaseMasterDataEntity {
  organId: string;
  organName: string;
  description: string;
}

export interface CellLine extends BaseMasterDataEntity {
  cellLineId: string;
  cellLineName: string;
  vendorName: string;
}

export interface DoseValues extends BaseMasterDataEntity {
  doseId: string;
  doseName: string;
  doseValue: number;
  unit: string;
}

export interface Vehicles extends BaseMasterDataEntity {
  vehicleId: string;
  vehicleName: string;
  description: string;
}

export type MasterDataItem =
  | Isotope
  | OrganList
  | CellLine
  | DoseValues
  | Vehicles;

// Master Data Mock Data
export const isotopeData: Isotope[] = [
  {
    id: "1",
    isotopeId: "ISO-001",
    isotopeName: "Iodine-131",
    halfLifeHours: 192,
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-01-15 10:30:00",
  },
  {
    id: "2",
    isotopeId: "ISO-002",
    isotopeName: "Technetium-99m",
    halfLifeHours: 6,
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-16 14:20:00",
    updatedAt: "2024-01-16 14:20:00",
  },
  {
    id: "3",
    isotopeId: "ISO-003",
    isotopeName: "Lutetium-177",
    halfLifeHours: 161,
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-17 09:15:00",
    updatedAt: "2024-01-17 09:15:00",
  },
];

export const organListData: OrganList[] = [
  {
    id: "1",
    organId: "ORG-001",
    organName: "Liver",
    description: "Hepatic tissue analysis",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-01-15 10:30:00",
  },
  {
    id: "2",
    organId: "ORG-002",
    organName: "Kidney",
    description: "Renal tissue analysis",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-16 14:20:00",
    updatedAt: "2024-01-16 14:20:00",
  },
  {
    id: "3",
    organId: "ORG-003",
    organName: "Spleen",
    description: "Splenic tissue analysis",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-17 09:15:00",
    updatedAt: "2024-01-17 09:15:00",
  },
];

export const cellLineData: CellLine[] = [
  {
    id: "1",
    cellLineId: "CL-001",
    cellLineName: "HeLa",
    vendorName: "ATCC",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-01-15 10:30:00",
  },
  {
    id: "2",
    cellLineId: "CL-002",
    cellLineName: "MCF-7",
    vendorName: "Sigma-Aldrich",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-16 14:20:00",
    updatedAt: "2024-01-16 14:20:00",
  },
  {
    id: "3",
    cellLineId: "CL-003",
    cellLineName: "A549",
    vendorName: "ATCC",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-17 09:15:00",
    updatedAt: "2024-01-17 09:15:00",
  },
];

export const doseValuesData: DoseValues[] = [
  {
    id: "1",
    doseId: "DS-001",
    doseName: "Low Dose",
    doseValue: 5.0,
    unit: "mg/kg",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-01-15 10:30:00",
  },
  {
    id: "2",
    doseId: "DS-002",
    doseName: "Medium Dose",
    doseValue: 15.0,
    unit: "mg/kg",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-16 14:20:00",
    updatedAt: "2024-01-16 14:20:00",
  },
  {
    id: "3",
    doseId: "DS-003",
    doseName: "High Dose",
    doseValue: 30.0,
    unit: "mg/kg",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-17 09:15:00",
    updatedAt: "2024-01-17 09:15:00",
  },
  {
    id: "4",
    doseId: "DS-004",
    doseName: "Therapeutic Dose",
    doseValue: 100.0,
    unit: "MBq",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-18 11:45:00",
    updatedAt: "2024-01-18 11:45:00",
  },
  {
    id: "5",
    doseId: "DS-005",
    doseName: "Maintenance Dose",
    doseValue: 2.5,
    unit: "ml/day",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-19 16:30:00",
    updatedAt: "2024-01-19 16:30:00",
  },
];

export const vehiclesData: Vehicles[] = [
  {
    id: "1",
    vehicleId: "VH-001",
    vehicleName: "Saline Solution",
    description: "Sterile saline solution for injection and dilution purposes",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-15 10:30:00",
    updatedAt: "2024-01-15 10:30:00",
  },
  {
    id: "2",
    vehicleId: "VH-002",
    vehicleName: "PBS Buffer",
    description: "Phosphate buffered saline for biological applications",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-16 14:20:00",
    updatedAt: "2024-01-16 14:20:00",
  },
  {
    id: "3",
    vehicleId: "VH-003",
    vehicleName: "DMSO",
    description: "Dimethyl sulfoxide - organic solvent for drug delivery",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-17 09:15:00",
    updatedAt: "2024-01-17 09:15:00",
  },
  {
    id: "4",
    vehicleId: "VH-004",
    vehicleName: "Corn Oil",
    description: "Pharmaceutical grade corn oil for oral administration",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-18 11:45:00",
    updatedAt: "2024-01-18 11:45:00",
  },
  {
    id: "5",
    vehicleId: "VH-005",
    vehicleName: "Cremophor EL",
    description: "Polyoxyl castor oil for solubilizing hydrophobic drugs",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-19 16:30:00",
    updatedAt: "2024-01-19 16:30:00",
  },
  {
    id: "6",
    vehicleId: "VH-006",
    vehicleName: "5% Dextrose",
    description: "Dextrose solution for intravenous drug administration",
    createdBy: "admin@oranomed.com",
    updatedBy: "admin@oranomed.com",
    createdAt: "2024-01-20 13:20:00",
    updatedAt: "2024-01-20 13:20:00",
  },
];

// Master Data Configuration
export interface MasterDataConfig {
  type: MasterDataType;
  label: string;
  tableName: string;
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "number" | "textarea";
    required: boolean;
    placeholder?: string;
  }>;
}

export const MASTER_DATA_CONFIGS: Record<MasterDataType, MasterDataConfig> = {
  isotope: {
    type: "isotope",
    label: "Isotope",
    tableName: "isotopes",
    fields: [
      {
        key: "isotopeId",
        label: "Isotope ID",
        type: "text",
        required: true,
        placeholder: "e.g., ISO-001",
      },
      {
        key: "isotopeName",
        label: "Isotope Name",
        type: "text",
        required: true,
        placeholder: "Enter isotope name",
      },
      {
        key: "halfLifeHours",
        label: "Half Life (hours)",
        type: "number",
        required: true,
        placeholder: "Enter half life in hours",
      },
    ],
  },
  "organ-list": {
    type: "organ-list",
    label: "Organ List",
    tableName: "organs",
    fields: [
      {
        key: "organId",
        label: "Organ ID",
        type: "text",
        required: true,
        placeholder: "e.g., ORG-001",
      },
      {
        key: "organName",
        label: "Organ Name",
        type: "text",
        required: true,
        placeholder: "Enter organ name",
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Enter description",
      },
    ],
  },
  "cell-line": {
    type: "cell-line",
    label: "Cell Line",
    tableName: "cell_lines",
    fields: [
      {
        key: "cellLineId",
        label: "Cell Line ID",
        type: "text",
        required: true,
        placeholder: "e.g., CL-001",
      },
      {
        key: "cellLineName",
        label: "Cell Line Name",
        type: "text",
        required: true,
        placeholder: "Enter cell line name",
      },
      {
        key: "vendorName",
        label: "Vendor Name",
        type: "text",
        required: true,
        placeholder: "Enter vendor name",
      },
    ],
  },
  "dose-values": {
    type: "dose-values",
    label: "Dose Values",
    tableName: "dose_values",
    fields: [
      {
        key: "doseId",
        label: "Dose ID",
        type: "text",
        required: true,
        placeholder: "e.g., DS-001",
      },
      {
        key: "doseName",
        label: "Dose Name",
        type: "text",
        required: true,
        placeholder: "Enter dose name",
      },
      {
        key: "doseValue",
        label: "Dose Value",
        type: "number",
        required: true,
        placeholder: "Enter dose value",
      },
      {
        key: "unit",
        label: "Unit",
        type: "text",
        required: true,
        placeholder: "e.g., mg, ml, etc.",
      },
    ],
  },
  vehicles: {
    type: "vehicles",
    label: "Vehicles",
    tableName: "vehicles",
    fields: [
      {
        key: "vehicleId",
        label: "Vehicle ID",
        type: "text",
        required: true,
        placeholder: "e.g., VH-001",
      },
      {
        key: "vehicleName",
        label: "Vehicle Name",
        type: "text",
        required: true,
        placeholder: "Enter vehicle name",
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Enter description",
      },
    ],
  },
};

export const MASTER_DATA_OPTIONS = Object.values(MASTER_DATA_CONFIGS).map(
  (config) => ({
    value: config.type,
    label: config.label,
  })
);

// --- Randomization Results Table Data ---
export type Group = {
  key: string;
  label: string;
  options: string[];
  data: Array<
    { [key: string]: string | number } & { mouse: string; tumorVol: number }
  >;
};

export const DEFAULT_GROUPS: Group[] = [
  {
    key: "A",
    label: "Group A",
    options: ["MAM279", "MAM280", "MAM281", "MAM282"],
    data: [
      { mouse: "24-01-61", tumorVol: 492.8 },
      { mouse: "24-01-71", tumorVol: 333.4 },
      { mouse: "24-01-65", tumorVol: 325.3 },
      { mouse: "24-01-77", tumorVol: 299.4 },
      { mouse: "24-01-78", tumorVol: 269.2 },
    ],
  },
  {
    key: "B",
    label: "Group B",
    options: ["MAM282", "MAM283", "MAM284", "MAM285", "MAM286", "MAM287"],
    data: [
      { mouse: "24-01-74", tumorVol: 540.9 },
      { mouse: "24-01-79", tumorVol: 334.6 },
      { mouse: "24-01-63", tumorVol: 323.6 },
      { mouse: "24-01-63", tumorVol: 304.2 },
      { mouse: "24-01-70", tumorVol: 241.9 },
    ],
  },
  {
    key: "C",
    label: "Group C",
    options: ["MAM282", "MAM283", "MAM284", "MAM285", "MAM286", "MAM287"],
    data: [
      { mouse: "24-01-72", tumorVol: 522.7 },
      { mouse: "24-01-67", tumorVol: 342.1 },
      { mouse: "24-01-75", tumorVol: 307.7 },
      { mouse: "24-01-80", tumorVol: 307.7 },
      { mouse: "24-01-66", tumorVol: 237.7 },
    ],
  },
  {
    key: "D",
    label: "Group D",
    options: ["MAM288", "MAM289", "MAM290", "MAM291"],
    data: [
      { mouse: "24-01-81", tumorVol: 445.2 },
      { mouse: "24-01-82", tumorVol: 378.9 },
      { mouse: "24-01-83", tumorVol: 412.6 },
      { mouse: "24-01-84", tumorVol: 356.1 },
      { mouse: "24-01-85", tumorVol: 389.8 },
    ],
  },
  {
    key: "E",
    label: "Group E",
    options: ["MAM292", "MAM293", "MAM294", "MAM295"],
    data: [
      { mouse: "24-01-86", tumorVol: 467.3 },
      { mouse: "24-01-87", tumorVol: 398.5 },
      { mouse: "24-01-88", tumorVol: 423.7 },
      { mouse: "24-01-89", tumorVol: 381.9 },
      { mouse: "24-01-90", tumorVol: 356.2 },
    ],
  },
  {
    key: "F",
    label: "Group F",
    options: ["MAM296", "MAM297", "MAM298", "MAM299"],
    data: [
      { mouse: "24-01-91", tumorVol: 512.8 },
      { mouse: "24-01-92", tumorVol: 434.6 },
      { mouse: "24-01-93", tumorVol: 398.1 },
      { mouse: "24-01-94", tumorVol: 456.7 },
      { mouse: "24-01-95", tumorVol: 387.3 },
    ],
  },
  {
    key: "G",
    label: "Group G",
    options: ["MAM300", "MAM301", "MAM302", "MAM303"],
    data: [
      { mouse: "24-01-96", tumorVol: 378.2 },
      { mouse: "24-01-97", tumorVol: 445.9 },
      { mouse: "24-01-98", tumorVol: 367.4 },
      { mouse: "24-01-99", tumorVol: 412.8 },
      { mouse: "24-01-100", tumorVol: 394.5 },
    ],
  },
  {
    key: "H",
    label: "Group H",
    options: ["MAM304", "MAM305", "MAM306", "MAM307"],
    data: [
      { mouse: "24-01-101", tumorVol: 489.7 },
      { mouse: "24-01-102", tumorVol: 356.8 },
      { mouse: "24-01-103", tumorVol: 423.1 },
      { mouse: "24-01-104", tumorVol: 378.6 },
      { mouse: "24-01-105", tumorVol: 445.2 },
    ],
  },
  {
    key: "I",
    label: "Group I",
    options: ["MAM308", "MAM309", "MAM310", "MAM311"],
    data: [
      { mouse: "24-01-106", tumorVol: 367.9 },
      { mouse: "24-01-107", tumorVol: 498.3 },
      { mouse: "24-01-108", tumorVol: 412.7 },
      { mouse: "24-01-109", tumorVol: 334.5 },
      { mouse: "24-01-110", tumorVol: 456.1 },
    ],
  },
  {
    key: "J",
    label: "Group J",
    options: ["MAM312", "MAM313", "MAM314", "MAM315"],
    data: [
      { mouse: "24-01-111", tumorVol: 423.8 },
      { mouse: "24-01-112", tumorVol: 389.4 },
      { mouse: "24-01-113", tumorVol: 467.2 },
      { mouse: "24-01-114", tumorVol: 378.9 },
      { mouse: "24-01-115", tumorVol: 401.6 },
    ],
  },
];
