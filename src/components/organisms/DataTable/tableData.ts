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

const toLowerTrimmed = (value?: string) => value?.toLowerCase().trim() ?? "";

const checkNormalizeDataType = (
  dataType:
    | "weight sheet"
    | "callipering sheet"
    | "necropsy sheet"
    | "agc sheet"
) => {
  const normalizedDataType = toLowerTrimmed(dataType);
  switch (dataType) {
    case "weight sheet":
      return (
        normalizedDataType === "weight sheet" ||
        (normalizedDataType.includes("weight") &&
          normalizedDataType.includes("sheet"))
      );
    case "callipering sheet":
      return (
        normalizedDataType === "callipering sheet" ||
        normalizedDataType === "callipering" ||
        normalizedDataType.includes("calliper")
      );
    case "necropsy sheet":
      return (
        normalizedDataType === "necropsy sheet" ||
        normalizedDataType === "necropsy" ||
        normalizedDataType.includes("necropsy")
      );
    case "agc sheet":
      return (
        normalizedDataType === "agc sheet" ||
        normalizedDataType === "agc" ||
        normalizedDataType.includes("agc")
      );
    default:
      return false;
  }
};

export const getDataViewItems = (
  experimentName: string,
  studyType?: string,
  dataType?: string
): DataViewItem[] => {
  if (dataType) {
    if (checkNormalizeDataType("weight sheet")) {
      return [
        {
          id: "weight-sheet",
          name: "BioD Weight Sheet",
          status: "Validated",
          canView: true,
          canEdit: true,
          canApprove: true,
          canReject: true,
        },
      ];
    }

    if (checkNormalizeDataType("callipering sheet")) {
      return [
        {
          id: "callipering-sheet",
          name: "Callipering Sheet",
          status: "Validated",
          canView: true,
          canEdit: true,
          canApprove: true,
          canReject: true,
        },
      ];
    }

    if (checkNormalizeDataType("necropsy sheet")) {
      return [
        {
          id: "necropsy-sheet",
          name: "Necropsy Sheet",
          status: "Validated",
          canView: true,
          canEdit: true,
          canApprove: true,
          canReject: true,
        },
      ];
    }

    if (checkNormalizeDataType("agc sheet")) {
      return [
        {
          id: "agc-sheet",
          name: "AGC Sheet",
          status: "Validated",
          canView: true,
          canEdit: true,
          canApprove: true,
          canReject: true,
        },
      ];
    }
  }

  const isBiodistribution =
    toLowerTrimmed(experimentName).includes("biodistribution") ||
    toLowerTrimmed(studyType).includes("biodistribution") ||
    toLowerTrimmed(studyType).includes("biod") ||
    toLowerTrimmed(dataType).includes("biodistribution");

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
      {
        id: "dv7",
        name: "BioD Weight Sheet",
        status: "Validated",
        canView: true,
        canEdit: true,
        canApprove: true,
        canReject: true,
      },
    ];
  }

  if (toLowerTrimmed(studyType).includes("toxicity")) {
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
    toLowerTrimmed(studyType).includes("dose") ||
    toLowerTrimmed(studyType).includes("range")
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

  if (toLowerTrimmed(studyType).includes("efficacy")) {
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
      id: "dv1",
      name: "BioD Weight Sheet",
      status: "Validated",
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
  groupedData?: Record<
    string,
    {
      value: string;
      colspan: number;
      startColumn: string;
      endColumn: string;
    }
  >;
}

// Sample data for BioD Organ experiments
// Sample API response data structure
export interface BioDOrganAPIResponse {
  groups: Record<
    string,
    {
      id: number;
      group_code: string;
      group_name: string;
      group_type: string;
      cell_line: {
        id: number;
        cell_line_name: string;
        vendor_name: string;
      };
      experiment_drug: {
        id: number;
        drug_name: string;
      };
      mouse_count: number;
    }
  >;
  organs: Record<
    string,
    {
      id: number;
      organ_name: string;
      description: string | null;
    }
  >;
  mice: Record<
    string,
    {
      id: number;
      mouse_delivery_id: string;
      mouse_code: string;
      experiment_id: number;
    }
  >;
  organ_weights: Record<
    string,
    Record<
      string,
      {
        id: number;
        value: string | number | null;
        type?: string;
      }
    >
  >;
}

// Function to generate BioDOrganData from API response
export const generateBioDOrganData = (
  apiResponse: BioDOrganAPIResponse
): BioDOrganData => {
  const { groups, organs, mice, organ_weights } = apiResponse;

  const mouseList = Object.keys(mice).sort();
  const createGroupedData = (
    getValueForGroup: (groupCode: string) => string
  ) => {
    const groupedData: Record<
      string,
      { value: string; colspan: number; startColumn: string; endColumn: string }
    > = {};
    const regularData: Record<string, string> = {};

    const mouseGroups: Record<string, string[]> = {};
    mouseList.forEach((mouseCode) => {
      const groupCode = mouseCode.charAt(0);
      if (!mouseGroups[groupCode]) mouseGroups[groupCode] = [];
      mouseGroups[groupCode].push(mouseCode);
    });

    Object.entries(mouseGroups).forEach(([groupCode, groupMice]) => {
      if (groupMice.length > 0) {
        groupedData[groupCode] = {
          value: getValueForGroup(groupCode),
          colspan: groupMice.length,
          startColumn: groupMice[0],
          endColumn: groupMice[groupMice.length - 1],
        };
      }
    });

    // Also create regular data for backward compatibility
    mouseList.forEach((mouseCode) => {
      const groupCode = mouseCode.charAt(0);
      regularData[mouseCode] = getValueForGroup(groupCode);
    });

    return { groupedData, regularData };
  };

  // Helper function to format datetime values
  const formatDateTime = (value: string | number | null) => {
    if (!value || typeof value !== "string") return "";
    try {
      const date = new Date(value);
      return (
        date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }) +
        " " +
        date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    } catch {
      return value.toString();
    }
  };

  // Create fixed rows with grouped data
  const longGroupData = createGroupedData((groupCode) => {
    const group = groups[groupCode];
    return group ? group.group_name : "";
  });

  const shortGroupData = createGroupedData((groupCode) => {
    const group = groups[groupCode];
    return group ? group.group_code : "";
  });

  const cellLineData = createGroupedData((groupCode) => {
    const group = groups[groupCode];
    return group ? group.cell_line.cell_line_name : "";
  });

  const drugNameData = createGroupedData((groupCode) => {
    const group = groups[groupCode];
    return group ? group.experiment_drug.drug_name : "";
  });

  const fixedRows: BioDOrganRow[] = [
    {
      id: "longGroupName",
      label: "Long Group Name",
      isRequired: true,
      data: longGroupData.regularData,
      groupedData: longGroupData.groupedData,
    },
    {
      id: "shortGroupName",
      label: "Short Group Name",
      isRequired: true,
      data: shortGroupData.regularData,
      groupedData: shortGroupData.groupedData,
    },
    {
      id: "cellLine",
      label: "Cell line",
      isRequired: true,
      data: cellLineData.regularData,
      groupedData: cellLineData.groupedData,
    },
    {
      id: "drugName",
      label: "Drug Name",
      isRequired: true,
      data: drugNameData.regularData,
      groupedData: drugNameData.groupedData,
    },
  ];

  // Create time-based rows
  const timeRows: BioDOrganRow[] = [
    {
      id: "injection_time",
      label: "212Pb injection time",
      data: mouseList.reduce(
        (acc, mouseCode) => {
          const timeData = organ_weights.injection_time?.[mouseCode];
          acc[mouseCode] = timeData ? formatDateTime(timeData.value) : "";
          return acc;
        },
        {} as Record<string, string>
      ),
    },
    {
      id: "necropsy_time",
      label: "Necropsy time",
      data: mouseList.reduce(
        (acc, mouseCode) => {
          const timeData = organ_weights.necropsy_time?.[mouseCode];
          acc[mouseCode] = timeData ? formatDateTime(timeData.value) : "";
          return acc;
        },
        {} as Record<string, string>
      ),
    },
  ];

  // Create organ rows dynamically
  const organRows: BioDOrganRow[] = Object.keys(organs).map((organKey) => {
    const organ = organs[organKey];
    return {
      id: organKey.toLowerCase().replace(/\s+/g, ""),
      label: organ.organ_name,
      data: mouseList.reduce(
        (acc, mouseCode) => {
          const organData = organ_weights[organKey]?.[mouseCode];
          acc[mouseCode] = organData ? organData.value?.toString() || "" : "";
          return acc;
        },
        {} as Record<string, string>
      ),
    };
  });

  return {
    mouse: mouseList,
    rows: [...fixedRows, ...timeRows, ...organRows],
  };
};

