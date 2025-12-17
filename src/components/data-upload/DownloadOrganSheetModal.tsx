import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { useMouseGroupsByExperiment } from "@/hooks/useMouseGroupsByExperiment";

interface DownloadOrganSheetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experimentId?: number;
  /** Called when user clicks Proceed with the array of selected group codes */
  onProceed?: (selectedGroupCodes: string[]) => void;
}

export const DownloadOrganSheetModal: React.FC<
  DownloadOrganSheetModalProps
> = ({ open, onOpenChange, experimentId, onProceed }) => {
  const { mouseGroups, isLoading } = useMouseGroupsByExperiment(experimentId);

  const [selectedGroups, setSelectedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const toggleGroup = useCallback((groupCode: number) => {
    setSelectedGroups((prev) => ({ ...prev, [groupCode]: !prev[groupCode] }));
  }, []);

  const selectedGroupCodes = useMemo(
    () => Object.keys(selectedGroups).filter((k) => selectedGroups[k]),
    [selectedGroups]
  );

  const handleProceed = useCallback(() => {
    if (onProceed) onProceed(selectedGroupCodes);
  }, [onProceed, selectedGroupCodes]);

  const renderRandomizationGroups = () => {
    if (isLoading) {
      return (
        <div className="text-sm text-muted-foreground">Loading groups...</div>
      );
    }

    if (mouseGroups && mouseGroups.length > 0) {
      return mouseGroups?.map((g) => (
        <label key={g.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!selectedGroups[g.id]}
            onChange={() => toggleGroup(g.id)}
            className="h-4 w-4"
          />
          <span className="text-sm">{g.name}</span>
        </label>
      ));
    }

    return (
      <div className="text-sm text-muted-foreground">No groups available</div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Select Randomized Groups"
      trigger={null}
    >
      <div className="p-4">
        <div className="space-y-3 max-h-64 overflow-auto">
          {renderRandomizationGroups()}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleProceed}
            disabled={selectedGroupCodes.length === 0}
          >
            Proceed ({selectedGroupCodes.length})
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
