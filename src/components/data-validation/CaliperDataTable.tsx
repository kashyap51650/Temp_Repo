import { useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/Table/Table";
import { cn } from "@/lib/utils";

export interface MouseData {
  mouse_id: number;
  group: string;
  mouse_code: string;
}

export interface Measurement {
  width_mm: number;
  length_mm: number;
  volume_mm3: number;
}

export interface CaliperData {
  caliper_measurements_dates: string[];
  mouse_data_by_delivery_id: Record<string, MouseData>;
  caliper_measurements: Record<
    string,
    Record<string, Record<string, Measurement>>
  >;
}

export interface CaliperDataTableProps {
  data: CaliperData;
}

export function CaliperDataTable({ data }: CaliperDataTableProps) {
  const {
    caliper_measurements_dates,
    mouse_data_by_delivery_id,
    caliper_measurements,
  } = data;

  const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day}-${months[parseInt(month) - 1]}-${year}`;
  };

  const dayNumbers = useMemo(() => {
    const firstDate = new Date(
      caliper_measurements_dates[0].split("/").reverse().join("-")
    );
    return caliper_measurements_dates.map((dateStr) => {
      const currentDate = new Date(dateStr.split("/").reverse().join("-"));
      const diffTime = Math.abs(currentDate.getTime() - firstDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1;
    });
  }, [caliper_measurements_dates]);

  const getCellColorClass = (value: number): string => {
    if (value > 900) return "bg-red-100 text-red-800 border-red-200";
    if (value > 300) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (value > 150) return "bg-green-100 text-green-800 border-green-200";
    return "";
  };

  const groupedMice = useMemo(() => {
    const groups: Record<
      string,
      {
        deliveryId: string;
        mouseData: (typeof mouse_data_by_delivery_id)[string];
      }[]
    > = {};
    Object.entries(mouse_data_by_delivery_id).forEach(
      ([deliveryId, mouseData]) => {
        if (!groups[mouseData.group]) {
          groups[mouseData.group] = [];
        }
        groups[mouseData.group].push({ deliveryId, mouseData });
      }
    );
    return groups;
  }, [mouse_data_by_delivery_id]);

  return (
    <div className="w-full overflow-x-auto overflow-y-auto max-h-[60vh] rounded-lg border">
      <Table className="min-w-4xl border-collapse text-sm">
        <TableHeader className="sticky top-0 z-10 bg-muted">
          <TableRow className="border-b-2">
            <TableHead className="text-left font-medium bg-muted border h-9!">
              Date
            </TableHead>
            {caliper_measurements_dates.map((date) => (
              <TableHead
                key={date}
                className="text-center font-semibold bg-muted border h-9! min-w-24"
              >
                {formatDate(date)}
              </TableHead>
            ))}
          </TableRow>

          <TableRow className="border-b-2">
            <TableHead className="text-left font-bold bg-muted border h-9!">
              Mouse ID
            </TableHead>
            {dayNumbers.map((day, idx) => (
              <TableHead
                key={idx}
                className="text-center font-bold bg-muted border h-9!"
              >
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedMice).map(([groupName, mice]) => (
            <>
              {mice.map(({ deliveryId }) => (
                <TableRow
                  key={deliveryId}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium bg-background border h-9!">
                    {deliveryId}
                  </TableCell>
                  {caliper_measurements_dates.map((date) => {
                    const measurement =
                      caliper_measurements[groupName]?.[deliveryId]?.[date];
                    const volumeValue = measurement?.volume_mm3 ?? null;
                    const colorClass =
                      volumeValue !== null
                        ? getCellColorClass(volumeValue)
                        : "";
                    return (
                      <TableCell
                        key={`${deliveryId}-${date}`}
                        className={cn("text-center border h-9!", colorClass)}
                      >
                        {volumeValue !== null ? (
                          <span className="font-semibold text-sm">
                            {volumeValue.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
