import { Button } from "../atoms";
import { Badge } from "../atoms/Badge/Badge";
import { Dialog } from "../atoms/Dialog/Dialog";
import { Label } from "../atoms/Label/Label";
import type { VisualFilterRow } from "../organisms/DataTable/tableData";

interface ViewFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter: VisualFilterRow | null;
}

export function ViewFilterModal({
  isOpen,
  onClose,
  filter,
}: ViewFilterModalProps) {
  if (!filter) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title="View Filter Details"
      showClose={true}
      className="max-w-2xl"
      trigger={null}
    >
      <div className="space-y-4 mt-5">
        <div className="space-y-2 flex flex-row justify-between items-center">
          <Label className="mb-1 text-muted-foreground w-30">Filter Name</Label>
          <p className="font-normal ml-4 text-sm text-end">
            {filter.filterName}
          </p>
        </div>

        <div className="space-y-2 flex flex-row justify-between items-center">
          <Label className="mb-1 text-muted-foreground w-30">Filter Type</Label>
          <p className="font-normal ml-4 text-sm text-end">
            {filter.filterType}
          </p>
        </div>

        {filter.filterOptions && filter.filterOptions.length > 0 && (
          <div className="space-y-2 flex flex-row justify-between items-center">
            <Label className="mb-1 text-muted-foreground w-30">
              Filter Options
            </Label>
            <div className="flex flex-wrap gap-2">
              {filter.filterOptions.map((option) => (
                <Badge
                  key={option}
                  variant="secondary"
                  className="py-1 text-sm"
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 flex flex-row justify-between items-center">
          <Label className="mb-1 text-muted-foreground w-30">Created By</Label>
          <p className="font-normal ml-4 text-sm text-end">
            {filter.createdBy}
          </p>
        </div>

        <div className="space-y-2 flex flex-row justify-between items-center">
          <Label className="mb-1 text-muted-foreground w-30">
            Created Date
          </Label>
          <p className="font-normal ml-4 text-sm text-end">
            {filter.createdDate}
          </p>
        </div>
        <div className="text-right mt-4">
          <Button variant={"outline"}>Close</Button>
        </div>
      </div>
    </Dialog>
  );
}
