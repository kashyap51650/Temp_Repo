import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Label } from "@/components/atoms/Label/Label";
import { Skeleton } from "@/components/atoms/Skeleton/skeleton";
import { useBiodistributionFilters } from "@/hooks/useBiodistributionFilters";
import type {
  BiodistributionCellLine,
  BiodistributionDataPoint,
  BiodistributionExperimentDrug,
  BiodistributionGraphParams,
  BiodistributionMouseGroup,
  BiodistributionMouseStrain,
  BiodistributionOrgan,
  BiodistributionTimepoint,
} from "@/types/biodistribution";

import { BiodistributionFilterDropdown } from "./BiodistributionFilterDropdown";

interface BiodistributionFiltersProps {
  experimentId: number;
  fullDataset: BiodistributionDataPoint[];
  onFilteredDataChange: (filteredData: BiodistributionDataPoint[]) => void;
  onFilterParamsChange?: (params: BiodistributionGraphParams) => void;
  referenceLineValue: number;
  onReferenceLineChange: (value: number) => void;
  dataRange: { min: number; max: number; average: number };
}

/**
 * BiodistributionFilters Component
 *
 * Manages all filter dropdowns for biodistribution graph
 * - Expandable/collapsible filter section
 * - Fetches available filters from API
 * - All filters selected by default
 * - Frontend filtering when user applies filters
 * - Only shows filters that have data
 * - Reset button to restore initial state
 * - Reference line control
 */
