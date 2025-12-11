import { type ColumnDef } from "@tanstack/react-table";
import {
  Clock,
  Edit,
  Eye,
  KeyIcon,
  MoreHorizontal,
  Share2,
  Shuffle,
  UserCheck,
  UserX,
} from "lucide-react";
import * as React from "react";

import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../atoms";
import { TruncateWithTooltip } from "../../atoms/TruncateWithTooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SortableHeader,
} from "../../molecules";
import { RandomizeDateCell } from "./RandomizeDateCell";
import type {
  NotificationRow,
  PermissionAssignment,
  RoleRow,
  TemplateRow,
  UploadedDatasetRow,
  ValidationRow,
  VisualFilterRow,
} from "./tableData";

export function getRoleColumns(
  onEdit?: (role: RoleRow) => void
): ColumnDef<RoleRow>[] {
  return [
    {
      accessorKey: "name",
      header: () => <span className="w-56 block">Role Name</span>,
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-56 block">
          {row.original.name}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "description",
      header: () => <span className="w-80 block">Description</span>,
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-80 block">
          {row.original.description}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "usersAssigned",
      header: () => <span className="w-40 block">Users Assigned</span>,
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-40 block">
          {row.original.usersAssigned}
        </TruncateWithTooltip>
      ),
    },
    {
      id: "actions",
      header: () => <span className="w-32 block">Actions</span>,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="default"
          className="w-24"
          onClick={onEdit ? () => onEdit(row.original) : undefined}
        >
          Edit
        </Button>
      ),
    },
  ];
}

