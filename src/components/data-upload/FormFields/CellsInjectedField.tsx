import { type Control, type FieldValues, type Path } from "react-hook-form";

import { cellInjectionCountsApi } from "@/api";
import { FormSelect } from "@/components/molecules/FormSelect";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/organisms/Form/Form";

interface CellsInjectedFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  multiple?: boolean;
}

export function CellsInjectedField<T extends FieldValues>({
  control,
  name,
  multiple = false,
}: Readonly<CellsInjectedFieldProps<T>>) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>Cells Injected</FormLabel>
          <FormSelect
            control={control}
            name={name}
            mapConfig={{
              labelKey: "value",
              valueKey: "id",
            }}
            query={async () => {
              const response =
                await cellInjectionCountsApi.getCellInjectionCounts();
              return response.data?.items ?? [];
            }}
            searchable={false}
            multiple={multiple}
            queryKey={["cell-injection-counts-dropdown"]}
            placeholder={"Select cells injected"}
            valueAsNumber={true}
          />
        </FormItem>
      )}
    />
  );
}
