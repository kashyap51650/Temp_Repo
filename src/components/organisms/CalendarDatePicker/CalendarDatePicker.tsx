"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/Popover/Popover";
import { Calendar } from "@/components/organisms/Calendar/Calendar";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !Number.isNaN(date.getTime());
}

export function CalendarDatePicker({
  id = "date",
  placeholder = "June 01, 2025",
  value: initialValue,
  onChange,
  disablePastDates = false,
}: Readonly<{
  id?: string;
  placeholder?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disablePastDates?: boolean;
}>) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initialValue);
  const [month, setMonth] = React.useState<Date | undefined>(initialValue);
  const [value, setValue] = React.useState(formatDate(initialValue));

  const currentYear = new Date().getFullYear();
  const fromYear = disablePastDates ? currentYear : currentYear - 100;
  const toYear = currentYear + 15;

  React.useEffect(() => {
    setDate(initialValue);
    setMonth(initialValue);
    setValue(formatDate(initialValue));
  }, [initialValue]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id={id}
          value={value}
          size="lg"
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={(e) => {
            const d = new Date(e.target.value);
            setValue(e.target.value);
            if (isValidDate(d)) {
              setDate(d);
              setMonth(d);
              onChange?.(d);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              startMonth={new Date(fromYear, 0)}
              endMonth={new Date(toYear, 0)}
              onSelect={(d: Date | undefined) => {
                setDate(d);
                setValue(formatDate(d));
                setOpen(false);
                onChange?.(d);
              }}
              disabled={
                disablePastDates
                  ? (date: Date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }
                  : undefined
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
