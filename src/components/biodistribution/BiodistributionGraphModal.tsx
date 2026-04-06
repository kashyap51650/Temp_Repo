import { AlertCircle, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Skeleton } from "@/components/atoms/Skeleton/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/molecules/DropdownMenu/DropdownMenu";
import { useBiodistributionCsvExport } from "@/hooks/useBiodistributionCsvExport";
import { useBiodistributionGraph } from "@/hooks/useBiodistributionSummary";
import { useExportChartAsImage } from "@/hooks/useExportChartAsImage";
import type { BiodistributionGraphParams } from "@/types/biodistribution";

import { Button } from "../atoms";
import { BiodistributionChart } from "./BiodistributionChart";
import { BiodistributionFilters } from "./BiodistributionFilters";

interface BiodistributionGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId: number;
  title: string;
}

/**
 * Validate and parse numeric value from string/number
 */
function parseNumericValue(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

/**
 * BiodistributionGraphModal Component
 *
 * Full-screen modal displaying biodistribution uptake summary graph with filters.
 * Shows ALL experiment data by default, user can apply filters to narrow down view.
 */
export function BiodistributionGraphModal({
  isOpen,
  onClose,
  experimentId,
  title,
}: BiodistributionGraphModalProps) {
  const [activeFilterParams, setActiveFilterParams] =
    useState<BiodistributionGraphParams>();

  const { chartRef, exportAsImage, isExporting } = useExportChartAsImage(
    `biodistribution-${experimentId}`
  );
  const { exportCsv, isExportingCsv } = useBiodistributionCsvExport();

  // Fetch ALL data for this experiment (no experiment_data_ids filter)
  const { data, isLoading, error } = useBiodistributionGraph(
    isOpen ? experimentId : null
  );

  // Full dataset from API
  const fullDataset = useMemo(() => {
    return data?.data?.dataset || [];
  }, [data]);

  // Filtered dataset (managed by BiodistributionFilters component)
  const [filteredDataset, setFilteredDataset] = useState(fullDataset);

  // Calculate data range for reference line validation
  const dataRange = useMemo(() => {
    if (!filteredDataset || filteredDataset.length === 0) {
      return { min: 0, max: 0, average: 0 };
    }

    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    let count = 0;

    filteredDataset.forEach((item) => {
      const value = parseNumericValue(item.mean_uptake_percent_per_g);
      if (value > 0) {
        if (value < min) min = value;
        if (value > max) max = value;
        sum += value;
        count++;
      }
    });

    const average = count > 0 ? sum / count : 0;

    return {
      min: min === Infinity ? 0 : min,
      max: max === -Infinity ? 0 : max,
      average: Number(average.toFixed(2)),
    };
  }, [filteredDataset]);

  // Reference line state (initialize with average)
  const [referenceLineValue, setReferenceLineValue] = useState<number>(
    dataRange.average
  );

  // Update reference line when filtered data changes
  useEffect(() => {
    if (dataRange.average > 0) {
      setReferenceLineValue(dataRange.average);
    }
  }, [dataRange.average]);

  // Update filtered dataset when full dataset changes (initial load)
  useEffect(() => {
    if (fullDataset.length > 0) {
      setFilteredDataset(fullDataset);
    }
  }, [fullDataset]);

  if (!isOpen && !isLoading && !error && fullDataset.length === 0) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title={
        <div className="flex w-full flex-col gap-3 pr-8 sm:flex-row sm:items-center sm:justify-between m-4">
          <h2 className="text-xl font-semibold">Uptake Summary Graph</h2>
          <div className="mr-8 flex flex-wrap items-center gap-2 sm:justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={isExportingCsv}
                >
                  <Download className="size-4" />
                  {isExportingCsv ? "Exporting CSV..." : "Export CSV File"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={isExportingCsv}
                  onSelect={() =>
                    exportCsv({
                      experimentId,
                      mode: "uptake-by-group",
                      params: activeFilterParams,
                    })
                  }
                >
                  Uptake by Group
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isExportingCsv}
                  onSelect={() =>
                    exportCsv({
                      experimentId,
                      mode: "uptake-by-group-mice",
                      params: activeFilterParams,
                    })
                  }
                >
                  Uptake by Group Mice
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isExportingCsv}
                  onSelect={() =>
                    exportCsv({
                      experimentId,
                      mode: "uptake-by-mice",
                      params: activeFilterParams,
                    })
                  }
                >
                  Uptake by Mice
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={exportAsImage}
              disabled={isExporting}
            >
              <Download className="size-4" />
              {isExporting ? "Exporting..." : "Export as Image"}
            </Button>
          </div>
        </div>
      }
      trigger={null}
      className="w-screen h-screen max-w-none max-h-none m-0 p-0 rounded-none flex flex-col"
    >
      {/* Content */}
      <div className="flex-grow p-6 overflow-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-[500px] w-full" />
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

        {/* Graph Display */}
        {!isLoading && !error && fullDataset.length > 0 && (
          <div className="space-y-6">
            {/* Graph Title */}
            <h2 className="text-2xl font-semibold text-center">{title}</h2>

            {/* Filters Section with Reference Line Control */}
            <BiodistributionFilters
              experimentId={experimentId}
              fullDataset={fullDataset}
              onFilteredDataChange={setFilteredDataset}
              onFilterParamsChange={setActiveFilterParams}
              referenceLineValue={referenceLineValue}
              onReferenceLineChange={setReferenceLineValue}
              dataRange={dataRange}
            />

            {/* Biodistribution Chart - Now uses filtered data */}
            <div ref={chartRef}>
              <BiodistributionChart
                data={filteredDataset}
                referenceLineValue={referenceLineValue}
              />
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
