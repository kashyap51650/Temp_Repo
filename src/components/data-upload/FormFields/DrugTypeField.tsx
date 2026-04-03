import { type Control, type FieldValues, type Path } from "react-hook-form";

import { experimentDrugApi } from "@/api";
import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";

interface DrugTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  multiple?: boolean;
  projectId?: number;
}

export function DrugTypeField<T extends FieldValues>({
  control,
  name,
  multiple = false,
  projectId,
}: Readonly<DrugTypeFieldProps<T>>) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>Type of Drug</FormLabel>
          <FormSelect
            control={control}
            name={name}
            mapConfig={{
              labelKey: "drug_display_name" as const,
              valueKey: "id" as const,
            }}
            query={async () => {
              const response =
                await experimentDrugApi.getExperimentDrugsDropdown(projectId);

              return response?.data ?? [];
            }}
            searchable={false}
            multiple={multiple}
            queryKey={[
              "experiments-drugs-dropdown",
              projectId?.toString() ?? "all",
            ]}
            placeholder="Select drug types"
            valueAsNumber={true}
          />
        </FormItem>
      )}
    />
  );
}
