import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules";
import { Calendar } from "@/components/organisms/Calendar/Calendar";

export function RandomizeDateCell({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (date: string) => void;
}) {
  const today = startOfDay(new Date());
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(
    value ? new Date(value) : today
  );

  function formatDate(date: Date) {
    return format(date, "MMMM do, yyyy");
  }

  function disabledDays(date: Date) {
    return isBefore(date, today);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start flex items-center gap-2"
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          <span className="text-sm">
            {selected ? formatDate(selected) : formatDate(today)}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 w-fit">
        <Calendar
          mode="single"
          selected={selected ?? undefined}
          onSelect={(date) => {
            setSelected(date ?? null);
            if (date && onChange) onChange(date.toISOString());
            setOpen(false);
          }}
          disabled={disabledDays}
        />
      </PopoverContent>
    </Popover>
  );
}
