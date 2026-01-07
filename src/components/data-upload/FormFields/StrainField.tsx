import { type Control, type FieldValues, type Path } from "react-hook-form";

import { Label } from "@/components/atoms";
import { AsyncSelect } from "@/components/molecules/AsyncSelect";
import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";
import { mouseStrainApi } from "@/lib/api";

interface StrainFieldPropsWithForm<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  value?: never;
  onChange?: never;
}

interface StrainFieldPropsWithValue {
  control?: never;
  name?: never;
  value: number | null;
  onChange: (value: number | null) => void;
}

type StrainFieldProps<T extends FieldValues = Record<string, never>> =
  | StrainFieldPropsWithForm<T>
  | StrainFieldPropsWithValue;

export function StrainField<T extends FieldValues = Record<string, never>>(
  props: StrainFieldProps<T>
) {
  // Mode 1: With react-hook-form control
  if ("control" in props && props.control) {
    return (
      <FormField
        control={props.control}
        name={props.name}
        render={() => (
          <FormItem className="w-full mb-0">
            <FormLabel>Strain</FormLabel>
            <FormSelect
              control={props.control}
              name={props.name}
              mapConfig={{
                labelKey: "mouse_strain_name" as const,
                valueKey: "id" as const,
              }}
              query={async () => {
                const response = await mouseStrainApi.getMouseStrains();
                return response.data || [];
              }}
              searchable={false}
              queryKey={["strains-dropdown"]}
              placeholder={"Select strain"}
              valueAsNumber={true}
            />
          </FormItem>
        )}
      />
    );
  }

  // Mode 2: With value/onChange props
  const { value, onChange } = props as StrainFieldPropsWithValue;
  return (
    <div className="flex flex-col w-full">
      <Label className="mb-1">Strain</Label>
      <AsyncSelect
        value={value ? String(value) : undefined}
        onChange={(newValue) => {
          onChange(newValue ? Number(newValue as string) : null);
        }}
        mapConfig={{
          labelKey: "mouse_strain_name" as const,
          valueKey: "id" as const,
        }}
        query={async () => {
          const response = await mouseStrainApi.getMouseStrains();
          return response.data || [];
        }}
        searchable={false}
        queryKey={["strains-dropdown"]}
        placeholder={"Select strain"}
      />
    </div>
  );
}
