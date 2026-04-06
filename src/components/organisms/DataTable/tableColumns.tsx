import { type ColumnDef } from "@tanstack/react-table";
import {
  Clock,
  Edit,
  Eye,
  KeyIcon,
  MoreHorizontal,
  Shuffle,
  UserCheck,
  UserX,
} from "lucide-react";
import type { Dispatch, FC, SetStateAction } from "react";
import * as React from "react";
import { useEffect, useState } from "react";

import type { UploadedExperimentDataItem } from "@/api";
import { STUDY_TYPE } from "@/lib/constants";
import { formatDateTime } from "@/lib/date-utils";
import { getPerformBioDPermission, PERMISSIONS } from "@/lib/permissions";

import {
  getStatusBadgeClassName,
  getStatusBadgeVariant,
} from "../../../utils/tableUtils";
import {
  Badge,
  Button,
  Input,
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
import { ProtectedComponent } from "../ProtectedRoute";
import { RandomizeDateCell } from "./RandomizeDateCell";
import type {
  NotificationRow,
  PermissionAssignment,
  RoleRow,
  TemplateRow,
  ValidationRow,
  VisualFilterRow,
} from "./tableData";

export function getRoleColumns(
  onEdit?: (role: RoleRow) => void,
  canEditRole: boolean = true
): ColumnDef<RoleRow>[] {
  const columns: ColumnDef<RoleRow>[] = [
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
        <TruncateWithTooltip
          className="w-80 block"
          tooltipContentClassName="max-w-xl"
        >
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
  ];

  if (canEditRole) {
    columns.push({
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
    });
  }

  return columns;
}

export function getPermissionColumns(
  onEdit?: (row: PermissionAssignment) => void,
  showActionColumn: boolean = false
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
      cell: ({ row }: { row: { original: PermissionAssignment } }) => {
        const perms = row.original.permissions;
        const showCount = 3;
        const visible = perms.slice(0, showCount);
        const hidden = perms.slice(showCount);
        return (
          <div className="flex flex-wrap gap-2">
            {visible.map((perm: string) => (
              <Badge key={perm} variant="secondary" className="px-3 py-1">
                {perm}
              </Badge>
            ))}
            {hidden.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 cursor-pointer"
                  >
                    +{hidden.length} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {hidden.map((perm: string) => (
                      <Badge
                        key={perm}
                        variant="secondary"
                        className="px-2 py-0.5 mb-1"
                      >
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    ...(showActionColumn
      ? [
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
        ]
      : []),
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
  handlers: UserActionHandlers,
  canShowActionsColumn: boolean = false
): ColumnDef<UserRow>[] {
  const columns: ColumnDef<UserRow>[] = [
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
  ];

  if (canShowActionsColumn) {
    columns.push({
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
              <ProtectedComponent
                permissions={PERMISSIONS.USER_MANAGEMENT.UPDATE_USER}
                redirectTo={false}
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
              </ProtectedComponent>
              <ProtectedComponent
                permissions={PERMISSIONS.USER_MANAGEMENT.RESET_PASSWORD}
                redirectTo={false}
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handlers.onResetPassword(user);
                  }}
                >
                  <KeyIcon className="mr-2 size-4" />
                  Reset Password
                </DropdownMenuItem>
              </ProtectedComponent>
              <ProtectedComponent
                permissions={PERMISSIONS.USER_MANAGEMENT.CHANGE_STATUS}
                redirectTo={false}
              >
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
              </ProtectedComponent>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  return columns;
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
      cell: ({ row }) => {
        const sentTo = row.original.sentTo;
        const showCount = 3;
        const visible = sentTo.slice(0, showCount);
        const hidden = sentTo.slice(showCount);

        return (
          <div className="w-52 flex flex-wrap gap-1">
            {visible.map((role) => (
              <Badge key={role} variant="outline" className="text-xs">
                {role}
              </Badge>
            ))}
            {hidden.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="text-xs cursor-pointer">
                    +{hidden.length} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="flex flex-wrap flex-col gap-0 max-w-xs">
                    {hidden.map((role) => (
                      <Badge
                        key={`hidden-${role}`}
                        variant="default"
                        className="text-xs text-white/90 mb-1 bg-gray-700/60"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
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
        <div className="w-40 flex items-center gap-1">
          <Clock className="size-4 text-muted-foreground" />
          <div>
            {row.original.date.split(" ")[0]} {row.original.date.split(" ")[1]}
          </div>
          {/* <div className="text-sm text-muted-foreground"></div> */}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: () => <span className="w-32 block">Type</span>,
      cell: ({ row }) => {
        const types = row.original.type;
        const showCount = 3;
        const visible = types.slice(0, showCount);
        const hidden = types.slice(showCount);

        return (
          <div className="w-32 flex flex-wrap gap-1">
            {visible.map((type) => (
              <Badge key={type} variant={"secondary"} className="text-xs">
                {type}
              </Badge>
            ))}
            {hidden.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="text-xs cursor-pointer">
                    +{hidden.length} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {hidden.map((type) => (
                      <Badge
                        key={`hidden-${type}`}
                        variant={"secondary"}
                        className="text-xs mb-1"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
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
      cell: ({ row }) => {
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
      },
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
          <ProtectedComponent
            permissions={PERMISSIONS.NOTIFICATIONS.EDIT_TEMPLATES}
            redirectTo={false}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => onEdit?.(row.original)}
              aria-label="edit-template"
            >
              <Edit className="size-4" />
            </Button>
          </ProtectedComponent>
        </div>
      ),
    },
  ];
}

export function getUploadedDatasetColumns(
  onViewData?: (row: UploadedExperimentDataItem) => void
): ColumnDef<UploadedExperimentDataItem>[] {
  return [
    {
      accessorKey: "project.project_name",
      header: ({ column }) => (
        <SortableHeader column={column} title="Project Name" />
      ),
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-40 block">
          {row.original.project.project_name}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "experiment.experiment_name",
      header: ({ column }) => (
        <SortableHeader column={column} title="Experiment Name" />
      ),
      cell: ({ row }) => (
        <TruncateWithTooltip className="w-48 block">
          {row.original.experiment.experiment_name}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "data_type.data_type_name",
      header: ({ column }) => (
        <SortableHeader column={column} title="Data Type" />
      ),
      cell: ({ row }) => (
        <span className="w-44 block truncate">
          {row.original.data_type.data_type_name}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <SortableHeader column={column} title="Upload Date/Time" />
      ),
      cell: ({ row }) => (
        <div className="w-40 flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" />
          <span className="text-sm">
            {formatDateTime(row.original.created_at)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader column={column} title="Current Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

        return (
          <div className="w-28">
            <Badge
              variant={getStatusBadgeVariant(status)}
              className={getStatusBadgeClassName(status)}
            >
              {displayStatus}
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
        <span className="w-44 block truncate">
          {row.original.reviewer?.full_name || "-"}
        </span>
      ),
    },
    {
      accessorKey: "rejection_reason",
      header: ({ column }) => (
        <SortableHeader column={column} title="Rejection Reason" />
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="w-48 block text-red-500 truncate cursor-pointer">
              {row.original.rejection_reason || "-"}
            </span>
          </TooltipTrigger>
          <TooltipContent align="start" className="max-w-xl">
            {row.original.rejection_reason || "-"}
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewData?.(row.original)}
        >
          <span className="flex items-center gap-2">
            <Eye className="size-4" />
            View Data
          </span>
        </Button>
      ),
    },
  ];
}

export function getValidationColumns(
  onViewData?: (row: ValidationRow) => void,
  onRandomize?: (row: ValidationRow) => void,
  onPerformBioD?: (row: ValidationRow) => void,
  data?: ValidationRow[]
): ColumnDef<ValidationRow>[] {
  const hasCalliperingsheet =
    data?.some((row) => row.dataType.toLowerCase().includes("callipering")) ??
    false;

  // Check if there's any dose range finding weight sheet data
  const hasDoseRangeWeightSheet =
    data?.some(
      (row) =>
        row.studyType === STUDY_TYPE.DOSE_RANGE_FINDING &&
        row.dataType.toLowerCase().includes("weight")
    ) ?? false;

  // Check if there's any toxicity weight sheet data
  const hasToxicityWeightSheet =
    data?.some(
      (row) =>
        row.studyType === STUDY_TYPE.TOXICITY &&
        row.dataType.toLowerCase().includes("weight")
    ) ?? false;

  // Show treatment date column if either condition is met
  const showTreatmentDateColumn =
    hasCalliperingsheet || hasDoseRangeWeightSheet || hasToxicityWeightSheet;

  const columns: ColumnDef<ValidationRow>[] = [
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
        <TruncateWithTooltip className="block truncate w-48">
          {row.original.experimentName}
        </TruncateWithTooltip>
      ),
    },
    {
      accessorKey: "experiment.specialization",
      header: ({ column }) => (
        <SortableHeader column={column} title="Specialization" />
      ),
      cell: ({ row }) => {
        const specialization = row.original.experiment.specialization;

        return <span className="text-muted-foreground">{specialization}</span>;
      },
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
  ];

  if (showTreatmentDateColumn) {
    columns.push({
      accessorKey: "treatmentDate",
      header: () => <span>Treatment Date</span>,
      cell: ({ row }) => {
        const isCalliperingsheet = row.original.dataType
          .toLowerCase()
          .includes("callipering");

        const isWeightSheet = row.original.dataType
          .toLowerCase()
          .includes("weight");

        const isWeightSheetDoseRange =
          row.original.studyType === STUDY_TYPE.DOSE_RANGE_FINDING &&
          isWeightSheet;

        const isWeightSheetToxicity =
          row.original.studyType === STUDY_TYPE.TOXICITY && isWeightSheet;

        if (
          isCalliperingsheet ||
          isWeightSheetDoseRange ||
          isWeightSheetToxicity
        ) {
          return (
            <RandomizeDateCell
              value={row.original.treatmentDate}
              experimentDataId={row.original.id}
              onChange={(date) => {
                row.original.treatmentDate = date;
              }}
            />
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    });
  }

  columns.push(
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

        return (
          <div className="w-28">
            <Badge
              variant={getStatusBadgeVariant(status)}
              className={getStatusBadgeClassName(status)}
            >
              {displayStatus}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const rowData = row.original;
        const isWeightSheet = rowData.dataType.toLowerCase().includes("weight");
        const isCalliperingSheet = rowData.dataType
          .toLowerCase()
          .includes("callipering");

        const isCalliperingSheetBiod =
          isCalliperingSheet &&
          rowData.studyType === STUDY_TYPE.BIO_DISTRIBUTION;
        const isCalliperingSheetModelStudy =
          isCalliperingSheet && rowData.studyType === STUDY_TYPE.MODEL_STUDY;
        const isCalliperingSheetEfficacy =
          isCalliperingSheet && rowData.studyType === STUDY_TYPE.EFFICACY;

        const isWeightSheetDoseRange =
          isWeightSheet && rowData.studyType === STUDY_TYPE.DOSE_RANGE_FINDING;
        const isWeightSheetToxicity =
          isWeightSheet && rowData.studyType === STUDY_TYPE.TOXICITY;

        const performBioDPermission = getPerformBioDPermission(
          rowData.studyType
        );
        const showPerformBiodButton =
          (isCalliperingSheetModelStudy || isCalliperingSheetEfficacy) &&
          performBioDPermission;

        // Show randomize button for both Bio-D callipering and Dose Range weight sheets and Toxicity weight sheets
        const showRandomizeButton =
          isCalliperingSheetBiod ||
          isCalliperingSheetEfficacy ||
          isWeightSheetDoseRange ||
          isWeightSheetToxicity;

        const isRandomizationDisabled =
          (rowData?.treatmentDate &&
            new Date(rowData.treatmentDate) >= new Date()) ||
          rowData.experiment.randomization_status === "completed" ||
          rowData.status !== "approved";

        const isPerformBioDDisabled = rowData.status !== "approved";

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewData?.(rowData)}
            >
              <Eye className="size-4" />
              View Data
            </Button>
            {showRandomizeButton && (
              <ProtectedComponent
                permissions={PERMISSIONS.MOUSE.RANDOMIZATION}
                redirectTo={false}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    isCalliperingSheetEfficacy
                      ? rowData.status !== "approved"
                      : isRandomizationDisabled
                  }
                  onClick={() => onRandomize?.(rowData)}
                  title={
                    (
                      isCalliperingSheetEfficacy
                        ? rowData.status !== "approved"
                        : isRandomizationDisabled
                    )
                      ? "Randomization not allowed for this condition"
                      : ""
                  }
                >
                  <Shuffle className="size-4" />
                  Randomize
                </Button>
              </ProtectedComponent>
            )}
            {showPerformBiodButton && (
              <ProtectedComponent
                permissions={performBioDPermission}
                redirectTo={false}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPerformBioDDisabled}
                  onClick={() => onPerformBioD?.(rowData)}
                  title={
                    isPerformBioDDisabled
                      ? "Perform BioD is only available for approved data"
                      : ""
                  }
                >
                  <Shuffle className="size-4" />
                  Perform BioD
                </Button>
              </ProtectedComponent>
            )}
          </div>
        );
      },
    }
  );

  return columns;
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
          {renderShareAction?.(row.original)}
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

export type MousePairRow = {
  id: string;
  leftId: string;
  leftWeight: number;
  rightId?: string;
  rightWeight?: number;
};

const WeightInput: FC<{
  value: number;
  mouseId: string;
  onValueChange: (mouseId: string, value: number) => void;
}> = React.memo(({ value, mouseId, onValueChange }) => {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    const numValue = Number.parseFloat(localValue);
    const finalValue = Number.isNaN(numValue) || numValue < 0 ? 0 : numValue;

    if (finalValue !== value) {
      onValueChange(mouseId, finalValue);
    }

    setLocalValue(finalValue.toString());
  };

  useEffect(() => {
    const numericLocalValue = Number.parseFloat(localValue);
    if (
      value !== numericLocalValue &&
      !document.activeElement?.closest(`input[value="${localValue}"]`)
    ) {
      setLocalValue(value.toString());
    }
  }, [value]);

  return (
    <Input
      type="number"
      step="0.01"
      min="0"
      max="1000"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="Enter weight"
    />
  );
});

WeightInput.displayName = "WeightInput";

export function getBioDWeightMousePairColumns(
  setFormData: Dispatch<SetStateAction<any>>
): ColumnDef<MousePairRow>[] {
  const handleWeightChange = (mouseId: string, newWeight: number) => {
    setFormData((prev: any) => ({
      ...prev,
      mice: prev.mice.map((m: any) =>
        m.id === mouseId ? { ...m, bodyWeight: newWeight } : m
      ),
    }));
  };

  return [
    {
      accessorKey: "leftId",
      header: () => <span className="block lg:w-72">Mouse Delivery ID</span>,
      cell: ({ row }) => (
        <span className="font-medium text-center">{row.original.leftId}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "leftWeight",
      header: () => <span className="block lg:w-72">Body Weight (g)</span>,
      cell: ({ row, getValue }) => (
        <div className="flex items-stretch h-full min-h-12">
          <div className="border-r border-gray-200 h-auto pr-5 flex items-center w-full">
            <WeightInput
              value={getValue() as number}
              mouseId={row.original.leftId}
              onValueChange={handleWeightChange}
            />
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "rightId",
      header: () => <span className="lg:w-72 block">Mouse Delivery ID</span>,
      cell: ({ row }) =>
        row.original.rightId ? (
          <span className="font-medium text-center">
            {row.original.rightId}
          </span>
        ) : null,
      enableSorting: false,
    },
    {
      accessorKey: "rightWeight",
      header: () => <span className="block lg:w-72">Body Weight (g)</span>,
      cell: ({ row, getValue }) =>
        row.original.rightId ? (
          <WeightInput
            value={getValue() as number}
            mouseId={row.original.rightId}
            onValueChange={handleWeightChange}
          />
        ) : null,
      enableSorting: false,
    },
  ];
}
