import { type Control, type FieldValues, type Path } from "react-hook-form";

import { experimentAntibodiesApi } from "@/api";
import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";

interface AntiBodyFieldProps<T extends FieldValues> {
  label?: string;
  control: Control<T>;
  name: Path<T>;
  multiple?: boolean;
}

export function AntiBodyField<T extends FieldValues>({
  label = "Type of Antibody",
  control,
  name,
  multiple = false,
}: Readonly<AntiBodyFieldProps<T>>) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormSelect
            control={control}
            name={name}
            mapConfig={{
              labelKey: "antibody_name" as const,
              valueKey: "id" as const,
            }}
            query={async () => {
              const response =
                await experimentAntibodiesApi.getExperimentAntibodiesDropdown();

              return response?.data ?? [];
            }}
            searchable={false}
            multiple={multiple}
            queryKey={["experiments-antibodies-dropdown"]}
            placeholder="Select antibody"
            valueAsNumber={true}
          />
        </FormItem>
      )}
    />
  );
}
