import { type ColumnDef } from "@tanstack/react-table";
import { Clock, Edit, Eye, KeyIcon, MoreHorizontal, UserX } from "lucide-react";

import { Badge, Button } from "../../atoms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SortableHeader,
} from "../../molecules";
import type {
  NotificationRow,
  PermissionAssignment,
  RoleRow,
  TemplateRow,
  UploadedDatasetRow,
} from "./tableData";

export function getRoleColumns(
  onEdit?: (role: RoleRow) => void
): ColumnDef<RoleRow>[] {
  return [
    {
      accessorKey: "name",
      header: () => <span className="w-56 block">Role Name</span>,
      cell: ({ row }) => (
        <span className="w-56 block">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: () => <span className="w-80 block">Description</span>,
      cell: ({ row }) => (
        <span className="w-80 block">{row.original.description}</span>
      ),
    },
    {
      accessorKey: "usersAssigned",
      header: () => <span className="w-40 block">Users Assigned</span>,
      cell: ({ row }) => (
        <span className="w-40 block">{row.original.usersAssigned}</span>
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
      cell: ({ row }: any) => (
        <span className="w-52 block">{row.original.user}</span>
      ),
    },
    {
      accessorKey: "role",
      header: () => <span className="w-52 block">Role</span>,
      cell: ({ row }: any) => (
        <span className="w-52 block">{row.original.role}</span>
      ),
    },
    {
      accessorKey: "permissions",
      header: () => <span className="w-96 block">Permissions</span>,
      cell: ({ row }: any) => (
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
      cell: ({ row }: any) => (
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
      cell: ({ row }) => <div className="w-56">{row.original.name}</div>,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => <SortableHeader column={column} title="Email" />,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => <div className="w-56">{row.original.email}</div>,
    },
    {
      id: "role",
      accessorKey: "role",
      header: ({ column }) => <SortableHeader column={column} title="Role" />,
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => <div className="w-32">{row.original.role}</div>,
    },
    {
      id: "lastLogin",
      accessorKey: "lastLogin",
      header: ({ column }) => (
        <SortableHeader column={column} title="Last Login" />
      ),
      enableSorting: true,
      sortingFn: "alphanumeric",
      cell: ({ row }) => <div className="w-32">{row.original.lastLogin}</div>,
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
                <MoreHorizontal className="h-4 w-4" />
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
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onResetPassword(user);
                }}
              >
                <KeyIcon className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handlers.onDisable(user);
                }}
              >
                <UserX className="mr-2 h-4 w-4" />
                Disable Account
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
        <span className="w-64  whitespace-break-spaces  wrap-anywhere">
          {row.original.title}
        </span>
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
        <span className="w-36 block">{row.original.sentBy}</span>
      ),
    },
    {
      accessorKey: "date",
      header: () => <span className="w-40 block">Date</span>,
      cell: ({ row }) => (
        <div className="w-40 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
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
            <Badge
              key={index}
              variant={type === "Email" ? "default" : "secondary"}
              className="text-xs"
            >
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
            <Eye className="h-4 w-4" />
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
      cell: ({ row }) => (
        <span className="w-48 block font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "subject",
      header: () => <span className="w-64 block">Subject</span>,
      cell: ({ row }) => (
        <span className="w-64 block">{row.original.subject}</span>
      ),
    },
    {
      accessorKey: "createdBy",
      header: () => <span className="w-32 block">Created By</span>,
      cell: ({ row }) => (
        <span className="w-32 block">{row.original.createdBy}</span>
      ),
    },
    {
      accessorKey: "createdDate",
      header: () => <span className="w-32 block">Created Date</span>,
      cell: ({ row }) => (
        <span className="w-32 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {row.original.createdDate}
        </span>
      ),
    },
    {
      accessorKey: "usageCount",
      header: () => <span className="w-24 block">Usage Count</span>,
      cell: ({ row }) => (
        <span className="w-24 block">{row.original.usageCount}</span>
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
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => onEdit?.(row.original)}
            aria-label="edit-template"
          >
            <Edit className="h-4 w-4" />
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
        <span className="w-40 block">{row.original.projectName}</span>
      ),
    },
    {
      accessorKey: "experimentName",
      header: ({ column }) => (
        <SortableHeader column={column} title="Experiment Name" />
      ),
      cell: ({ row }) => (
        <span className="w-48 block">{row.original.experimentName}</span>
      ),
    },
    {
      accessorKey: "dataType",
      header: ({ column }) => (
        <SortableHeader column={column} title="Data Type" />
      ),
      cell: ({ row }) => (
        <span className="w-44 block">{row.original.dataType}</span>
      ),
    },
    {
      accessorKey: "uploadDateTime",
      header: ({ column }) => (
        <SortableHeader column={column} title="Upload Date/Time" />
      ),
      cell: ({ row }) => (
        <div className="w-40 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
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
        <span className="w-44 block">{row.original.reviewer}</span>
      ),
    },
    {
      accessorKey: "rejectionReason",
      header: ({ column }) => (
        <SortableHeader column={column} title="Rejection Reason" />
      ),
      cell: ({ row }) => (
        <span className="w-64 block text-red-500 truncate">
          {row.original.rejectionReason}
        </span>
      ),
    },
  ];
}
