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
}: Readonly<DatePickerProps>) {
  const [open, setOpen] = React.useState(false);

  const parseDateString = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [selected, setSelected] = React.useState<Date | undefined>(
    parseDateString(value || "")
  );

  React.useEffect(() => {
    setSelected(parseDateString(value || ""));
  }, [value]);

  const handleSelect = (date?: Date) => {
    setSelected(date);
    setOpen(false);
    if (date && onChange) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${day}`);
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
