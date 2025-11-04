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

// Notification Table Data
export type NotificationRow = {
  id: string;
  title: string;
  sentTo: string[];
  sentBy: string;
  date: string;
  type: string[];
  recipients: number;
  status: "Delivered" | "Failed" | "Pending" | string;
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
};

export const templateData: TemplateRow[] = [
  {
    id: "t1",
    name: "System Maintenance Template",
    subject: "Scheduled System Maintenance",
    createdBy: "John Smith",
    createdDate: "2024-01-10",
    usageCount: 8,
  },
  {
    id: "t2",
    name: "Data Upload Reminder",
    subject: "Data Upload Reminder",
    createdBy: "Sarah Johnson",
    createdDate: "2024-01-08",
    usageCount: 15,
  },
  {
    id: "t3",
    name: "Welcome New User",
    subject: "Welcome to Orano Med Research Platform",
    createdBy: "Emily Rodriguez",
    createdDate: "2024-01-05",
    usageCount: 22,
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
  studyType: string;
  uploadedDate: string;
  status: "Pending" | "Validated" | "Error";
};

export const validationData: ValidationRow[] = [
  {
    id: "v1",
    experimentName: "PROT-001-Biodistribution",
    studyType: "Biodistribution_ProtXXX",
    uploadedDate: "2024-01-15",
    status: "Validated",
  },
  {
    id: "v2",
    experimentName: "PROT-002-Biodistribution",
    studyType: "Biodistribution_ProtXXX",
    uploadedDate: "2024-01-14",
    status: "Pending",
  },
  {
    id: "v3",
    experimentName: "PROT-003-Biodistribution",
    studyType: "Biodistribution_ProtXXX",
    uploadedDate: "2024-01-13",
    status: "Error",
  },
  {
    id: "v4",
    experimentName: "PROT-004-DRF",
    studyType: "Dose Range Finding",
    uploadedDate: "2024-01-16",
    status: "Validated",
  },
  {
    id: "v5",
    experimentName: "PROT-005-Toxicity",
    studyType: "Toxicity",
    uploadedDate: "2024-01-17",
    status: "Validated",
  },
  {
    id: "v6",
    experimentName: "PROT-006-ModelStudy",
    studyType: "Model Study",
    uploadedDate: "2024-01-18",
    status: "Validated",
  },
];

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

export const getDataViewItems = (experimentName: string): DataViewItem[] => {
  // Return different data types based on experiment
  if (experimentName.includes("Biodistribution")) {
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