export function BiodistributionFilters({
  experimentId,
  fullDataset,
  onFilteredDataChange,
  onFilterParamsChange,
  referenceLineValue,
  onReferenceLineChange,
  dataRange,
}: BiodistributionFiltersProps) {
  const {
    data: filtersData,
    isLoading,
    error,
  } = useBiodistributionFilters(experimentId);

  // Expand/collapse state
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter state - stores selected IDs/values
  const [selectedTimepoints, setSelectedTimepoints] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [selectedOrgans, setSelectedOrgans] = useState<number[]>([]);
  const [selectedCellLines, setSelectedCellLines] = useState<number[]>([]);
  const [selectedDrugs, setSelectedDrugs] = useState<number[]>([]);
  const [selectedStrains, setSelectedStrains] = useState<number[]>([]);

  // Reference line input state
  const [inputValue, setInputValue] = useState<string>(
    referenceLineValue.toFixed(2)
  );

  // Track if initial filters have been applied
  const [initialFiltersApplied, setInitialFiltersApplied] = useState(false);

  // Update input when reference line value changes externally
  useEffect(() => {
    setInputValue(referenceLineValue.toFixed(2));
  }, [referenceLineValue]);

  // Initialize filters - select all by default when data loads
  useEffect(() => {
    const responseData = filtersData?.data;
    if (responseData && fullDataset.length > 0 && !initialFiltersApplied) {
      const {
        timepoints,
        mouse_groups,
        organs,
        cell_lines,
        experiment_drugs,
        mouse_strains,
      } = responseData;

      // Select all options by default
      setSelectedTimepoints(
        timepoints.map((t: BiodistributionTimepoint) => t.time_point_hours)
      );
      setSelectedGroups(
        mouse_groups.map((g: BiodistributionMouseGroup) => g.id)
      );
      setSelectedOrgans(organs.map((o: BiodistributionOrgan) => o.id));
      setSelectedCellLines(
        cell_lines.map((c: BiodistributionCellLine) => c.id)
      );
      setSelectedDrugs(
        experiment_drugs.map((d: BiodistributionExperimentDrug) => d.id)
      );
      setSelectedStrains(
        mouse_strains.map((s: BiodistributionMouseStrain) => s.id)
      );

      onFilterParamsChange?.({
        time_point_hours: timepoints.length
          ? timepoints
              .map((t: BiodistributionTimepoint) => t.time_point_hours)
              .join(",")
          : undefined,
        group_ids: mouse_groups.length
          ? mouse_groups.map((g: BiodistributionMouseGroup) => g.id).join(",")
          : undefined,
        organ_ids: organs.length
          ? organs.map((o: BiodistributionOrgan) => o.id).join(",")
          : undefined,
        cell_line_ids: cell_lines.length
          ? cell_lines.map((c: BiodistributionCellLine) => c.id).join(",")
          : undefined,
        experiment_drug_ids: experiment_drugs.length
          ? experiment_drugs
              .map((d: BiodistributionExperimentDrug) => d.id)
              .join(",")
          : undefined,
        mouse_strain_ids: mouse_strains.length
          ? mouse_strains.map((s: BiodistributionMouseStrain) => s.id).join(",")
          : undefined,
      });

      // Auto-apply filters on mount (show all data initially)
      setInitialFiltersApplied(true);
      // Pass full dataset since all filters are selected
      onFilteredDataChange(fullDataset);
    }
  }, [
    filtersData,
    fullDataset,
    initialFiltersApplied,
    onFilteredDataChange,
    onFilterParamsChange,
  ]);

  // Show error toast if filters API fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load filter options");
    }
  }, [error]);

  // Transform API data to dropdown options - only include filters with data
  const filterOptions = useMemo(() => {
    const responseData = filtersData?.data;
    if (!responseData) return null;

    const {
      timepoints,
      mouse_groups,
      organs,
      cell_lines,
      experiment_drugs,
      mouse_strains,
    } = responseData;

    return {
      timepoints:
        timepoints.length > 0
          ? timepoints.map((t: BiodistributionTimepoint) => ({
              value: t.time_point_hours,
              label: t.time_point_display,
            }))
          : [],
      groups:
        mouse_groups.length > 0
          ? mouse_groups.map((g: BiodistributionMouseGroup) => ({
              value: g.id,
              label: g.group_name,
            }))
          : [],
      organs:
        organs.length > 0
          ? organs.map((o: BiodistributionOrgan) => ({
              value: o.id,
              label: o.organ_name,
            }))
          : [],
      cellLines:
        cell_lines.length > 0
          ? cell_lines.map((c: BiodistributionCellLine) => ({
              value: c.id,
              label: `${c.cell_line_name} (${c.vendor_name})`,
            }))
          : [],
      drugs:
        experiment_drugs.length > 0
          ? experiment_drugs.map((d: BiodistributionExperimentDrug) => ({
              value: d.id,
              label: `${d.drug_name} (${d.om_number})`,
            }))
          : [],
      strains:
        mouse_strains.length > 0
          ? mouse_strains.map((s: BiodistributionMouseStrain) => ({
              value: s.id,
              label: s.mouse_strain_name,
            }))
          : [],
    };
  }, [filtersData]);

  // Apply filters - frontend filtering logic
  const handleApplyFilters = () => {
    const responseData = filtersData?.data;
    if (!responseData || fullDataset.length === 0) {
      toast.error("No data available to filter");
      return;
    }

    const selectedTimeHours = new Set(selectedTimepoints);

    const selectedGroupNames =
      selectedGroups.length > 0
        ? new Set(
            responseData.mouse_groups
              .filter((g: BiodistributionMouseGroup) =>
                selectedGroups.includes(g.id)
              )
              .map((g: BiodistributionMouseGroup) => g.group_name)
          )
        : new Set();

    const selectedOrganNames =
      selectedOrgans.length > 0
        ? new Set(
            responseData.organs
              .filter((o: BiodistributionOrgan) =>
                selectedOrgans.includes(o.id)
              )
              .map((o: BiodistributionOrgan) => o.organ_name)
          )
        : new Set();

    // NOTE: BiodistributionDataPoint has no dedicated cell_line_name field.
    // Both organs and cell lines are stored under organ_name in the dataset,
    // so we compare selected cell line names against item.organ_name below.
    const selectedCellLineNamesInOrganField =
      selectedCellLines.length > 0
        ? new Set(
            responseData.cell_lines
              .filter((c: BiodistributionCellLine) =>
                selectedCellLines.includes(c.id)
              )
              .map((c: BiodistributionCellLine) => c.cell_line_name)
          )
        : new Set();

    const selectedDrugNames =
      selectedDrugs.length > 0
        ? new Set(
            responseData.experiment_drugs
              .filter((d: BiodistributionExperimentDrug) =>
                selectedDrugs.includes(d.id)
              )
              .map((d: BiodistributionExperimentDrug) => d.drug_name)
          )
        : new Set();

    const selectedStrainNames =
      selectedStrains.length > 0
        ? new Set(
            responseData.mouse_strains
              .filter((s: BiodistributionMouseStrain) =>
                selectedStrains.includes(s.id)
              )
              .map((s: BiodistributionMouseStrain) => s.mouse_strain_name)
          )
        : new Set();

    const filtered = fullDataset.filter((item) => {
      const itemTimepoint = parseFloat(item.time_point_hours);
      const matchesTimepoint =
        selectedTimeHours.size === 0 || selectedTimeHours.has(itemTimepoint);

      const matchesGroup =
        selectedGroupNames.size === 0 ||
        selectedGroupNames.has(item.group_name);

      const matchesOrganOrCellLine =
        (selectedOrganNames.size === 0 &&
          selectedCellLineNamesInOrganField.size === 0) ||
        selectedOrganNames.has(item.organ_name) ||
        selectedCellLineNamesInOrganField.has(item.organ_name);

      const matchesDrug =
        selectedDrugNames.size === 0 || selectedDrugNames.has(item.drug_name);

      const matchesStrain =
        selectedStrainNames.size === 0 ||
        selectedStrainNames.has(item.mouse_strain_name);

      return (
        matchesTimepoint &&
        matchesGroup &&
        matchesOrganOrCellLine &&
        matchesDrug &&
        matchesStrain
      );
    });

    onFilteredDataChange(filtered);
    onFilterParamsChange?.({
      time_point_hours:
        selectedTimepoints.length > 0
          ? selectedTimepoints.join(",")
          : undefined,
      group_ids:
        selectedGroups.length > 0 ? selectedGroups.join(",") : undefined,
      organ_ids:
        selectedOrgans.length > 0 ? selectedOrgans.join(",") : undefined,
      cell_line_ids:
        selectedCellLines.length > 0 ? selectedCellLines.join(",") : undefined,
      experiment_drug_ids:
        selectedDrugs.length > 0 ? selectedDrugs.join(",") : undefined,
      mouse_strain_ids:
        selectedStrains.length > 0 ? selectedStrains.join(",") : undefined,
    });

    if (filtered.length === 0) {
      toast.warning(
        "No data matches the selected filters. Try adjusting your selections."
      );
    } else {
      toast.success(
        `Filters applied - ${filtered.length} data point${filtered.length !== 1 ? "s" : ""}`
      );
    }
  };

  const handleResetFilters = () => {
    const responseData = filtersData?.data;
    if (!responseData) {
      toast.error("No filter data available");
      return;
    }

    const {
      timepoints,
      mouse_groups,
      organs,
      cell_lines,
      experiment_drugs,
      mouse_strains,
    } = responseData;

    const resetParams: BiodistributionGraphParams = {
      time_point_hours: timepoints.length
        ? timepoints
            .map((t: BiodistributionTimepoint) => t.time_point_hours)
            .join(",")
        : undefined,
      group_ids: mouse_groups.length
        ? mouse_groups.map((g: BiodistributionMouseGroup) => g.id).join(",")
        : undefined,
      organ_ids: organs.length
        ? organs.map((o: BiodistributionOrgan) => o.id).join(",")
        : undefined,
      experiment_drug_ids: experiment_drugs.length
        ? experiment_drugs
            .map((d: BiodistributionExperimentDrug) => d.id)
            .join(",")
        : undefined,
      mouse_strain_ids: mouse_strains.length
        ? mouse_strains.map((s: BiodistributionMouseStrain) => s.id).join(",")
        : undefined,
      cell_line_ids: cell_lines.length
        ? cell_lines.map((c: BiodistributionCellLine) => c.id).join(",")
        : undefined,
    };

    setSelectedTimepoints(
      timepoints.map((t: BiodistributionTimepoint) => t.time_point_hours)
    );
    setSelectedGroups(mouse_groups.map((g: BiodistributionMouseGroup) => g.id));
    setSelectedOrgans(organs.map((o: BiodistributionOrgan) => o.id));
    setSelectedCellLines(cell_lines.map((c: BiodistributionCellLine) => c.id));
    setSelectedDrugs(
      experiment_drugs.map((d: BiodistributionExperimentDrug) => d.id)
    );
    setSelectedStrains(
      mouse_strains.map((s: BiodistributionMouseStrain) => s.id)
    );

    onFilteredDataChange(fullDataset);

    onFilterParamsChange?.(resetParams);
    toast.success(
      `Filters reset - showing all ${fullDataset.length} data points`
    );
  };

  const handleReferenceLineChange = () => {
    const newValue = parseFloat(inputValue);

    if (isNaN(newValue)) {
      toast.error("Please enter a valid number");
      return;
    }

    if (newValue < dataRange.min || newValue > dataRange.max) {
      toast.warning(
        `Reference line value (${newValue.toFixed(2)}) is outside data range (${dataRange.min.toFixed(2)} - ${dataRange.max.toFixed(2)}). ` +
          `The line will be adjusted to fit within the chart bounds.`,
        { duration: 5000 }
      );
    }

    onReferenceLineChange(newValue);
    toast.success(`Reference line set to ${newValue.toFixed(2)}%`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!filterOptions) return null;

  const hasTimepoints = filterOptions.timepoints.length > 0;
  const hasGroups = filterOptions.groups.length > 0;
  const hasOrgans = filterOptions.organs.length > 0;
  const hasCellLines = filterOptions.cellLines.length > 0;
  const hasDrugs = filterOptions.drugs.length > 0;
  const hasStrains = filterOptions.strains.length > 0;

  if (
    !hasTimepoints &&
    !hasGroups &&
    !hasOrgans &&
    !hasCellLines &&
    !hasDrugs &&
    !hasStrains
  ) {
    return (
      <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            No filters available
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          No filter options are available for this experiment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
      {/* Header with Expand/Collapse Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          variant="ghost"
          className="gap-2"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Expand
            </>
          )}
        </Button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Filter Controls Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-t border-border pt-4">
            {/* Reference Line Control */}
            <div className="flex items-end gap-2">
              <div className="space-y-1">
                <Label
                  htmlFor="reference-line"
                  className="text-xs text-muted-foreground"
                >
                  Reference Line (%ID/g)
                </Label>
                <Input
                  id="reference-line"
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleReferenceLineChange();
                    }
                  }}
                  placeholder="Enter value"
                  className="w-24 h-9"
                />
              </div>
              <Button
                onClick={handleReferenceLineChange}
                size="sm"
                variant="outline"
              >
                Update
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleResetFilters}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button onClick={handleApplyFilters} size="sm">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Data Range Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
            <div>
              <span className="font-medium">Current:</span>{" "}
              <span className="text-primary font-semibold">
                {referenceLineValue.toFixed(2)}%
              </span>
            </div>
            <div className="border-l border-border pl-4">
              <span className="font-medium">Average:</span>{" "}
              <span className="text-card-foreground">
                {dataRange.average.toFixed(2)}%
              </span>
            </div>
            <div className="border-l border-border pl-4">
              <span className="font-medium">Range:</span>{" "}
              <span className="text-card-foreground">
                {dataRange.min.toFixed(2)}% - {dataRange.max.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-border pt-4">
            {hasTimepoints && (
              <BiodistributionFilterDropdown
                label="Time Points"
                options={filterOptions.timepoints}
                selectedValues={selectedTimepoints}
                onSelectionChange={(values) =>
                  setSelectedTimepoints(values.map(Number))
                }
                placeholder="Select time points"
              />
            )}

            {hasGroups && (
              <BiodistributionFilterDropdown
                label="Mouse Groups"
                options={filterOptions.groups}
                selectedValues={selectedGroups}
                onSelectionChange={(values) =>
                  setSelectedGroups(values.map(Number))
                }
                placeholder="Select groups"
              />
            )}

            {hasOrgans && (
              <BiodistributionFilterDropdown
                label="Organs"
                options={filterOptions.organs}
                selectedValues={selectedOrgans}
                onSelectionChange={(values) =>
                  setSelectedOrgans(values.map(Number))
                }
                placeholder="Select organs"
              />
            )}

            {hasCellLines && (
              <BiodistributionFilterDropdown
                label="Cell Lines"
                options={filterOptions.cellLines}
                selectedValues={selectedCellLines}
                onSelectionChange={(values) =>
                  setSelectedCellLines(values.map(Number))
                }
                placeholder="Select cell lines"
              />
            )}

            {hasDrugs && (
              <BiodistributionFilterDropdown
                label="Drugs"
                options={filterOptions.drugs}
                selectedValues={selectedDrugs}
                onSelectionChange={(values) =>
                  setSelectedDrugs(values.map(Number))
                }
                placeholder="Select drugs"
              />
            )}

            {hasStrains && (
              <BiodistributionFilterDropdown
                label="Mouse Strains"
                options={filterOptions.strains}
                selectedValues={selectedStrains}
                onSelectionChange={(values) =>
                  setSelectedStrains(values.map(Number))
                }
                placeholder="Select strains"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