// Sample data combining both provided JSONs
const sampleAPIData: BioDOrganAPIResponse = {
  groups: {
    A: {
      id: 92,
      group_code: "A",
      group_name: "A",
      group_type: "TREATMENT",
      cell_line: {
        id: 1,
        cell_line_name: "BxPC3",
        vendor_name: "BxPC3",
      },
      experiment_drug: {
        id: 4,
        drug_name: "AGC-1",
      },
      mouse_count: 5,
    },
    B: {
      id: 93,
      group_code: "B",
      group_name: "B",
      group_type: "TREATMENT",
      cell_line: {
        id: 1,
        cell_line_name: "BxPC3",
        vendor_name: "BxPC3",
      },
      experiment_drug: {
        id: 4,
        drug_name: "AGC-1",
      },
      mouse_count: 5,
    },
    C: {
      id: 94,
      group_code: "C",
      group_name: "C",
      group_type: "TREATMENT",
      cell_line: {
        id: 1,
        cell_line_name: "BxPC3",
        vendor_name: "BxPC3",
      },
      experiment_drug: {
        id: 4,
        drug_name: "AGC-1",
      },
      mouse_count: 5,
    },
  },
  organs: {
    Kidneys: { id: 7, organ_name: "Kidneys", description: null },
    Liver: { id: 9, organ_name: "Liver", description: null },
    Tail: { id: 16, organ_name: "Tail", description: null },
    "cell line": { id: 17, organ_name: "cell line", description: null },
    Bladder: { id: 1, organ_name: "Bladder", description: null },
    "Reproductive organs": {
      id: 2,
      organ_name: "Reproductive organs",
      description: null,
    },
    "Small intestine": {
      id: 3,
      organ_name: "Small intestine",
      description: null,
    },
    Colon: { id: 4, organ_name: "Colon", description: null },
    Spleen: { id: 5, organ_name: "Spleen", description: null },
    Pancreas: { id: 6, organ_name: "Pancreas", description: null },
    Stomach: { id: 8, organ_name: "Stomach", description: null },
    Lung: { id: 10, organ_name: "Lung", description: null },
    Heart: { id: 11, organ_name: "Heart", description: null },
    Brain: { id: 12, organ_name: "Brain", description: null },
    "Femoral Bone": { id: 13, organ_name: "Femoral Bone", description: null },
    "Abdominal Fat": { id: 14, organ_name: "Abdominal Fat", description: null },
    "Skeletal Muscle": {
      id: 15,
      organ_name: "Skeletal Muscle",
      description: null,
    },
  },
  mice: {
    A1: {
      id: 667,
      mouse_delivery_id: "25-11-106",
      mouse_code: "A1",
      experiment_id: 4,
    },
    A2: {
      id: 686,
      mouse_delivery_id: "25-11-125",
      mouse_code: "A2",
      experiment_id: 4,
    },
    A3: {
      id: 681,
      mouse_delivery_id: "25-11-120",
      mouse_code: "A3",
      experiment_id: 4,
    },
    A4: {
      id: 685,
      mouse_delivery_id: "25-11-124",
      mouse_code: "A4",
      experiment_id: 4,
    },
    A5: {
      id: 673,
      mouse_delivery_id: "25-11-112",
      mouse_code: "A5",
      experiment_id: 4,
    },
    B1: {
      id: 669,
      mouse_delivery_id: "25-11-108",
      mouse_code: "B1",
      experiment_id: 4,
    },
    B2: {
      id: 679,
      mouse_delivery_id: "25-11-118",
      mouse_code: "B2",
      experiment_id: 4,
    },
    B3: {
      id: 663,
      mouse_delivery_id: "25-11-102",
      mouse_code: "B3",
      experiment_id: 4,
    },
    B4: {
      id: 671,
      mouse_delivery_id: "25-11-110",
      mouse_code: "B4",
      experiment_id: 4,
    },
    B5: {
      id: 675,
      mouse_delivery_id: "25-11-114",
      mouse_code: "B5",
      experiment_id: 4,
    },
    C1: {
      id: 683,
      mouse_delivery_id: "25-11-122",
      mouse_code: "C1",
      experiment_id: 4,
    },
    C2: {
      id: 677,
      mouse_delivery_id: "25-11-116",
      mouse_code: "C2",
      experiment_id: 4,
    },
    C3: {
      id: 665,
      mouse_delivery_id: "25-11-104",
      mouse_code: "C3",
      experiment_id: 4,
    },
    C4: {
      id: 668,
      mouse_delivery_id: "25-11-107",
      mouse_code: "C4",
      experiment_id: 4,
    },
    C5: {
      id: 684,
      mouse_delivery_id: "25-11-123",
      mouse_code: "C5",
      experiment_id: 4,
    },
  },
  organ_weights: {
    injection_time: {
      A1: { id: 1026, value: null, type: "datetime" },
      A2: { id: 1030, value: "2025-11-01T10:00:00", type: "datetime" },
      A3: { id: 1034, value: "2025-11-01T11:00:00", type: "datetime" },
      A4: { id: 1038, value: "2025-11-01T11:00:00", type: "datetime" },
      A5: { id: 1042, value: "2025-11-01T10:00:00", type: "datetime" },
      B1: { id: 1046, value: "2025-11-01T10:00:00", type: "datetime" },
      B2: { id: 1063, value: "2025-11-01T10:00:00" },
      B3: { id: 1080, value: "2025-11-01T10:00:00" },
      B4: { id: 1097, value: "2025-11-01T10:00:00" },
      B5: { id: 1114, value: "2025-11-01T10:00:00" },
      C1: { id: 1131, value: "2025-11-01T11:00:00" },
      C2: { id: 1148, value: "2025-11-01T11:00:00" },
      C3: { id: 1165, value: "2025-11-01T11:00:00" },
      C4: { id: 1182, value: "2025-11-01T11:00:00" },
      C5: { id: 1199, value: "2025-11-01T11:00:00" },
    },
    necropsy_time: {
      A1: { id: 1026, value: "2025-11-01T11:00:00", type: "datetime" },
      A2: { id: 1030, value: "2025-11-01T11:00:00", type: "datetime" },
      A3: { id: 1034, value: "2025-11-01T11:00:00", type: "datetime" },
      A4: { id: 1038, value: "2025-11-01T11:00:00", type: "datetime" },
      A5: { id: 1042, value: "2025-11-01T11:00:00", type: "datetime" },
      B1: { id: 1046, value: "2025-11-01T11:00:00" },
      B2: { id: 1063, value: "2025-11-01T11:00:00" },
      B3: { id: 1080, value: "2025-11-01T11:00:00" },
      B4: { id: 1097, value: "2025-11-01T11:00:00" },
      B5: { id: 1114, value: "2025-11-01T11:00:00" },
      C1: { id: 1131, value: "2025-11-01T16:00:00" },
      C2: { id: 1148, value: "2025-11-01T16:00:00" },
      C3: { id: 1165, value: "2025-11-01T16:00:00" },
      C4: { id: 1182, value: "2025-11-01T16:00:00" },
      C5: { id: 1199, value: "2025-11-01T16:00:00" },
    },
    Kidneys: {
      A1: { id: 1026, value: 0.61, type: "float" },
      A2: { id: 1030, value: 0.61, type: "float" },
      A3: { id: 1034, value: 0.61, type: "float" },
      A4: { id: 1038, value: 0.61, type: "float" },
      A5: { id: 1042, value: 0.61, type: "float" },
      B1: { id: 1052, value: 0.61, type: "float" },
      B2: { id: 1069, value: 0.61, type: "float" },
      B3: { id: 1086, value: 0.61, type: "float" },
      B4: { id: 1103, value: 0.61, type: "float" },
      B5: { id: 1120, value: 0.61, type: "float" },
      C1: { id: 1137, value: 0.61, type: "float" },
      C2: { id: 1154, value: 0.61, type: "float" },
      C3: { id: 1171, value: 0.61, type: "float" },
      C4: { id: 1188, value: 0.61, type: "float" },
      C5: { id: 1205, value: 0.61, type: "float" },
    },
    Liver: {
      A1: { id: 1027, value: 0.63, type: "float" },
      A2: { id: 1031, value: 0.63, type: "float" },
      A3: { id: 1035, value: 0.63, type: "float" },
      A4: { id: 1039, value: 0.63, type: "float" },
      A5: { id: 1043, value: 0.63, type: "float" },
      B1: { id: 1054, value: 0.63, type: "float" },
      B2: { id: 1071, value: 0.63, type: "float" },
      B3: { id: 1088, value: 0.63, type: "float" },
      B4: { id: 1105, value: 0.63, type: "float" },
      B5: { id: 1122, value: 0.63, type: "float" },
      C1: { id: 1139, value: 0.63, type: "float" },
      C2: { id: 1156, value: 0.63, type: "float" },
      C3: { id: 1173, value: 0.63, type: "float" },
      C4: { id: 1190, value: 0.63, type: "float" },
      C5: { id: 1207, value: 0.63, type: "float" },
    },
    Tail: {
      A1: { id: 1028, value: 0.7, type: "float" },
      A2: { id: 1032, value: 0.7, type: "float" },
      A3: { id: 1036, value: 0.7, type: "float" },
      A4: { id: 1040, value: 0.7, type: "float" },
      A5: { id: 1044, value: 0.7, type: "float" },
      B1: { id: 1061, value: 0.7, type: "float" },
      B2: { id: 1078, value: 0.7, type: "float" },
      B3: { id: 1095, value: 0.7, type: "float" },
      B4: { id: 1112, value: 0.7, type: "float" },
      B5: { id: 1129, value: 0.7, type: "float" },
      C1: { id: 1146, value: 0.7, type: "float" },
      C2: { id: 1163, value: 0.7, type: "float" },
      C3: { id: 1180, value: 0.7, type: "float" },
      C4: { id: 1197, value: 0.7, type: "float" },
      C5: { id: 1214, value: 0.7, type: "float" },
    },
    "cell line": {
      A1: { id: 1029, value: 0.71, type: "float" },
      A2: { id: 1033, value: 0.71, type: "float" },
      A3: { id: 1037, value: 0.71, type: "float" },
      A4: { id: 1041, value: 0.71, type: "float" },
      A5: { id: 1045, value: 0.71, type: "float" },
      B1: { id: 1062, value: 0.71, type: "float" },
      B2: { id: 1079, value: 0.71, type: "float" },
      B3: { id: 1096, value: 0.71, type: "float" },
      B4: { id: 1113, value: 0.71, type: "float" },
      B5: { id: 1130, value: 0.71, type: "float" },
      C1: { id: 1147, value: 0.71, type: "float" },
      C2: { id: 1164, value: 0.71, type: "float" },
      C3: { id: 1181, value: 0.71, type: "float" },
      C4: { id: 1198, value: 0.71, type: "float" },
      C5: { id: 1215, value: 0.71, type: "float" },
    },
    Bladder: {
      B1: { id: 1046, value: 0.55, type: "float" },
      B2: { id: 1063, value: 0.55, type: "float" },
      B3: { id: 1080, value: 0.55, type: "float" },
      B4: { id: 1097, value: 0.55, type: "float" },
      B5: { id: 1114, value: 0.55, type: "float" },
      C1: { id: 1131, value: 0.55, type: "float" },
      C2: { id: 1148, value: 0.55, type: "float" },
      C3: { id: 1165, value: 0.55, type: "float" },
      C4: { id: 1182, value: 0.55, type: "float" },
      C5: { id: 1199, value: 0.55, type: "float" },
    },
    "Reproductive organs": {
      B1: { id: 1047, value: 0.56, type: "float" },
      B2: { id: 1064, value: 0.56, type: "float" },
      B3: { id: 1081, value: 0.56, type: "float" },
      B4: { id: 1098, value: 0.56, type: "float" },
      B5: { id: 1115, value: 0.56, type: "float" },
      C1: { id: 1132, value: 0.56, type: "float" },
      C2: { id: 1149, value: 0.56, type: "float" },
      C3: { id: 1166, value: 0.56, type: "float" },
      C4: { id: 1183, value: 0.56, type: "float" },
      C5: { id: 1200, value: 0.56, type: "float" },
    },
    "Small intestine": {
      B1: { id: 1048, value: 0.57, type: "float" },
      B2: { id: 1065, value: 0.57, type: "float" },
      B3: { id: 1082, value: 0.57, type: "float" },
      B4: { id: 1099, value: 0.57, type: "float" },
      B5: { id: 1116, value: 0.57, type: "float" },
      C1: { id: 1133, value: 0.57, type: "float" },
      C2: { id: 1150, value: 0.57, type: "float" },
      C3: { id: 1167, value: 0.57, type: "float" },
      C4: { id: 1184, value: 0.57, type: "float" },
      C5: { id: 1201, value: 0.57, type: "float" },
    },
    Colon: {
      B1: { id: 1049, value: 0.58, type: "float" },
      B2: { id: 1066, value: 0.58, type: "float" },
      B3: { id: 1083, value: 0.58, type: "float" },
      B4: { id: 1100, value: 0.58, type: "float" },
      B5: { id: 1117, value: 0.58, type: "float" },
      C1: { id: 1134, value: 0.58, type: "float" },
      C2: { id: 1151, value: 0.58, type: "float" },
      C3: { id: 1168, value: 0.58, type: "float" },
      C4: { id: 1185, value: 0.58, type: "float" },
      C5: { id: 1202, value: 0.58, type: "float" },
    },
    Spleen: {
      B1: { id: 1050, value: 0.59, type: "float" },
      B2: { id: 1067, value: 0.59, type: "float" },
      B3: { id: 1084, value: 0.59, type: "float" },
      B4: { id: 1101, value: 0.59, type: "float" },
      B5: { id: 1118, value: 0.59, type: "float" },
      C1: { id: 1135, value: 0.59, type: "float" },
      C2: { id: 1152, value: 0.59, type: "float" },
      C3: { id: 1169, value: 0.59, type: "float" },
      C4: { id: 1186, value: 0.59, type: "float" },
      C5: { id: 1203, value: 0.59, type: "float" },
    },
    Pancreas: {
      B1: { id: 1051, value: 0.6, type: "float" },
      B2: { id: 1068, value: 0.6, type: "float" },
      B3: { id: 1085, value: 0.6, type: "float" },
      B4: { id: 1102, value: 0.6, type: "float" },
      B5: { id: 1119, value: 0.6, type: "float" },
      C1: { id: 1136, value: 0.6, type: "float" },
      C2: { id: 1153, value: 0.6, type: "float" },
      C3: { id: 1170, value: 0.6, type: "float" },
      C4: { id: 1187, value: 0.6, type: "float" },
      C5: { id: 1204, value: 0.6, type: "float" },
    },
    Stomach: {
      B1: { id: 1053, value: 0.62, type: "float" },
      B2: { id: 1070, value: 0.62, type: "float" },
      B3: { id: 1087, value: 0.62, type: "float" },
      B4: { id: 1104, value: 0.62, type: "float" },
      B5: { id: 1121, value: 0.62, type: "float" },
      C1: { id: 1138, value: 0.62, type: "float" },
      C2: { id: 1155, value: 0.62, type: "float" },
      C3: { id: 1172, value: 0.62, type: "float" },
      C4: { id: 1189, value: 0.62, type: "float" },
      C5: { id: 1206, value: 0.62, type: "float" },
    },
    Lung: {
      B1: { id: 1055, value: 0.64, type: "float" },
      B2: { id: 1072, value: 0.64, type: "float" },
      B3: { id: 1089, value: 0.64, type: "float" },
      B4: { id: 1106, value: 0.64, type: "float" },
      B5: { id: 1123, value: 0.64, type: "float" },
      C1: { id: 1140, value: 0.64, type: "float" },
      C2: { id: 1157, value: 0.64, type: "float" },
      C3: { id: 1174, value: 0.64, type: "float" },
      C4: { id: 1191, value: 0.64, type: "float" },
      C5: { id: 1208, value: 0.64, type: "float" },
    },
    Heart: {
      B1: { id: 1056, value: 0.65, type: "float" },
      B2: { id: 1073, value: 0.65, type: "float" },
      B3: { id: 1090, value: 0.65, type: "float" },
      B4: { id: 1107, value: 0.65, type: "float" },
      B5: { id: 1124, value: 0.65, type: "float" },
      C1: { id: 1141, value: 0.65, type: "float" },
      C2: { id: 1158, value: 0.65, type: "float" },
      C3: { id: 1175, value: 0.65, type: "float" },
      C4: { id: 1192, value: 0.65, type: "float" },
      C5: { id: 1209, value: 0.65, type: "float" },
    },
    Brain: {
      B1: { id: 1057, value: 0.66, type: "float" },
      B2: { id: 1074, value: 0.66, type: "float" },
      B3: { id: 1091, value: 0.66, type: "float" },
      B4: { id: 1108, value: 0.66, type: "float" },
      B5: { id: 1125, value: 0.66, type: "float" },
      C1: { id: 1142, value: 0.66, type: "float" },
      C2: { id: 1159, value: 0.66, type: "float" },
      C3: { id: 1176, value: 0.66, type: "float" },
      C4: { id: 1193, value: 0.66, type: "float" },
      C5: { id: 1210, value: 0.66, type: "float" },
    },
    "Femoral Bone": {
      B1: { id: 1058, value: 0.67, type: "float" },
      B2: { id: 1075, value: 0.67, type: "float" },
      B3: { id: 1092, value: 0.67, type: "float" },
      B4: { id: 1109, value: 0.67, type: "float" },
      B5: { id: 1126, value: 0.67, type: "float" },
      C1: { id: 1143, value: 0.67, type: "float" },
      C2: { id: 1160, value: 0.67, type: "float" },
      C3: { id: 1177, value: 0.67, type: "float" },
      C4: { id: 1194, value: 0.67, type: "float" },
      C5: { id: 1211, value: 0.67, type: "float" },
    },
    "Abdominal Fat": {
      B1: { id: 1059, value: 0.68, type: "float" },
      B2: { id: 1076, value: 0.68, type: "float" },
      B3: { id: 1093, value: 0.68, type: "float" },
      B4: { id: 1110, value: 0.68, type: "float" },
      B5: { id: 1127, value: 0.68, type: "float" },
      C1: { id: 1144, value: 0.68, type: "float" },
      C2: { id: 1161, value: 0.68, type: "float" },
      C3: { id: 1178, value: 0.68, type: "float" },
      C4: { id: 1195, value: 0.68, type: "float" },
      C5: { id: 1212, value: 0.68, type: "float" },
    },
    "Skeletal Muscle": {
      B1: { id: 1060, value: 0.69, type: "float" },
      B2: { id: 1077, value: 0.69, type: "float" },
      B3: { id: 1094, value: 0.69, type: "float" },
      B4: { id: 1111, value: 0.69, type: "float" },
      B5: { id: 1128, value: 0.69, type: "float" },
      C1: { id: 1145, value: 0.69, type: "float" },
      C2: { id: 1162, value: 0.69, type: "float" },
      C3: { id: 1179, value: 0.69, type: "float" },
      C4: { id: 1196, value: 0.69, type: "float" },
      C5: { id: 1213, value: 0.69, type: "float" },
    },
  },
};

