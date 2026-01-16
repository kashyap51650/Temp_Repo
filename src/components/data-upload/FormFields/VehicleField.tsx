import { type Control, type FieldValues, type Path } from "react-hook-form";

import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";
import { vehiclesDropdownApi } from "@/lib/api";

interface VehicleFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
}

export function VehicleField<T extends FieldValues>({
  control,
  name,
  label = "Vehicles",
  placeholder = "Select vehicle",
  multiple = true,
}: Readonly<VehicleFieldProps<T>>) {
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
              labelKey: "vehicle_name",
              valueKey: "id",
            }}
            query={async () => {
              const response = await vehiclesDropdownApi.getVehiclesDropdown();
              return response.data?.vehicles || [];
            }}
            searchable={false}
            queryKey={["vehicles-dropdown"]}
            placeholder={placeholder}
            multiple={multiple}
            valueAsNumber={true}
          />
        </FormItem>
      )}
    />
  );
}
