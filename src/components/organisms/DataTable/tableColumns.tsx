import { type ColumnDef } from "@tanstack/react-table";
import { Edit, KeyIcon, MoreHorizontal, UserX } from "lucide-react";

import { Badge, Button } from "../../atoms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../molecules";
import SortableHeader from "./SortableHeader";
import type { PermissionAssignment, RoleRow } from "./tableData";

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
      accessorKey: "name",
      header: ({ column }) => <SortableHeader title={"Name"} column={column} />,
      enableSorting: true,
      cell: ({ row }) => <div className="w-56">{row.original.name}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <SortableHeader title={"Email"} column={column} />
      ),
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
    },
    {
      accessorKey: "status",
      header: "Status",
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
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlers.onEdit(user)}>
                <Edit /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlers.onResetPassword(user)}>
                <KeyIcon />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handlers.onDisable(user)}
              >
                <UserX /> Disable Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
