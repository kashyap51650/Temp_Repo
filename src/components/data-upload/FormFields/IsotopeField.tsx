import { type Control, type FieldValues, type Path } from "react-hook-form";

import { isotopeApi } from "@/api";
import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";

interface IsotopeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

export function IsotopeField<T extends FieldValues>({
  control,
  name,
}: Readonly<IsotopeFieldProps<T>>) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>Isotope</FormLabel>
          <FormSelect
            control={control}
            name={name}
            mapConfig={{
              labelKey: "isotope_name",
              valueKey: "id",
            }}
            query={async () => {
              const response = await isotopeApi.getIsotopes();
              return response.data || [];
            }}
            searchable={false}
            queryKey={["isotopes-dropdown"]}
            placeholder={"Select isotope"}
          />
        </FormItem>
      )}
    />
  );
}
