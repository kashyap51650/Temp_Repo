import { format, isBefore, isValid, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules";
import { Calendar } from "@/components/organisms/Calendar/Calendar";

import { ConfirmDateDialog } from "./ConfirmDateDialog";

function isValidDateString(value: string | undefined): boolean {
  if (!value) return false;
  const date = new Date(value);
  return isValid(date);
}

export function RandomizeDateCell({
  value,
  onChange,
  experimentDataId,
}: {
  value?: string;
  onChange?: (date: string) => void;
  experimentDataId?: string;
}) {
  const today = startOfDay(new Date());
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(() => {
    if (value && isValidDateString(value)) {
      return new Date(value);
    }
    return null;
  });
  const [pendingDate, setPendingDate] = useState<Date | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  function formatDate(date: Date) {
    if (!isValid(date)) {
      return "Select date";
    }
    return format(date, "MMMM do, yyyy");
  }

  function disabledDays(date: Date) {
    return isBefore(date, today);
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start flex items-center gap-2"
          >
            <CalendarIcon className="size-4 text-muted-foreground" />
            <span className="text-sm">
              {selected && isValid(selected)
                ? formatDate(selected)
                : "Select date"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-fit">
          <Calendar
            mode="single"
            selected={selected ?? undefined}
            onSelect={(date) => {
              if (
                date &&
                (!selected || date.toISOString() !== selected.toISOString())
              ) {
                setPendingDate(date);
                setShowConfirm(true);
              }
              setOpen(false);
            }}
            disabled={disabledDays}
          />
        </PopoverContent>
      </Popover>
      <ConfirmDateDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        pendingDate={pendingDate}
        experimentDataId={experimentDataId}
        onCancel={() => {
          setShowConfirm(false);
          setPendingDate(null);
        }}
        onConfirm={() => {
          if (pendingDate) {
            setSelected(pendingDate);
            if (onChange) onChange(pendingDate.toISOString());
          }
          setShowConfirm(false);
          setPendingDate(null);
        }}
      />
    </>
  );
}
