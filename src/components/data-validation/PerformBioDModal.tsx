import { Loader2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { cellLineValidationApi } from "@/api";
import { Button } from "@/components/atoms/Button/Button";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/Dialog/Dialog";
import { useAddCellLineMouseStrainAssociation } from "@/hooks/useAddCellLineMouseStrainAssociation";
import { useMouseGroupsByExperiment } from "@/hooks/useMouseGroupsByExperiment";

interface PerformBioDModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId: number;
  experimentName: string;
  onSave: (selectedGroupIds: number[]) => void;
}

interface ValidationError {
  cellLineId: number;
  mouseStrainId: number;
  cellLineName: string;
  mouseStrainName: string;
  message: string;
}

export function PerformBioDModal({
  isOpen,
  onClose,
  experimentId,
  experimentName,
  onSave,
}: Readonly<PerformBioDModalProps>) {
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { mouseGroups, isLoading: isLoadingGroups } =
    useMouseGroupsByExperiment(experimentId);

  // ✅ Use TanStack Query mutation hook
  const { addAssociation, isAdding } = useAddCellLineMouseStrainAssociation({
    onSuccess: () => {
      // Proceed with the flow after successful association
      proceedWithSave();
    },
  });

  // Get unique cell_line_id + mouse_strain_id pairs from selected groups
  const selectedPairs = useMemo(() => {
    if (!mouseGroups || selectedGroups.length === 0) return new Set<string>();

    const pairs = new Set<string>();
    for (const group of mouseGroups.filter((group) =>
      selectedGroups.includes(group.id)
    )) {
      if (group.cellLineId && group.mouseStrainId) {
        pairs.add(`${group.cellLineId}-${group.mouseStrainId}`);
      }
    }

    return pairs;
  }, [mouseGroups, selectedGroups]);

  // Check if a group should be enabled based on matching cell_line_id + mouse_strain_id
  const isGroupEnabled = (group: {
    cellLineId: number | null;
    mouseStrainId: number | null;
  }) => {
    if (!group.cellLineId || !group.mouseStrainId) return false;
    if (selectedGroups.length === 0) return true; // All enabled when nothing selected

    const groupKey = `${group.cellLineId}-${group.mouseStrainId}`;
    return selectedPairs.has(groupKey);
  };

  const handleCheckboxChange = ({
    groupId,
    isChecked,
  }: {
    groupId: number;
    isChecked: boolean;
  }) => {
    if (isChecked) {
      setSelectedGroups((prev) => [...prev, groupId]);
    } else {
      setSelectedGroups((prev) => {
        const newSelection = prev.filter((id) => id !== groupId);
        // If unselecting all, re-enable all checkboxes
        return newSelection;
      });
    }
  };

  const handleSelectAll = () => {
    if (!mouseGroups) return;

    // Get all enabled groups
    const enabledGroups = mouseGroups.filter(
      (group) => selectedGroups.length === 0 || isGroupEnabled(group)
    );

    const enabledGroupIds = enabledGroups.map((g) => g.id);

    if (selectedGroups.length === enabledGroupIds.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(enabledGroupIds);
    }
  };

  const handleSave = async () => {
    if (selectedGroups.length === 0) {
      toast.error("Please select at least one mouse group");
      return;
    }

    // Validate cell line and mouse strain combinations
    setIsValidating(true);

    try {
      // Get unique cell_line_id + mouse_strain_id pairs from selected groups
      const selectedMouseGroups = mouseGroups?.filter((group) =>
        selectedGroups.includes(group.id)
      );

      if (!selectedMouseGroups || selectedMouseGroups.length === 0) {
        return;
      }

      const uniquePairs = new Map<
        string,
        { cellLineId: number; mouseStrainId: number }
      >();

      for (const group of selectedMouseGroups) {
        if (group.cellLineId && group.mouseStrainId) {
          const key = `${group.cellLineId}-${group.mouseStrainId}`;
          if (!uniquePairs.has(key)) {
            uniquePairs.set(key, {
              cellLineId: group.cellLineId,
              mouseStrainId: group.mouseStrainId,
            });
          }
        }
      }

      // Validate all unique pairs in parallel
      const validationPromises = Array.from(uniquePairs.values()).map(
        async ({ cellLineId, mouseStrainId }) => {
          try {
            const response = await cellLineValidationApi.validateMouseStrain(
              cellLineId,
              { mouse_strain_id: mouseStrainId }
            );

            return {
              cellLineId,
              mouseStrainId,
              isValid: response.data.is_valid,
              cellLineName: response.data.cell_line_name,
              mouseStrainName: response.data.mouse_strain_name,
              message: response.data.message,
            };
          } catch (error) {
            console.error("Validation error:", error);
            // On error, assume valid to not block the user
            return {
              cellLineId,
              mouseStrainId,
              isValid: true,
              cellLineName: "",
              mouseStrainName: "",
              message: "",
            };
          }
        }
      );

      const results = await Promise.all(validationPromises);

      // Check if any validation failed
      const invalidCombinations = results.filter((r) => !r.isValid);

      if (invalidCombinations.length > 0) {
        // Show confirmation dialog
        setValidationErrors(
          invalidCombinations.map((r) => ({
            cellLineId: r.cellLineId,
            mouseStrainId: r.mouseStrainId,
            cellLineName: r.cellLineName,
            mouseStrainName: r.mouseStrainName,
            message: r.message,
          }))
        );
        setShowConfirmDialog(true);
      } else {
        // All valid - proceed
        proceedWithSave();
      }
    } catch (error) {
      console.error("Failed to validate groups:", error);
      toast.error("Failed to validate mouse groups");
    } finally {
      setIsValidating(false);
    }
  };

  const handleAddAssociation = async () => {
    if (validationErrors.length === 0) return;

    // Since we only allow selecting groups with the same cell_line_id + mouse_strain_id,
    // there will only ever be ONE unique invalid combination
    const { cellLineId, mouseStrainId } = validationErrors[0];

    try {
      await addAssociation({
        cellLineId,
        mouseStrainId,
      });

      toast.success("Association added successfully!");
    } catch (error) {
      console.error("Failed to add association:", error);
      toast.error("Failed to add association. Please try again.");
      // Keep dialog open so user can retry
    }
  };

  const proceedWithSave = () => {
    // Close Modal 1 first, then open Modal 2
    onClose(); // Close PerformBioDModal

    // Small delay to ensure smooth transition
    setTimeout(() => {
      onSave(selectedGroups); // This opens Modal 2 (SelectBioDExperimentModal)
      resetState(); // Clean up state after Modal 1 is closed
    }, 100);
  };

  const resetState = () => {
    setSelectedGroups([]);
    setValidationErrors([]);
    setShowConfirmDialog(false);
    setIsValidating(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCancelConfirmation = () => {
    // Close all dialogs and reset everything
    resetState();
    onClose();
  };

  const enabledGroupsCount = useMemo(() => {
    if (!mouseGroups) return 0;
    return mouseGroups.filter(
      (group) => selectedGroups.length === 0 || isGroupEnabled(group)
    ).length;
  }, [mouseGroups, selectedGroups, isGroupEnabled]);

  const isAllSelected =
    mouseGroups &&
    enabledGroupsCount > 0 &&
    selectedGroups.length === enabledGroupsCount;

  const renderMouseGroupsSection = () => {
    if (isLoadingGroups) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">
            Loading mouse groups...
          </div>
        </div>
      );
    }

    if (!mouseGroups || mouseGroups.length === 0) {
      return (
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          No mouse groups available for this experiment
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {/* Select All Checkbox */}
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            disabled={enabledGroupsCount === 0 || selectedGroups.length === 0}
          />
          <label
            htmlFor="select-all"
            className="text-sm font-medium cursor-pointer flex-1"
          >
            Select All ({enabledGroupsCount} available of {mouseGroups.length}{" "}
            groups)
          </label>
        </div>

        {/* Individual Mouse Groups */}
        <div className="max-h-[400px] overflow-y-auto space-y-2 border rounded-lg p-2">
          {mouseGroups.map((group) => {
            const isEnabled = isGroupEnabled(group);
            const isDisabled = selectedGroups.length > 0 && !isEnabled;

            return (
              <div
                key={group.id}
                className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                  isDisabled
                    ? "bg-muted/30 opacity-50 cursor-not-allowed"
                    : "hover:bg-muted/50 cursor-pointer"
                }`}
                title={
                  isDisabled
                    ? "Different cell line or mouse strain combination"
                    : undefined
                }
              >
                <Checkbox
                  id={`group-${group.id}`}
                  checked={selectedGroups.includes(group.id)}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange({
                      groupId: group.id,
                      isChecked: checked,
                    })
                  }
                  disabled={isDisabled}
                />
                <label
                  htmlFor={`group-${group.id}`}
                  className={`flex-1 ${
                    isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <div className="font-medium text-sm">{group.name}</div>
                  {isDisabled && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Different combination - cannot mix
                    </div>
                  )}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen && !showConfirmDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Perform BioD - {experimentName}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Select the mouse groups for which you want to perform BioD
              analysis:
            </p>

            {renderMouseGroupsSection()}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedGroups.length} group(s) selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleClose}
                disabled={isValidating}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleSave}
                disabled={selectedGroups.length === 0 || isValidating}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Validating...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Validation Error Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={handleCancelConfirmation}>
        <DialogContent className="sm:max-w-lg">
          <button
            onClick={handleCancelConfirmation}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            disabled={isAdding}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-destructive">
              Association Update Required
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              We noticed the following cell line and mouse strain combinations
              need to be added to the master table before proceeding:
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {validationErrors.map((error, index) => (
                <div
                  key={`${error.message}-${index}`}
                  className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                >
                  <p className="text-sm font-medium text-destructive">
                    ⚠️ {error.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cell Line: <strong>{error.cellLineName}</strong> | Mouse
                    Strain: <strong>{error.mouseStrainName}</strong>
                  </p>
                </div>
              ))}
            </div>

            <p className="text-sm font-semibold text-foreground">
              Please add these associations to the master table to continue.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="lg"
              onClick={handleCancelConfirmation}
              disabled={isAdding}
            >
              Go Back
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={handleAddAssociation}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add to Master Table"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
