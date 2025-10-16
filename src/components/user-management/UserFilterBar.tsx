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

export interface UserFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

const ROLES = [
  "all",
  "Administrator",
  "Data Uploader",
  "Data Validator",
  "Scientist",
  "Researcher",
];
const STATUSES = ["all", "Active", "Inactive"];

export function UserFilterBar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  onReset,
}: UserFilterBarProps) {
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
        >
          <SelectTrigger id="role" className="w-48">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r === "all" ? "All" : r}
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
