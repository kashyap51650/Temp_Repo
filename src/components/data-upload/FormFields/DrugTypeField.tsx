import { type Control, type FieldValues, type Path } from "react-hook-form";

import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";
import { drugTypeOptions } from "@/data/experiments";

interface DrugTypeFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

export function DrugTypeField<T extends FieldValues>({
  control,
  name,
}: Readonly<DrugTypeFieldProps<T>>) {
  const drugTypeData = drugTypeOptions.map((option) => ({
    id: option.value,
    drug_type_name: option.label,
  }));

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>Type of Drug</FormLabel>
          <FormSelect
            control={control}
            name={name}
            mapConfig={{
              labelKey: "drug_type_name" as const,
              valueKey: "id" as const,
            }}
            query={async () => drugTypeData}
            searchable={false}
            queryKey={["drug-types-dropdown"]}
            placeholder="Select drug types"
          />
        </FormItem>
      )}
    />
  );
}
