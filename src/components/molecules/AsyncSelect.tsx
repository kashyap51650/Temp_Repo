import { useQuery } from "@tanstack/react-query";

import { SELECT_ALL } from "@/lib/constants";
import { mapToOptions } from "@/lib/utils";

import { SearchableSelect } from "../atoms/SearchableSelect/SearchableSelect";

interface AsyncSelectProps<T> {
  query: () => Promise<T[]>;
  mapConfig: {
    labelKey: keyof T;
    valueKey: keyof T;
  };
  value?: string;
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  queryKey?: string[];
  optionWithAll?: boolean;
  allLabel?: string;
  searchable?: boolean;
}

export function AsyncSelect<T>({
  query,
  mapConfig,
  queryKey = ["dropdown"],
  optionWithAll = true,
  allLabel = "All ",
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  searchable = true,
}: AsyncSelectProps<T>) {
  const { data = [], isLoading } = useQuery({
    queryKey,
    queryFn: query,
  });

  const options = mapToOptions(data, mapConfig);

  // Add "All" option at the beginning
  const optionsWithAll = optionWithAll
    ? [{ id: SELECT_ALL, label: allLabel, value: SELECT_ALL }, ...options]
    : options;

  return (
    <SearchableSelect
      options={optionsWithAll}
      value={value}
      placeholder={placeholder}
      onValueChange={onChange}
      className=""
      searchPlaceholder="Search..."
      showSearch={searchable}
      disabled={disabled || isLoading}
    />
  );
}
