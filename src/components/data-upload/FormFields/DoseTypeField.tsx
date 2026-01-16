import { type Control, type FieldValues, type Path } from "react-hook-form";

import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";
import { doseTypeOptions } from "@/data/experiments";

interface DoseTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

export function DoseTypeField<T extends FieldValues>({
  control,
  name,
}: Readonly<DoseTypeFieldProps<T>>) {
  const doseTypeData = doseTypeOptions.map((option) => ({
    id: option.value,
    dose_type_name: option.label,
  }));

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
              labelKey: "dose_type_name" as const,
              valueKey: "id" as const,
            }}
            query={async () => doseTypeData}
            searchable={false}
            queryKey={["dose-types-dropdown"]}
            placeholder="Select dose types"
          />
        </FormItem>
      )}
    />
  );
}
