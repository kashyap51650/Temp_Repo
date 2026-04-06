import { Plus, Trash2 } from "lucide-react";

import type { CellLine, MouseStrain } from "@/api";
import { doseFrequencyApi, dosesApi, experimentDrugApi } from "@/api";
import { marketDoseApi } from "@/api/MarketDoseApi";
import { Button, Input, Label } from "@/components/atoms";
import { SearchableSelect } from "@/components/atoms/SearchableSelect/SearchableSelect";
import type { EfficacyGroup } from "@/hooks/useEfficacyFormState";

import { AsyncSelect } from "../molecules";

interface EfficacyGroupFieldsProps {
  group: EfficacyGroup;
  index: number;
  groupType: "buffer" | "market" | "normal";
  projectId: number;
  strainName?: string;
  selectedStrains?: MouseStrain[];
  selectedCellLines?: CellLine[];
  onUpdate: <K extends keyof EfficacyGroup>(
    index: number,
    field: K,
    value: EfficacyGroup[K]
  ) => void;
  onAddDose: (groupIndex: number) => void;
  onRemoveDose: (groupIndex: number, doseIndex: number) => void;
  onDoseChange: (groupIndex: number, doseIndex: number, value: string) => void;
  onCreateFrequency?: (groupIndex: number) => void;
  errors?: {
    strainId?: string;
    cellLineId?: string;
    experimentDrugId?: string;
    noOfDoses?: string;
    noOfMice?: string;
    radiationDoseId?: string;
    doseFrequencyId?: string;
    marketDoseId?: string;
  };
}

