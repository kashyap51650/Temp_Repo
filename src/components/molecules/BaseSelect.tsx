import type { SelectOption } from "@/types/utils";

import { SearchableSelect } from "../atoms/SearchableSelect/SearchableSelect";

interface BaseSelectProps {
  value?: string;
  options: SelectOption[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  isMulti?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  id?: string;
}
export function BaseSelect({
  value,
  options,
  onChange,
  isLoading,
  placeholder = "Select...",
  disabled = false,
  searchable = false,
  id,
}: Readonly<BaseSelectProps>) {
  if (isLoading)
    return <div className="h-10 bg-muted rounded-md animate-pulse" />;

  return (
    <SearchableSelect
      options={options}
      value={value}
      placeholder={placeholder}
      onValueChange={onChange}
      className=""
      searchPlaceholder="Search..."
      showSearch={searchable}
      disabled={disabled}
      size="lg"
      id={id}
    />
  );
}
