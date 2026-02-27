import { AlertCircle } from "lucide-react";
import { useMemo } from "react";

import { ExperimentDrugSelect } from "@/components/molecules/ExperimentDrugSelect";
import { RandomizationTable } from "@/components/randomization/RandomizationTable";
import { useViewRandomization } from "@/hooks/useViewRandomization";
import { transformApiGroupsForUI } from "@/lib/randomization-utils";

export const RandomizationView = ({
  experimentId,
}: {
  experimentId: number;
}) => {
  const { data, error, isLoading } = useViewRandomization(experimentId);

  const groups = useMemo(() => {
    if (!data?.data?.groups) return null;
    return transformApiGroupsForUI(data?.data?.groups);
  }, [data]);

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">Loading groups...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-8 py-6 text-center">
            <AlertCircle className="size-8 text-destructive" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-destructive">
                Failed to load randomization data
              </p>
              <p className="text-xs text-muted-foreground">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && groups && (
        <RandomizationTable
          groups={groups}
          micePerGroup={data?.data?.mice_per_group || 0}
          renderGroupHeader={(g) => (
            <div className="flex justify-center">
              {g.experiment_drug_id ? (
                <ExperimentDrugSelect
                  value={g.experiment_drug_id.toString()}
                  placeholder="Select Drug"
                  className="w-44 bg-white text-xs"
                  disabled
                />
              ) : (
                <div className="text-sm">No Drugs Available</div>
              )}
            </div>
          )}
        />
      )}
    </>
  );
};
