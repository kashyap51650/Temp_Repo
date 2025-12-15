import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/atoms/Button/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules";
import { Calendar } from "@/components/organisms/Calendar/Calendar";

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  React.useEffect(() => {
    if (value) setSelected(new Date(value));
  }, [value]);

  const handleSelect = (date?: Date) => {
    setSelected(date);
    setOpen(false);
    if (date && onChange) {
      onChange(date.toISOString().slice(0, 10));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={
            "w-full justify-start text-left font-normal flex items-center gap-2 " +
            (className || "")
          }
          disabled={disabled}
        >
          <span className="flex-1">
            {selected ? (
              format(selected, "yyyy-MM-dd")
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <CalendarIcon className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  );
}
