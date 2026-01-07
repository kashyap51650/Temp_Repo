import { type Control, Controller } from "react-hook-form";

import { AsyncSelect } from "./AsyncSelect";

interface FormSelectProps<T> {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  query: () => Promise<T[]>;
  mapConfig: {
    labelKey: keyof T;
    valueKey: keyof T;
  };
  searchable?: boolean;
  queryKey?: string[];
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  valueAsNumber?: boolean; // New prop to convert values to numbers
}
export function FormSelect<T>({
  name,
  control,
  searchable,
  valueAsNumber = false,
  ...rest
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Convert field value to string for display
        let displayValue: string | string[] | undefined;

        if (field.value === undefined || field.value === null) {
          displayValue = undefined;
        } else if (valueAsNumber) {
          // Convert number(s) to string(s) for display
          if (Array.isArray(field.value)) {
            displayValue = field.value.map((v) => String(v));
          } else {
            displayValue = String(field.value);
          }
        } else {
          // Already a string, pass through
          displayValue = field.value;
        }

        return (
          <>
            <AsyncSelect
              value={displayValue}
              onChange={(value) => {
                // Convert to number if valueAsNumber is true
                if (valueAsNumber) {
                  if (Array.isArray(value)) {
                    field.onChange(value.map((v) => Number(v)));
                  } else {
                    field.onChange(Number(value));
                  }
                } else {
                  field.onChange(value);
                }
              }}
              searchable={searchable}
              optionWithAll={false}
              {...rest}
            />
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </>
        );
      }}
    />
  );
}
