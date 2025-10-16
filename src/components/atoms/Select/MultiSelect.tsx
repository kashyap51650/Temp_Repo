import { ChevronDown, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/atoms/Badge/Badge";
import { Button } from "@/components/atoms/Button/Button";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import { Label } from "@/components/atoms/Label/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/Popover/Popover";

interface MultiSelectOption {
  id: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options",
  className = "",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const handleToggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`w-full min-h-[2.5rem] flex-wrap pr-8 items-start relative !h-auto !whitespace-normal justify-between text-left ${className}`}
          aria-haspopup="listbox"
        >
          <div className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-x-auto max-h-24">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground truncate text-base">
                {placeholder}
              </span>
            ) : (
              selectedOptions.map((option) => (
                <Badge
                  key={option.id}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1 mb-1"
                >
                  {option.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggle(option.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            )}
          </div>
          <ChevronDown className="ml-2 text-muted-foreground shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[12rem] max-h-64 overflow-y-auto p-2 z-50"
        align="start"
      >
        <div className="flex flex-col gap-1">
          {options.map((option) => (
            <Label
              key={option.id}
              className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-muted"
            >
              <Checkbox
                checked={value.includes(option.id)}
                onCheckedChange={() => handleToggle(option.id)}
                className="shrink-0"
              />
              <span className="text-sm truncate flex-1">{option.label}</span>
            </Label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
