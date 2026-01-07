import { type Control, type FieldValues, type Path } from "react-hook-form";

import { CalendarDatePicker } from "../../organisms";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../organisms/Form/Form";

interface InjectionDateFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function InjectionDateField<T extends FieldValues>({
  control,
  name,
  label = "Cell Injection Date",
  placeholder = "Pick a date",
}: InjectionDateFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <CalendarDatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder={placeholder}
              disablePastDates={false}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
