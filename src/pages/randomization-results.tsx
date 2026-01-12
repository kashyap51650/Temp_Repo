import { useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useMemo } from "react";

import { Label } from "@/components";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { ExperimentDrugSelect } from "@/components/molecules/ExperimentDrugSelect";
import { RandomizationTable } from "@/components/randomization/RandomizationTable";
import { useRendomizationResult } from "@/hooks/useRendomizationResult";
import { transformApiGroupsForUI } from "@/lib/randomization-utils";

export default function RandomizationResults() {
  const {
    selectedGroupDrug,
    setSelectedGroupDrug,
    isPending,
    previewRandomizationfn,
    isConfirmationPending,
    handleConfirmClick,
    randomizationData,
    handleBack,
  } = useRendomizationResult();

  const groups = useMemo(() => {
    if (!randomizationData) return null;
    return transformApiGroupsForUI(randomizationData.groups);
  }, [randomizationData]);

  const state = useRouterState({ select: (s) => s.location.search }) as {
    experiment_id: number;
    mice_per_group: number;
    randomization_type: string;
  };

  const [nameFilter, setNameFilter] = React.useState("");

  useEffect(() => {
    previewRandomizationfn({
      experiment_id: state.experiment_id,
      mice_per_group: state.mice_per_group,
      randomization_type: state.randomization_type,
    });
  }, []);

  const applyFilters = () => {
    // clear all selections
    setSelectedGroupDrug({});
    previewRandomizationfn({
      experiment_id: state.experiment_id,
      mice_per_group: nameFilter ? Number(nameFilter) : state.mice_per_group,
      randomization_type: state.randomization_type,
    });
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
        <Button onClick={applyFilters} className="mt-6" disabled={isPending}>
          Apply
        </Button>
      </div>

      {isPending ? (
        <p>Loading randomization results...</p>
      ) : (
        <>
          {groups && (
            <RandomizationTable
              groups={groups}
              micePerGroup={randomizationData?.mice_per_group || 0}
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
    </div>
  );
}
