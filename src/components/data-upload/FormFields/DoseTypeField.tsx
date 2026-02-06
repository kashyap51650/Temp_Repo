import { type Control, type FieldValues, type Path } from "react-hook-form";

import { dosesApi } from "@/api";
import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";

interface DoseTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  multiple?: boolean;
}

export function DoseTypeField<T extends FieldValues>({
  control,
  name,
  multiple = false,
}: Readonly<DoseTypeFieldProps<T>>) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>Type of Dose</FormLabel>
          <FormSelect
            control={control}
            name={name}
            mapConfig={{
              labelKey: "name" as const,
              valueKey: "id" as const,
            }}
            query={async () => {
              const response = await dosesApi.getDosesDropdown();
              return response?.data ?? [];
            }}
            searchable={false}
            multiple={multiple}
            queryKey={["doses-dropdown"]}
            placeholder="Select dose types"
            valueAsNumber={true}
          />
        </FormItem>
      )}
    />
  );
}
