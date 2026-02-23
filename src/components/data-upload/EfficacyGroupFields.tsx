import type { CellLine, MouseStrain } from "@/api";
import { doseFrequencyApi, dosesApi, experimentDrugApi } from "@/api";
import { marketDoseApi } from "@/api/MarketDoseApi";
import { Input, Label } from "@/components/atoms";
import { SearchableSelect } from "@/components/atoms/SearchableSelect/SearchableSelect";
import type { EfficacyGroup } from "@/hooks/useEfficacyFormState";

import { AsyncSelect } from "../molecules";

interface EfficacyGroupFieldsProps {
  group: EfficacyGroup;
  index: number;
  groupType: "buffer" | "market" | "normal";
  strainName?: string;
  selectedStrains?: MouseStrain[];
  selectedCellLines?: CellLine[];
  onUpdate: (index: number, field: keyof EfficacyGroup, value: number) => void;
  onCreateFrequency?: () => void;
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
  strainName,
  selectedStrains = [],
  selectedCellLines = [],
  onUpdate,
  onCreateFrequency,
  errors,
}: Readonly<EfficacyGroupFieldsProps>) {
  // Buffer group - only shows strain name
  if (groupType === "buffer") {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-sm text-muted-foreground">
          {strainName ? `Buffer of ${strainName}` : "Buffer Group"}
        </p>
      </div>
    );
  }

  // Market dose and Normal groups share most fields
  return (
    <>
      <div className="space-y-4">
        {/* Strain */}
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

        {/* Cell Line */}
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
              onUpdate(
                index,
                "cellLineId",
                Number.parseInt(value as string, 10)
              );
            }}
            placeholder="Select cell line"
            size="default"
          />
          {errors?.cellLineId && (
            <p className="text-sm text-red-500">{errors.cellLineId}</p>
          )}
        </div>
        {/*  Market Does - Only Applicable for Market Does Group */}
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
        {/* Drug Name */}
        <div className="space-y-2">
          <Label>Drug Name</Label>
          <AsyncSelect
            query={async () => {
              const response =
                await experimentDrugApi.getExperimentDrugsDropdown();
              return response.data || [];
            }}
            mapConfig={{
              labelKey: "drug_name" as const,
              valueKey: "id" as const,
            }}
            queryKey={["experiment-drugs-dropdown"]}
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
        {/* No of Doses */}
        <div className="space-y-2">
          <Label>No. of Doses</Label>
          <Input
            type="number"
            placeholder="Enter number of doses"
            min={1}
            value={group.noOfDoses || ""}
            onChange={(e) => {
              const value = e.target.value;
              onUpdate(index, "noOfDoses", Number(value));
            }}
          />
          {errors?.noOfDoses && (
            <p className="text-sm text-red-500">{errors.noOfDoses}</p>
          )}
        </div>
        {/* No of Mice */}
        <div className="space-y-2">
          <Label>No. of Mice</Label>
          <Input
            type="number"
            placeholder="Enter number of mice"
            min={1}
            value={group.noOfMice || ""}
            onChange={(e) => {
              const value = e.target.value;
              onUpdate(index, "noOfMice", Number(value));
            }}
          />
          {errors?.noOfMice && (
            <p className="text-sm text-red-500">{errors.noOfMice}</p>
          )}
        </div>
        {/* Radiation Dose Dropdown  */}
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
        {/* Dose Frequency Dropdown  */}
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
              onUpdate(
                index,
                "doseFrequencyId",
                Number.parseInt(value as string, 10)
              );
            }}
            placeholder="Select frequency"
            optionWithAll={false}
            searchable={false}
            onCreateNew={onCreateFrequency}
            shouldShowCreateNew
            size="default"
            refetchOnMount={false}
          />
          {errors?.doseFrequencyId && (
            <p className="text-sm text-red-500">{errors.doseFrequencyId}</p>
          )}
        </div>
      </div>
    </>
  );
}
