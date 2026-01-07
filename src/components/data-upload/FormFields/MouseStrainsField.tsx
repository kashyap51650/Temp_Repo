import { type Control, type FieldValues, type Path } from "react-hook-form";

import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";
import { mouseStrainApi } from "@/lib/api";

interface MouseStrainsFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

export function MouseStrainsField<T extends FieldValues>({
  control,
  name,
}: MouseStrainsFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>Mouse Strains</FormLabel>
          <FormSelect
            control={control}
            name={name}
            mapConfig={{
              labelKey: "mouse_strain_name",
              valueKey: "id",
            }}
            query={async () => {
              const response = await mouseStrainApi.getMouseStrains();
              return response.data || [];
            }}
            searchable={false}
            queryKey={["mouse-strains-dropdown"]}
            placeholder="Select mouse strains"
          />
        </FormItem>
      )}
    />
  );
}