// Generate the bioDOrganData from the sample API data
export const bioDOrganData: BioDOrganData =
  generateBioDOrganData(sampleAPIData);

// Example of how the grouped data looks for the Long Group Name row:
// bioDOrganData.rows[0].groupedData = {
//   "A": { value: "A", colspan: 5, startColumn: "A1", endColumn: "A5" },
//   "B": { value: "B", colspan: 5, startColumn: "B1", endColumn: "B5" },
//   "C": { value: "C", colspan: 5, startColumn: "C1", endColumn: "C5" }
// }
//
// When rendering:
// - Check if row.groupedData exists
// - If yes, render merged cells using groupedData (A spans A1-A5, B spans B1-B5, etc.)
// - If no, render individual cells using row.data

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

// BioDWeightSheet Data Types and Data
export interface BioDWeightMouse {
  id: string;
  bodyWeight: number;
  measurementId?: number;
}

export interface BioDWeightData {
  sex: string;
  strain: string;
  dob: string;
  cellInjectionDate: string;
  cellLine: string;
  treatmentDate: string;
  measurementDate: string;
  mice: BioDWeightMouse[];
}

export const biodWeightSheetData: BioDWeightData = {
  sex: "Female",
  strain: "R2G2",
  dob: "2024-01-11",
  cellInjectionDate: "",
  cellLine: "",
  treatmentDate: "",
  measurementDate: "1 Nov 25",
  mice: [
    { id: "MUS01", bodyWeight: 101 },
    { id: "MUS02", bodyWeight: 102 },
    { id: "MUS03", bodyWeight: 103 },
    { id: "MUS04", bodyWeight: 104 },
    { id: "MUS05", bodyWeight: 105 },
    { id: "MUS06", bodyWeight: 106 },
    { id: "MUS07", bodyWeight: 107 },
    { id: "MUS08", bodyWeight: 108 },
    { id: "MUS09", bodyWeight: 109 },
    { id: "MUS10", bodyWeight: 110 },
    { id: "MUS11", bodyWeight: 111 },
    { id: "MUS12", bodyWeight: 112 },
    { id: "MUS13", bodyWeight: 113 },
    { id: "MUS14", bodyWeight: 114 },
    { id: "MUS15", bodyWeight: 115 },
    { id: "MUS16", bodyWeight: 116 },
    { id: "MUS17", bodyWeight: 117 },
    { id: "MUS18", bodyWeight: 118 },
    { id: "MUS19", bodyWeight: 119 },
    { id: "MUS20", bodyWeight: 120 },
    { id: "MUS21", bodyWeight: 121 },
    { id: "MUS22", bodyWeight: 122 },
    { id: "MUS23", bodyWeight: 123 },
    { id: "MUS24", bodyWeight: 124 },
    { id: "MUS25", bodyWeight: 125 },
  ],
};

