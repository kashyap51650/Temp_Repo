import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms";
import type { Role } from "@/types/auth";

export interface UserFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  roles?: Role[];
  rolesLoading?: boolean;
}

const STATUSES = ["all", "Active", "Inactive", "Blocked"];

export function UserFilterBar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  onReset,
  roles = [],
  rolesLoading = false,
}: Readonly<UserFilterBarProps>) {
  const roleOptions = [
    { id: "all", name: "All", value: "" },
    ...roles.map((r) => ({
      id: r.id.toString(),
      name: r.name,
      value: r.id.toString(),
    })),
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search by name or email"
          className="w-64"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={role || "all"}
          onValueChange={(v) => onRoleChange(v === "all" ? "" : v)}
          disabled={rolesLoading}
        >
          <SelectTrigger id="role" className="w-48">
            <SelectValue placeholder={rolesLoading ? "Loading..." : "All"} />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status || "all"}
          onValueChange={(v) => onStatusChange(v === "all" ? "" : v)}
        >
          <SelectTrigger id="status" className="w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={onReset} type="button">
        Reset Filters
      </Button>
    </div>
  );
}
