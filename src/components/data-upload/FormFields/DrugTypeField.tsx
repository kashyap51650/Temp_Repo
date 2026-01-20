import { type Control, type FieldValues, type Path } from "react-hook-form";

import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";
import { experimentDrugApi } from "@/lib/api";

interface DrugTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  multiple?: boolean;
}

export function DrugTypeField<T extends FieldValues>({
  control,
  name,
  multiple = false,
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
              labelKey: "drug_name" as const,
              valueKey: "id" as const,
            }}
            query={async () => {
              const response =
                await experimentDrugApi.getExperimentDrugsDropdown();

              return response?.data ?? [];
            }}
            searchable={false}
            multiple={multiple}
            queryKey={["experiments-drugs-dropdown"]}
            placeholder="Select drug types"
            valueAsNumber={true}
          />
        </FormItem>
      )}
    />
  );
}