export function EfficacyGroupFields({
  group,
  index,
  groupType,
  projectId,
  strainName,
  selectedStrains = [],
  selectedCellLines = [],
  onUpdate,
  onAddDose,
  onRemoveDose,
  onDoseChange,
  onCreateFrequency,
  errors,
}: Readonly<EfficacyGroupFieldsProps>) {
  const doseValues =
    group.noOfDoses && group.noOfDoses.length > 0 ? group.noOfDoses : [0];

  return (
    <div className="space-y-4">
      {/* Buffer only: group description */}
      {groupType === "buffer" && (
        <p className="text-sm text-muted-foreground">
          {strainName ? `Buffer of ${strainName}` : "Buffer Group"}
        </p>
      )}

      {/* Non-buffer only: Strain */}
      {groupType !== "buffer" && (
        <div className="space-y-2">
          <Label>Select Strain</Label>
          <SearchableSelect
            options={selectedStrains.map((strain) => ({
              id: strain.id.toString(),
              label: strain.mouse_strain_name,
              value: strain.id.toString(),
            }))}
            value={group.strainId?.toString() || ""}
            onValueChange={(value) => {
              onUpdate(index, "strainId", Number.parseInt(value as string, 10));
            }}
            placeholder="Select strain"
            size="default"
          />
          {errors?.strainId && (
            <p className="text-sm text-red-500">{errors.strainId}</p>
          )}
        </div>
      )}

      {/* All: Cell Line */}
      <div className="space-y-2">
        <Label>Select Cell Line</Label>
        <SearchableSelect
          options={selectedCellLines.map((cellLine) => ({
            id: cellLine.id.toString(),
            label: cellLine.cell_line_name,
            value: cellLine.id.toString(),
          }))}
          value={group.cellLineId?.toString() || ""}
          onValueChange={(value) => {
            onUpdate(index, "cellLineId", Number.parseInt(value as string, 10));
          }}
          placeholder="Select cell line"
          size="default"
        />
        {errors?.cellLineId && (
          <p className="text-sm text-red-500">{errors.cellLineId}</p>
        )}
      </div>

      {/* Market only: Market Dose */}
      {groupType === "market" && (
        <div className="space-y-2">
          <Label>Select Market Dose</Label>
          <AsyncSelect
            query={async () => {
              const response = await marketDoseApi.getMarketDosesDropdown();
              return response.data || [];
            }}
            mapConfig={{
              labelKey: "market_dose_name" as const,
              valueKey: "id" as const,
            }}
            queryKey={["market-doses-dropdown"]}
            value={group.marketDoseId?.toString() || ""}
            onChange={(value) => {
              onUpdate(
                index,
                "marketDoseId",
                Number.parseInt(value as string, 10)
              );
            }}
            placeholder="Select market dose"
            optionWithAll={false}
            size="default"
            searchable={false}
          />
          {errors?.marketDoseId && (
            <p className="text-sm text-red-500">{errors.marketDoseId}</p>
          )}
        </div>
      )}

      {/* Non-buffer only: Drug Name */}
      {groupType !== "buffer" && (
        <div className="space-y-2">
          <Label>Drug Name</Label>
          <AsyncSelect
            query={async () => {
              const response =
                await experimentDrugApi.getExperimentDrugsDropdown(projectId);
              return response.data || [];
            }}
            mapConfig={{
              labelKey: "drug_display_name" as const,
              valueKey: "id" as const,
            }}
            queryKey={["experiments-drugs-dropdown", projectId.toString()]}
            value={group.experimentDrugId?.toString() || ""}
            onChange={(value) => {
              onUpdate(
                index,
                "experimentDrugId",
                Number.parseInt(value as string, 10)
              );
            }}
            placeholder="Select drug name"
            optionWithAll={false}
            size="default"
            searchable={false}
            refetchOnMount={false}
          />
          {errors?.experimentDrugId && (
            <p className="text-sm text-red-500">{errors.experimentDrugId}</p>
          )}
        </div>
      )}

      {/* All: No. of Doses */}
      <div className="space-y-2">
        <Label>No. of Doses</Label>
        <div className="space-y-2">
          {doseValues.map((dose, doseIndex) => (
            <div
              key={`dose-${index}-${doseIndex}`}
              className="flex items-center gap-2"
            >
              <Input
                type="number"
                placeholder="Enter dose"
                min={1}
                value={dose > 0 ? dose : ""}
                onChange={(e) => {
                  onDoseChange(index, doseIndex, e.target.value);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onRemoveDose(index, doseIndex)}
                disabled={doseValues.length <= 1}
                aria-label="Delete dose"
              >
                <Trash2 className="size-4" />
              </Button>
              {doseIndex === doseValues.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onAddDose(index)}
                  aria-label="Add dose"
                >
                  <Plus className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {errors?.noOfDoses && (
          <p className="text-sm text-red-500">{errors.noOfDoses}</p>
        )}
      </div>

      {/* All: No. of Mice */}
      <div className="space-y-2">
        <Label>No. of Mice</Label>
        <Input
          type="number"
          placeholder="Enter number of mice"
          min={1}
          value={group.noOfMice || ""}
          onChange={(e) => {
            onUpdate(index, "noOfMice", Number(e.target.value));
          }}
        />
        {errors?.noOfMice && (
          <p className="text-sm text-red-500">{errors.noOfMice}</p>
        )}
      </div>

      {/* Non-buffer only: Radiation Dose */}
      {groupType !== "buffer" && (
        <div className="space-y-2">
          <Label>Radiation Dose</Label>
          <AsyncSelect
            query={async () => {
              const response = await dosesApi.getDosesDropdown();
              return response.data || [];
            }}
            mapConfig={{
              labelKey: "name" as const,
              valueKey: "id" as const,
            }}
            queryKey={["radiation-doses-dropdown"]}
            value={group.radiationDoseId?.toString() || ""}
            onChange={(value) => {
              onUpdate(
                index,
                "radiationDoseId",
                Number.parseInt(value as string, 10)
              );
            }}
            placeholder="Select radiation dose"
            optionWithAll={false}
            searchable={false}
            size="default"
            refetchOnMount={false}
          />
          {errors?.radiationDoseId && (
            <p className="text-sm text-red-500">{errors.radiationDoseId}</p>
          )}
        </div>
      )}

      {/* All: Frequency */}
      <div className="space-y-2">
        <Label>Frequency</Label>
        <AsyncSelect
          query={async () => {
            const response =
              await doseFrequencyApi.getDoseFrequenciesDropdown();
            return response.data || [];
          }}
          mapConfig={{
            labelKey: "frequency_code" as const,
            valueKey: "id" as const,
          }}
          queryKey={["dose-frequencies-dropdown"]}
          value={group.doseFrequencyId?.toString() || ""}
          onChange={(value) => {
            const parsed = Number.parseInt(value as string, 10);
            if (!Number.isNaN(parsed)) {
              onUpdate(index, "doseFrequencyId", parsed);
            }
          }}
          placeholder="Select frequency"
          optionWithAll={false}
          searchable={false}
          onCreateNew={() => onCreateFrequency?.(index)}
          shouldShowCreateNew
          size="default"
          refetchOnMount={false}
        />
        {errors?.doseFrequencyId && (
          <p className="text-sm text-red-500">{errors.doseFrequencyId}</p>
        )}
      </div>
    </div>
  );
}