export function getPermissionColumns(
  onEdit?: (row: PermissionAssignment) => void
) {
  return [
    {
      accessorKey: "user",
      header: () => <span className="w-52 block">User</span>,
      cell: ({ row }: { row: { original: PermissionAssignment } }) => (
        <TruncateWithTooltip className="w-52 block">
          {row.original.user}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "role",
      header: () => <span className="w-52 block">Role</span>,
      cell: ({ row }: { row: { original: PermissionAssignment } }) => (
        <TruncateWithTooltip className="w-52 block">
          {row.original.role}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "permissions",
      header: () => <span className="w-96 block">Permissions</span>,
      cell: ({ row }: { row: { original: PermissionAssignment } }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.permissions.map((perm: string) => (
            <Badge key={perm} variant="secondary" className="px-3 py-1">
              {perm}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <span className="w-32 block">Actions</span>,
      cell: ({ row }: { row: { original: PermissionAssignment } }) => (
        <Button
          variant="outline"
          size="default"
          className="w-24"
          onClick={onEdit ? () => onEdit(row.original) : undefined}
        >
          Edit
        </Button>
      ),
    },
  ];
}

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: "Active" | "Inactive";
};

export type UserActionHandlers = {
  onEdit: (user: UserRow) => void;
  onResetPassword: (user: UserRow) => void;
  onDisable: (user: UserRow) => void;
};

export function getUserColumns(
  handlers: UserActionHandlers
): ColumnDef<UserRow>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="Name" />,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-56">
          {row.original.name}
        </TruncateWithTooltip>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => <SortableHeader column={column} title="Email" />,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-56">
          {row.original.email}
        </TruncateWithTooltip>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: ({ column }) => <SortableHeader column={column} title="Role" />,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-32">
          {row.original.role}
        </TruncateWithTooltip>
      ),
    },
    {
      id: "lastLogin",
      accessorKey: "lastLogin",
      header: ({ column }) => (
        <SortableHeader column={column} title="Last Login" />
      ),
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-32">
          {row.original.lastLogin}
        </TruncateWithTooltip>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "Active" ? "default" : "secondary"}
          className={
            row.original.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-muted text-muted-foreground"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted data-[state=open]:bg-muted"
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
              >
                <span className="sr-only">Open user actions menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(e) => {
                e.preventDefault();
              }}
              side="bottom"
              sideOffset={4}
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onEdit(user);
                }}
              >
                <Edit className="mr-2 size-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onResetPassword(user);
                }}
              >
                <KeyIcon className="mr-2 size-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onDisable(user);
                }}
              >
                {user.status === "Active" ? (
                  <>
                    <UserX className="mr-2 size-4" />
                    Disable Account
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 size-4" />
                    Enable Account
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

// Notification Columns
export function getNotificationColumns(
  onView?: (row: NotificationRow) => void
): ColumnDef<NotificationRow>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableHeader
          column={column}
          className="w-64 justify-start"
          title="Title"
        />
      ),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-64 whitespace-break-spaces wrap-anywhere">
          {row.original.title}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "sentTo",
      header: ({ column }) => (
        <SortableHeader column={column} title="Sent To" />
      ),
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        const sentTo = row.getValue(id) as string[];
        return sentTo.some((role) =>
          role.toLowerCase().includes(value.toLowerCase())
        );
      },
      cell: ({ row }) => (
        <div className="w-48 flex flex-wrap gap-1">
          {row.original.sentTo.map((role, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {role}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "sentBy",
      header: () => <span className="w-36 block">Sent By</span>,
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-36 block">
          {row.original.sentBy}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "date",
      header: () => <span className="w-40 block">Date & Time</span>,
      cell: ({ row }) => (
        <div className="w-40 flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <div>{row.original.date.split(" ")[0]}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.date.split(" ")[1]}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <span className="w-32 block">Type</span>,
      cell: ({ row }) => (
        <div className="w-32 flex flex-wrap gap-1">
          {row.original.type.map((type, index) => (
            <Badge key={index} variant={"secondary"} className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "recipients",
      header: () => <span className="w-24 block">Recipients</span>,
      cell: ({ row }) => (
        <span className="w-24 block">{row.original.recipients}</span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <SortableHeader column={column} title="Status" />,
      enableSorting: true,
      enableColumnFilter: true,
      filterFn: "includesString",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "Delivered" ? "default" : "secondary"
          }
          className={
            row.original.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : "bg-muted text-muted-foreground"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="w-20 block">Actions</span>,
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => onView?.(row.original)}
          >
            <Eye className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}

// Template Columns
export function getTemplateColumns(
  onEdit?: (template: TemplateRow) => void,
  onView?: (template: TemplateRow) => void
): ColumnDef<TemplateRow>[] {
  return [
    {
      accessorKey: "name",
      header: () => <span className="w-48 block">Template Name</span>,
      cell: ({ row }) =>
        (() => {
          const name = row.original.name;
          const isTruncated = name.length > 24;
          return (
            <span className="w-48 block font-medium truncate">
              {isTruncated ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{name}</span>
                  </TooltipTrigger>
                  <TooltipContent>{name}</TooltipContent>
                </Tooltip>
              ) : (
                name
              )}
            </span>
          );
        })(),
    },
    {
      accessorKey: "subject",
      header: () => <span className="w-64 block">Subject</span>,
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-64 block">
          {row.original.subject}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "createdBy",
      header: () => <span className="w-32 block">Created By</span>,
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-32 block">
          {row.original.createdBy}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "createdDate",
      header: () => <span className="w-32 block">Created Date</span>,
      cell: ({ row }) => (
        <span className="w-32 flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          {row.original.createdDate}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: () => <span className="w-20 block">Status</span>,
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? "default" : "secondary"}
          className={
            row.original.isActive
              ? "bg-green-100 text-green-700"
              : "bg-muted text-muted-foreground"
          }
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="w-24 block">Actions</span>,
      cell: ({ row }) => (
        <div className="w-24 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => onView?.(row.original)}
            aria-label="view-template"
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => onEdit?.(row.original)}
            aria-label="edit-template"
          >
            <Edit className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}

export function getUploadedDatasetColumns(): ColumnDef<UploadedDatasetRow>[] {
  return [
    {
      accessorKey: "projectName",
      header: ({ column }) => (
        <SortableHeader column={column} title="Project Name" />
      ),
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-40 block">
          {row.original.projectName}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "experimentName",
      header: ({ column }) => (
        <SortableHeader column={column} title="Experiment Name" />
      ),
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-48 block">
          {row.original.experimentName}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "dataType",
      header: ({ column }) => (
        <SortableHeader column={column} title="Data Type" />
      ),
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-44 block">
          {row.original.dataType}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "uploadDateTime",
      header: ({ column }) => (
        <SortableHeader column={column} title="Upload Date/Time" />
      ),
      cell: ({ row }) => (
        <div className="w-40 flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <span className="text-sm">{row.original.uploadDateTime}</span>
        </div>
      ),
    },
    {
      accessorKey: "currentStatus",
      header: ({ column }) => (
        <SortableHeader column={column} title="Current Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.currentStatus;
        return (
          <div className="w-28">
            <Badge
              variant={
                status === "Approved"
                  ? "default"
                  : status === "Rejected"
                    ? "destructive"
                    : "secondary"
              }
            >
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "reviewer",
      header: ({ column }) => (
        <SortableHeader column={column} title="Reviewer" />
      ),
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-44 block">
          {row.original.reviewer}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "rejectionReason",
      header: ({ column }) => (
        <SortableHeader column={column} title="Rejection Reason" />
      ),
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-64 block text-red-500 ">
          {row.original.rejectionReason}
        </TruncateWithTooltip>
      ),
    },
  ];
}
export function getValidationColumns(
  onViewData?: (row: ValidationRow) => void,
  onRandomize?: (row: ValidationRow) => void
): ColumnDef<ValidationRow>[] {
  return [
    {
      accessorKey: "experimentName",
      header: ({ column }) => (
        <SortableHeader
          className="justify-start w-48"
          column={column}
          title="Experiment Name"
        />
      ),
      cell: ({ row }) => (
        <span className="block truncate w-48">
          {row.original.experimentName}
        </span>
      ),
    },
    {
      accessorKey: "dataType",
      header: ({ column }) => (
        <SortableHeader
          className="w-32 justify-start"
          column={column}
          title="Data Type"
        />
      ),
      cell: ({ row }) => (
        <span className="block w-32 text-muted-foreground">
          {row.original.dataType}
        </span>
      ),
    },
    {
      accessorKey: "studyType",
      header: ({ column }) => (
        <SortableHeader column={column} title="Study Type" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.studyType}</span>
      ),
    },
    {
      accessorKey: "randomisationDate",
      header: () => <span>Randomisation Date</span>,
      cell: ({ row }) => (
        <RandomizeDateCell
          value={row.original.randomisationDate}
          onChange={(date) => {
            row.original.randomisationDate = date;
          }}
        />
      ),
    },
    {
      accessorKey: "uploadedDate",
      header: ({ column }) => (
        <SortableHeader column={column} title="Uploaded Date" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.uploadedDate}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variant =
          status === "Validated"
            ? "success"
            : status === "Error"
              ? "destructive"
              : "secondary";

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewData?.(row.original)}
          >
            <Eye className="size-4" />
            View Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRandomize?.(row.original)}
          >
            <Shuffle className="size-4" />
            Randomize
          </Button>
        </div>
      ),
    },
  ];
}

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

export const getBioDOrganTableColumns = (data: { mouse: string[] }) =>
  createBioDOrganColumns(data.mouse);

export function getVisualFilterColumns(
  onView?: (filter: VisualFilterRow) => void,
  renderShareAction?: (filter: VisualFilterRow) => React.ReactNode
): ColumnDef<VisualFilterRow>[] {
  return [
    {
      accessorKey: "filterName",
      header: ({ column }) => (
        <SortableHeader
          className="w-96 justify-start"
          column={column}
          title="Filter Name"
        />
      ),
      cell: ({ row }) => (
        <div className="font-medium w-96 text-left ">
          {row.original.filterName}
        </div>
      ),
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => (
        <SortableHeader column={column} title="Created Date" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" />
          {row.original.createdDate}
        </div>
      ),
    },
    {
      accessorKey: "createdBy",
      header: ({ column }) => (
        <SortableHeader column={column} title="Created By" />
      ),
      cell: ({ row }) => (
        <div className="text-sm">{row.original.createdBy}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView?.(row.original)}
            aria-label="View filter"
          >
            <Eye className="size-5" />
          </Button>
          {renderShareAction ? (
            renderShareAction(row.original)
          ) : (
            <Button variant="ghost" size="icon" aria-label="Share filter">
              <Share2 className="size-5" />
            </Button>
          )}
        </div>
      ),
    },
  ];
}

// Master Data Column Functions
export function getMasterDataColumns(
  dataType: string,
  onEdit?: (item: any) => void,
  onDelete?: (item: any) => void
): ColumnDef<any>[] {
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return dateString;
    }
  };

  const baseColumns: ColumnDef<any>[] = [];

  // Add specific columns based on data type
  switch (dataType) {
    case "isotope":
      baseColumns.push(
        {
          accessorKey: "isotopeId",
          header: ({ column }) => (
            <SortableHeader column={column} title="Isotope ID" />
          ),
          cell: ({ row }) => (
            <span className="font-medium">{row.original.isotopeId}</span>
          ),
        },
        {
          accessorKey: "isotopeName",
          header: ({ column }) => (
            <SortableHeader column={column} title="Isotope Name" />
          ),
          cell: ({ row }) => <span>{row.original.isotopeName}</span>,
        },
        {
          accessorKey: "halfLifeHours",
          header: ({ column }) => (
            <SortableHeader column={column} title="Half Life (hours)" />
          ),
          cell: ({ row }) => <span>{row.original.halfLifeHours}</span>,
        }
      );
      break;
    case "organ-list":
      baseColumns.push(
        {
          accessorKey: "organId",
          header: ({ column }) => (
            <SortableHeader column={column} title="Organ ID" />
          ),
          cell: ({ row }) => (
            <span className="font-medium">{row.original.organId}</span>
          ),
        },
        {
          accessorKey: "organName",
          header: ({ column }) => (
            <SortableHeader column={column} title="Organ Name" />
          ),
          cell: ({ row }) => <span>{row.original.organName}</span>,
        },
        {
          accessorKey: "description",
          header: ({ column }) => (
            <SortableHeader column={column} title="Description" />
          ),
          cell: ({ row }) => (
            <span className="max-w-xs truncate">
              {row.original.description}
            </span>
          ),
        }
      );
      break;

    case "cell-line":
      baseColumns.push(
        {
          accessorKey: "cellLineId",
          header: ({ column }) => (
            <SortableHeader column={column} title="Cell Line ID" />
          ),
          cell: ({ row }) => (
            <span className="font-medium">{row.original.cellLineId}</span>
          ),
        },
        {
          accessorKey: "cellLineName",
          header: ({ column }) => (
            <SortableHeader column={column} title="Cell Line Name" />
          ),
          cell: ({ row }) => <span>{row.original.cellLineName}</span>,
        },
        {
          accessorKey: "vendorName",
          header: ({ column }) => (
            <SortableHeader column={column} title="Vendor Name" />
          ),
          cell: ({ row }) => <span>{row.original.vendorName}</span>,
        }
      );
      break;

    case "dose-values":
      baseColumns.push(
        {
          accessorKey: "doseId",
          header: ({ column }) => (
            <SortableHeader column={column} title="Dose ID" />
          ),
          cell: ({ row }) => (
            <span className="font-medium">{row.original.doseId}</span>
          ),
        },
        {
          accessorKey: "doseName",
          header: ({ column }) => (
            <SortableHeader column={column} title="Dose Name" />
          ),
          cell: ({ row }) => <span>{row.original.doseName}</span>,
        },
        {
          accessorKey: "doseValue",
          header: ({ column }) => (
            <SortableHeader column={column} title="Dose Value" />
          ),
          cell: ({ row }) => <span>{row.original.doseValue}</span>,
        },
        {
          accessorKey: "unit",
          header: ({ column }) => (
            <SortableHeader column={column} title="Unit" />
          ),
          cell: ({ row }) => <span>{row.original.unit}</span>,
        }
      );
      break;

    case "vehicles":
      baseColumns.push(
        {
          accessorKey: "vehicleId",
          header: ({ column }) => (
            <SortableHeader column={column} title="Vehicle ID" />
          ),
          cell: ({ row }) => (
            <span className="font-medium">{row.original.vehicleId}</span>
          ),
        },
        {
          accessorKey: "vehicleName",
          header: ({ column }) => (
            <SortableHeader column={column} title="Vehicle Name" />
          ),
          cell: ({ row }) => <span>{row.original.vehicleName}</span>,
        },
        {
          accessorKey: "description",
          header: ({ column }) => (
            <SortableHeader column={column} title="Description" />
          ),
          cell: ({ row }) => (
            <span className="max-w-xs truncate">
              {row.original.description}
            </span>
          ),
        }
      );
      break;
  }

  // Add common columns
  baseColumns.push(
    {
      accessorKey: "createdBy",
      header: ({ column }) => (
        <SortableHeader column={column} title="Created By" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.createdBy}
        </span>
      ),
    },
    {
      accessorKey: "updatedBy",
      header: ({ column }) => (
        <SortableHeader column={column} title="Updated By" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.updatedBy}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortableHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <SortableHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDateTime(row.original.updatedAt)}
        </span>
      ),
    }
  );

  // Add actions column
  if (onEdit || onDelete) {
    baseColumns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => onEdit(item)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(item)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <UserX className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
    });
  }

  return baseColumns;
}
