import { AlertCircle, Maximize2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Skeleton } from "@/components/atoms/Skeleton/skeleton";
import { BiodistributionChart } from "@/components/biodistribution";
import { BiodistributionGraphModal } from "@/components/biodistribution/BiodistributionGraphModal";
import { useBiodistributionGraph } from "@/hooks/useBiodistributionSummary";

interface AGCSheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId?: number;
  experimentName?: string;
  experimentDataId?: string; // Row ID for filtering
}

export function AGCSheetViewModal({
  isOpen,
  onClose,
  experimentId,
  experimentName,
  experimentDataId,
}: Readonly<AGCSheetViewModalProps>) {
  const [isFullGraphOpen, setIsFullGraphOpen] = useState(false);

  // Fetch biodistribution graph data with experiment_data_ids filter
  const { data, isLoading, error } = useBiodistributionGraph(
    isOpen ? experimentId : null,
    experimentDataId ? { experiment_data_ids: experimentDataId } : undefined
  );

  // Extract dataset from API response
  const dataset = useMemo(() => {
    return data?.data?.dataset || [];
  }, [data]);

  // Determine graph title from data
  const graphTitle = useMemo(() => {
    if (!dataset.length) return "Biodistribution Graph";
    const first = dataset[0];
    return `${first.drug_name} - ${first.mouse_strain_name} Biodistribution`;
  }, [dataset]);

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) onClose();
        }}
        title={
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex gap-4 items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  AGC Sheet - Biodistribution Graph
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {experimentName
                    ? `Uptake summary for ${experimentName}`
                    : "Biodistribution uptake summary"}
                </p>
              </div>
            </div>
            {/* View Full Graph Button - Only show when data is loaded */}
            {!isLoading && !error && dataset.length > 0 && (
              <Button
                onClick={() => setIsFullGraphOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Maximize2 className="size-4" />
                View Full Graph
              </Button>
            )}
          </div>
        }
        trigger={null}
        className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
      >
        {/* Modal content */}
        <div className="flex-grow p-6 overflow-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-[500px] w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <AlertCircle className="size-12 text-destructive" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-destructive">
                  Failed to Load Graph Data
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {error.message}
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && dataset.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <AlertCircle className="size-12 text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  No Graph Data Available
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This experiment does not have biodistribution data yet.
                </p>
              </div>
            </div>
          )}

          {/* Graph Display */}
          {!isLoading && !error && dataset.length > 0 && (
            <div className="space-y-4">
              {/* Graph Title */}
              <h2 className="text-xl font-semibold text-center">
                {graphTitle}
              </h2>

              {/* Metadata - Below title, above graph */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Drug:</span>
                  <span className="font-semibold text-foreground">
                    {dataset[0]?.drug_name}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    Mouse Strain:
                  </span>
                  <span className="font-semibold text-foreground">
                    {dataset[0]?.mouse_strain_name}
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    Total Samples:
                  </span>
                  <span className="font-semibold text-foreground">
                    {dataset.length}
                  </span>
                </div>
              </div>

              {/* Biodistribution Chart (without title prop since we're rendering it above) */}
              <BiodistributionChart data={dataset} />
            </div>
          )}
        </div>
      </Dialog>

      {/* Full-Screen Graph Modal - Shows ALL experiment data (no filtering) */}
      {experimentId && (
        <BiodistributionGraphModal
          isOpen={isFullGraphOpen}
          onClose={() => setIsFullGraphOpen(false)}
          experimentId={experimentId}
          title={graphTitle}
        />
      )}
    </>
  );
}
