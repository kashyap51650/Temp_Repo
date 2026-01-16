import { type Control, type FieldValues, type Path } from "react-hook-form";

import { Input } from "../../atoms";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../organisms/Form/Form";

interface ExperimentNameFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
}

export function ExperimentNameField<T extends FieldValues>({
  control,
  name,
  label = "Experiment Name",
  placeholder = "Enter experiment name",
}: Readonly<ExperimentNameFieldProps<T>>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="text"
              {...field}
              placeholder={placeholder}
              className="w-full"
              size="lg"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
