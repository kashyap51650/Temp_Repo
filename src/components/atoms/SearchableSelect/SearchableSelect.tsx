import { Plus, SearchIcon, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { SelectOption } from "@/types/utils";

import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Select/Select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip/Tooltip";

type SearchableSelectProps<TMultiple extends boolean = false> = {
  options: SelectOption[];
  value?: TMultiple extends true ? string[] : string;
  placeholder?: string;
  onValueChange: TMultiple extends true
    ? (value: string[]) => void
    : (value: string) => void;
  onCreateNew?: () => void;
  createNewLabel?: string;
  className?: string;
  showSearch?: boolean;
  size?: "sm" | "default" | "lg";
  searchPlaceholder?: string;
  disabled?: boolean;
  multiple?: TMultiple;
};

export function SearchableSelect<TMultiple extends boolean = false>({
  options,
  value,
  placeholder = "Select an option",
  onValueChange,
  onCreateNew,
  createNewLabel = "Create New",
  className,
  showSearch,
  size = "lg",
  searchPlaceholder = "Search...",
  disabled = false,
  multiple = false as TMultiple,
}: SearchableSelectProps<TMultiple>) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ALLOW_BUBBLE = ["ArrowUp", "ArrowDown", "Enter", "Tab"];

  const selectedValues: string[] =
    multiple && Array.isArray(value) ? value : [];
  const singleValue = !multiple && typeof value === "string" ? value : "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) ||
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

      if (multiple) {
        const currentValues: string[] = Array.isArray(value) ? value : [];

        if (currentValues.includes(v)) {
          (onValueChange as (value: string[]) => void)(
            currentValues.filter((val) => val !== v)
          );
        } else {
          (onValueChange as (value: string[]) => void)([...currentValues, v]);
        }

        // Don't close the dropdown for multiple selection
      } else {
        (onValueChange as (value: string) => void)(v);
        setIsOpen(false);
      }
      setQuery("");
    },
    [onValueChange, onCreateNew, multiple, value]
  );

  const handleRemoveValue = useCallback(
    (valueToRemove: string) => {
      if (multiple && Array.isArray(value)) {
        (onValueChange as (value: string[]) => void)(
          value.filter((v) => v !== valueToRemove)
        );
      }
    },
    [multiple, value, onValueChange]
  );

  useEffect(() => {
    if (isOpen && shouldShowSearch) {
      const interval = setInterval(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isOpen, shouldShowSearch]);

  if (multiple) {
    return (
      <div className="space-y-1">
        <Select
          value={""}
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
            <SelectValue placeholder={placeholder} className="text-xs">
              {selectedValues.length > 0
                ? `${selectedValues.length} selected`
                : placeholder}
            </SelectValue>
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
                    onKeyDownCapture={(e) => {
                      if (!ALLOW_BUBBLE.includes(e.key)) {
                        e.stopPropagation();
                      }
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
                    <SelectItem key={option.id} value={option.value}>
                      <div className="truncate">
                        {option.label}
                        {selectedValues.includes(option.value) && " ✓"}
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

        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 text-xs items-center">
            {(() => {
              const maxToShow = 3;
              const selectedOpts = options.filter((opt) =>
                selectedValues.includes(opt.value)
              );
              const shown = selectedOpts.slice(0, maxToShow);
              const hidden = selectedOpts.slice(maxToShow);
              return (
                <>
                  {shown.map((opt) => (
                    <span
                      key={opt.value}
                      className="flex items-center bg-muted px-2 mt-2 rounded gap-1 group"
                    >
                      {opt.label}
                      <Button
                        type="button"
                        aria-label={`Remove ${opt.label}`}
                        size="icon-sm"
                        variant="ghost"
                        className="w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveValue(opt.value);
                        }}
                        tabIndex={0}
                      >
                        <X className="size-3 text-muted-foreground group-hover:text-destructive" />
                      </Button>
                    </span>
                  ))}
                  {hidden.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon-sm"
                          className="mt-2 bg-muted text-muted-foreground rounded-xs"
                          variant="ghost"
                        >
                          +{hidden.length}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={4}>
                        <div className="flex flex-col gap-1">
                          {hidden.map((opt) => (
                            <span key={opt.value}>{opt.label}</span>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    );
  }

  return (
    <Select
      value={singleValue}
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
                onKeyDownCapture={(e) => {
                  if (!ALLOW_BUBBLE.includes(e.key)) {
                    e.stopPropagation();
                  }
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
                <SelectItem key={option.id} value={option.value}>
                  <div className="truncate">
                    {option.label}
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
