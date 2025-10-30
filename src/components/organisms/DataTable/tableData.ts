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
