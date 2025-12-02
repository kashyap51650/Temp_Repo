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

interface Role {
  id: number;
  name: string;
}

interface NotificationTableFiltersProps {
  onTitleFilter: (value: string) => void;
  onStatusFilter: (value: string) => void;
  onSentToFilter: (value: string) => void;
  titleFilter: string;
  statusFilter: string;
  sentToFilter: string;
  onClearFilters: () => void;
  roles: Role[];
}

export function NotificationTableFilters({
  onTitleFilter,
  onStatusFilter,
  onSentToFilter,
  titleFilter,
  statusFilter,
  sentToFilter,
  onClearFilters,
  roles,
}: NotificationTableFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title-search">Search</Label>
        <Input
          id="title-search"
          type="text"
          value={titleFilter}
          onChange={(e) => onTitleFilter(e.target.value)}
          placeholder="Search by title..."
          className="w-64"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="status-filter">Status</Label>
        <Select
          value={statusFilter || "all"}
          onValueChange={(v) => onStatusFilter(v === "all" ? "all" : v)}
        >
          <SelectTrigger id="status-filter" className="w-48">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="sentto-filter">Sent To</Label>
        <Select
          value={sentToFilter || "all"}
          onValueChange={(v) => onSentToFilter(v === "all" ? "all" : v)}
        >
          <SelectTrigger id="sentto-filter" className="w-48">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.name}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={onClearFilters} type="button">
        Reset Filters
      </Button>
    </div>
  );
}
