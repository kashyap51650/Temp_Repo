import { Plus, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../Input/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Select/Select";

interface SelectOption {
  id: string;
  name: string;
  subtitle?: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  onCreateNew?: () => void;
  createNewLabel?: string;
  className?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  placeholder = "Select an option",
  onValueChange,
  onCreateNew,
  createNewLabel = "Create New",
  className,
  showSearch,
  searchPlaceholder = "Search...",
  disabled = false,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(q) ||
        option.subtitle?.toLowerCase().includes(q)
    );
  }, [options, query]);

  const shouldShowSearch =
    showSearch !== undefined ? showSearch : options.length > 5;

  return (
    <Select
      value={value}
      onValueChange={(v: string) => {
        if (v === "__CREATE_NEW__") {
          onCreateNew?.();
          return;
        }
        onValueChange(v);
      }}
      disabled={disabled}
    >
      <SelectTrigger
        size="lg"
        className={cn("w-full", className)}
        aria-label={placeholder}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="max-h-96">
        {shouldShowSearch && (
          <div className="flex items-center relative border-b px-3 pb-2 mb-2">
            <SearchIcon className="size-4 absolute shrink-0 opacity-50" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex h-8 w-full border-0 ml-4 shadow-none rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-0 focus-visible:ring-0"
            />
          </div>
        )}

        {filtered.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            <div>
              <div className="truncate">
                {option.name}
                {option.subtitle && (
                  <span className="ml-2 text-muted-foreground text-xs">
                    {option.subtitle}
                  </span>
                )}
              </div>
            </div>
          </SelectItem>
        ))}

        {onCreateNew && (
          <div className="mt-1 border-t pt-1">
            <SelectItem
              value="__CREATE_NEW__"
              className="text-primary focus:text-primary"
            >
              <span className="flex items-center gap-2">
                <Plus />
                {createNewLabel}
              </span>
            </SelectItem>
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
