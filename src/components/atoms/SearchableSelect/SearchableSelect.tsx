import { Plus, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  size?: "sm" | "default" | "lg";
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
  size = "default",
  searchPlaceholder = "Search...",
  disabled = false,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  const handleValueChange = useCallback(
    (v: string) => {
      if (v === "__CREATE_NEW__") {
        onCreateNew?.();
        return;
      }
      onValueChange(v);
      setQuery("");
      setIsOpen(false);
    },
    [onValueChange, onCreateNew]
  );

  useEffect(() => {
    if (isOpen && shouldShowSearch && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen, shouldShowSearch]);

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      disabled={disabled}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger
        size={size}
        className={cn("w-full", className)}
        aria-label={placeholder}
      >
        <SelectValue placeholder={placeholder} className="text-xs" />
      </SelectTrigger>

      <SelectContent className="max-h-96 relative p-0">
        {shouldShowSearch && (
          <div className="sticky top-0 z-10 bg-background border-b px-3 pb-2 pt-0">
            <div className="flex items-center relative">
              <SearchIcon className="size-4 absolute shrink-0 opacity-50" />
              <Input
                ref={inputRef}
                value={query}
                onChange={handleQueryChange}
                placeholder={searchPlaceholder}
                className="flex h-8 w-full border-0 ml-4 shadow-none rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-0 focus-visible:ring-0"
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
          </div>
        )}

        <div
          className="max-h-64 overflow-y-auto px-0 py-1"
          style={{ scrollbarGutter: "stable" }}
        >
          {filtered.length > 0
            ? filtered.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="truncate">
                    {option.name}
                    {option.subtitle && (
                      <span className="ml-2 text-muted-foreground text-xs">
                        {option.subtitle}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))
            : query && (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No results found for &quot;{query}&quot;
                </div>
              )}
        </div>
        {onCreateNew && (
          <div className="sticky bottom-0 z-10 bg-background border-t pt-1">
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
