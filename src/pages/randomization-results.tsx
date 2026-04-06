import { useRouterState } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { Label } from "@/components";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { ExperimentDrugSelect } from "@/components/molecules/ExperimentDrugSelect";
import { AddGroupDialog } from "@/components/randomization/AddGroupDialog";
import { RandomizationTable } from "@/components/randomization/RandomizationTable";
import { useRandomizationResult } from "@/hooks/useRandomizationResult";
import { RANDOMIZATION_PREVIEW_TYPES } from "@/lib/constants";
import { transformApiGroupsForUI } from "@/lib/randomization-utils";

export default function RandomizationResults() {
  const {
    selectedGroupDrug,
    setSelectedGroupDrug,
    isPending,
    isError,
    error,
    previewRandomizationfn,
    isConfirmationPending,
    handleConfirmClick,
    randomizationData,
    handleBack,
    bufferGroups,
    setBufferGroups,
  } = useRandomizationResult();

  const groups = useMemo(() => {
    if (!randomizationData) return null;
    return transformApiGroupsForUI(randomizationData.groups);
  }, [randomizationData]);

  const state = useRouterState({ select: (s) => s.location.search }) as {
    experiment_id: number;
    project_id: number;
    mice_per_group: number;
    randomization_type: string;
  };

  const [nameFilter, setNameFilter] = React.useState("");
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);

  // Check if this is weight sheet randomization
  const isWeightSheetRandomization =
    state.randomization_type === RANDOMIZATION_PREVIEW_TYPES.BODY_WEIGHT;

  // Auto-populate selected drugs from API response
  useEffect(() => {
    if (randomizationData?.groups) {
      const drugSelections: Record<string, string> = {};

      for (const group of randomizationData.groups) {
        if (group.experiment_drug_id) {
          drugSelections[group.group_code] =
            group.experiment_drug_id.toString();
        }
      }

      // Only update if there are actual selections from backend
      if (Object.keys(drugSelections).length > 0) {
        setSelectedGroupDrug(drugSelections);
      }
    }
  }, [randomizationData, setSelectedGroupDrug]);

  useEffect(() => {
    const payload: {
      experiment_id: number;
      mice_per_group: number;
      randomization_type: string;
      buffer_groups?: string[];
    } = {
      experiment_id: state.experiment_id,
      mice_per_group: state.mice_per_group,
      randomization_type: state.randomization_type,
    };

    // Add buffer_groups for weight sheet randomization
    if (isWeightSheetRandomization) {
      payload.buffer_groups = bufferGroups;
    }

    previewRandomizationfn(payload);
  }, []);

  const applyFilters = () => {
    // clear all selections
    setSelectedGroupDrug({});

    const payload: {
      experiment_id: number;
      mice_per_group: number;
      randomization_type: string;
      buffer_groups?: string[];
    } = {
      experiment_id: state.experiment_id,
      mice_per_group: nameFilter ? Number(nameFilter) : state.mice_per_group,
      randomization_type: state.randomization_type,
    };

    // Add buffer_groups for weight sheet randomization
    if (isWeightSheetRandomization) {
      payload.buffer_groups = bufferGroups;
    }

    previewRandomizationfn(payload);
  };

  const handleAddGroup = (groupName: string) => {
    const updatedGroups = [...bufferGroups, groupName];
    setBufferGroups(updatedGroups);

    // Immediately call API with new buffer groups
    const payload = {
      experiment_id: state.experiment_id,
      mice_per_group: state.mice_per_group,
      randomization_type: state.randomization_type,
      buffer_groups: updatedGroups,
    };

    previewRandomizationfn(payload);
  };

  const handleDeleteBufferGroup = (groupName: string) => {
    // Remove the group from buffer groups
    const updatedGroups = bufferGroups.filter((name) => name !== groupName);
    setBufferGroups(updatedGroups);

    // Immediately call API with updated buffer groups
    const payload = {
      experiment_id: state.experiment_id,
      mice_per_group: state.mice_per_group,
      randomization_type: state.randomization_type,
      buffer_groups: updatedGroups,
    };

    previewRandomizationfn(payload);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center ">
          <Button variant="link" size={"icon-lg"} onClick={handleBack}>
            <ArrowLeft className="size-6" />
          </Button>
          <h1 className="text-3xl font-bold">Randomization Results</h1>
        </div>
      </div>

      <div className="flex items-center mb-3 gap-3 py-2">
        {isWeightSheetRandomization ? (
          // For weight sheet: Show Add Group button
          <div className="flex flex-col gap-2">
            <Label>Buffer Groups</Label>
            <Button
              onClick={() => setIsAddGroupDialogOpen(true)}
              disabled={isPending}
              className="flex items-center gap-2"
            >
              <Plus className="size-4" />
              Add Group
            </Button>
          </div>
        ) : (
          // For callipering sheet: Show mouse count input (existing behavior)
          <>
            <div className="flex flex-col gap-2">
              <Label>Number of Mouse in Group</Label>
              <Input
                placeholder="Enter mouse count"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-64"
                type="number"
              />
            </div>
            <Button
              onClick={applyFilters}
              className="mt-6"
              disabled={isPending}
            >
              Apply
            </Button>
          </>
        )}
      </div>

      {isPending ? (
        <p>Loading randomization results...</p>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-10 py-10 text-center max-w-md w-full shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-7 text-destructive" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-destructive">
                Randomization Preview Failed
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {error?.message ||
                  "An unexpected error occurred while generating the preview."}
              </p>
            </div>
            <p className="text-sm text-muted-foreground font-medium text-center mt-2">
              Retry by changing the number of mice per group
            </p>
          </div>
        </div>
      ) : (
        <>
          {groups && (
            <RandomizationTable
              groups={groups}
              micePerGroup={randomizationData?.mice_per_group || 0}
              onDeleteGroup={
                isWeightSheetRandomization ? handleDeleteBufferGroup : undefined
              }
              renderGroupHeader={(g) => (
                <div className="flex justify-center">
                  <ExperimentDrugSelect
                    value={selectedGroupDrug[g.key] ?? ""}
                    onValueChange={(v) => {
                      setSelectedGroupDrug((prev) => ({
                        ...prev,
                        [g.key]: v,
                      }));
                    }}
                    placeholder="Select Drug"
                    className="w-44 bg-white text-xs"
                    projectId={state.project_id}
                  />
                </div>
              )}
            />
          )}
          <div className="flex justify-end mt-3">
            <Button
              size="lg"
              onClick={handleConfirmClick}
              disabled={isConfirmationPending}
            >
              {isConfirmationPending ? "Applying..." : "Apply"}
            </Button>
          </div>
        </>
      )}

      <AddGroupDialog
        isOpen={isAddGroupDialogOpen}
        onClose={() => setIsAddGroupDialogOpen(false)}
        onSave={handleAddGroup}
      />
    </div>
  );
}