export interface CalliperingMouseRow {
  id: string;
  length_mm: number;
  width_mm: number;
}

export interface CalliperingData {
  sex?: string;
  strain?: string;
  dob?: string;
  cell_injection_date?: string;
  cell_line?: string;
  treatment_date?: string;
  measurement_date?: string;
  mice?: CalliperingMouseRow[];
}

export const calliperingData: CalliperingData = {
  sex: "Female",
  strain: "R2G2",
  dob: "2024-01-11",
  cell_injection_date: "2024-01-15",
  cell_line: "A549",
  treatment_date: "2024-01-20",
  measurement_date: "2024-01-25",
  mice: [
    { id: "MUS01", length_mm: 12.1, width_mm: 8.2 },
    { id: "MUS02", length_mm: 13.0, width_mm: 8.5 },
    { id: "MUS03", length_mm: 11.8, width_mm: 7.9 },
    { id: "MUS04", length_mm: 12.5, width_mm: 8.1 },
    { id: "MUS05", length_mm: 13.2, width_mm: 8.7 },
    { id: "MUS06", length_mm: 12.7, width_mm: 8.0 },
    { id: "MUS07", length_mm: 12.9, width_mm: 8.3 },
    { id: "MUS08", length_mm: 13.1, width_mm: 8.6 },
    { id: "MUS09", length_mm: 12.3, width_mm: 8.0 },
    { id: "MUS10", length_mm: 12.8, width_mm: 8.4 },
  ],
};
