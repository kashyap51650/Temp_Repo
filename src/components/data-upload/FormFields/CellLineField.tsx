import { type Control, type FieldValues, type Path } from "react-hook-form";

import { Label } from "@/components/atoms";
import { AsyncSelect } from "@/components/molecules/AsyncSelect";
import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";
import { cellLineApi } from "@/lib/api";

interface CellLineFieldPropsWithForm<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  value?: never;
  onChange?: never;
}

interface CellLineFieldPropsWithValue {
  control?: never;
  name?: never;
  value: number | null;
  onChange: (value: number | null) => void;
  hideLabel?: boolean;
  size?: "sm" | "default" | "lg";
  experimentId?: string;
}

type CellLineFieldProps<T extends FieldValues = Record<string, never>> =
  | CellLineFieldPropsWithForm<T>
  | CellLineFieldPropsWithValue;

export function CellLineField<T extends FieldValues = Record<string, never>>(
  props: CellLineFieldProps<T>
) {
  // Mode 1: With react-hook-form control
  if ("control" in props && props.control) {
    return (
      <FormField
        control={props.control}
        name={props.name}
        render={() => (
          <FormItem className="w-full mb-0">
            <FormLabel>Cell Line</FormLabel>
            <FormSelect
              control={props.control}
              name={props.name}
              mapConfig={{
                labelKey: "cell_line_name" as const,
                valueKey: "id" as const,
              }}
              query={async () => {
                const response = await cellLineApi.getCellLines();
                return response.data || [];
              }}
              searchable={false}
              queryKey={["cell-lines-dropdown"]}
              placeholder="Select cell line"
              valueAsNumber={true}
            />
          </FormItem>
        )}
      />
    );
  }

  // Mode 2: With value/onChange props
  const { value, onChange, hideLabel, size, experimentId } =
    props as CellLineFieldPropsWithValue;
  return (
    <div className="flex flex-col w-full">
      {!hideLabel && <Label className="mb-1">Cell Line</Label>}
      <AsyncSelect
        value={value ? String(value) : undefined}
        onChange={(newValue) => {
          onChange(newValue ? Number(newValue as string) : null);
        }}
        mapConfig={{
          labelKey: "cell_line_name" as const,
          valueKey: "id" as const,
        }}
        query={async () => {
          const response = await cellLineApi.getCellLines(experimentId);
          return response.data || [];
        }}
        searchable={false}
        queryKey={["cell-lines-dropdown", experimentId ?? ""]}
        placeholder="Select cell line"
        size={size}
        optionWithAll={false}
      />
    </div>
  );
}
