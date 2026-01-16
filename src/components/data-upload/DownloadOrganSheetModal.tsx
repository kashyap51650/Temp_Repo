import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { useMouseGroupsByExperiment } from "@/hooks/useMouseGroupsByExperiment";
import { useNecropsyFileDownload } from "@/hooks/useNecropsyFileDownload";

interface DownloadOrganSheetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experimentId?: number;
}

export const DownloadOrganSheetModal: React.FC<
  Readonly<DownloadOrganSheetModalProps>
> = ({ open, onOpenChange, experimentId }) => {
  const { mouseGroups, isLoading } = useMouseGroupsByExperiment(experimentId);

  const { handleFileDownload, isPending } = useNecropsyFileDownload({
    onSuccess: () => {
      onOpenChange(false);
    },
  });
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
    handleFileDownload({
      experimentId: experimentId!,
      groupIds: selectedGroupCodes.map((code) => Number.parseInt(code, 10)),
    });
  }, [selectedGroupCodes, handleFileDownload, experimentId]);

  const renderRandomizationGroups = () => {
    if (isLoading) {
      return (
        <div className="text-sm text-muted-foreground">Loading groups...</div>
      );
    }

    if (mouseGroups?.length) {
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
            disabled={selectedGroupCodes.length === 0 || isPending}
          >
            {isPending ? "Downloading..." : "Download Organ Weight Sheet"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
