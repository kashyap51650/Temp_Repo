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

export interface CaliperHistoryData {
  uploaded_data: {
    caliper_measurements_dates: string[];
    mouse_data_by_delivery_id: Record<
      string,
      {
        mouse_id: number;
      }
    >;
    caliper_measurements: Record<
      string,
      Record<
        string,
        {
          id: number;
          value: number;
          type: string;
          key: string;
          mouse_id: number;
        }
      >
    >;
  };
}

export interface CaliperHistoryTableProps {
  data: CaliperHistoryData;
}

export function CaliperHistoryTable({
  data,
}: Readonly<CaliperHistoryTableProps>) {
  const {
    caliper_measurements_dates,
    mouse_data_by_delivery_id,
    caliper_measurements,
  } = data.uploaded_data;

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
    return `${day}-${months[Number.parseInt(month) - 1]}-${year}`;
  };

  const daysDifference = useMemo(() => {
    const cellInjectionDate = new Date("2025-02-15");
    return caliper_measurements_dates.map((dateStr) => {
      const [day, month, year] = dateStr.split("/");
      const measurementDate = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
      const diffTime = measurementDate.getTime() - cellInjectionDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    });
  }, [caliper_measurements_dates]);

  const getCellColorClass = (value: number): string => {
    if (value > 1.2) return "bg-red-100 text-red-800 border-red-200";
    if (value > 0.9) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (value > 0.6) return "bg-green-100 text-green-800 border-green-200";
    return "";
  };

  const mouseData = useMemo(() => {
    return Object.entries(mouse_data_by_delivery_id).map(
      ([deliveryId, data]) => ({
        deliveryId,
        mouseId: data.mouse_id,
      })
    );
  }, [mouse_data_by_delivery_id]);

  return (
    <div className="w-full overflow-auto max-h-[60vh] rounded-lg border">
      <Table className="min-w-4xl border-collapse text-sm">
        <TableHeader className="sticky top-0 z-20 bg-muted">
          <TableRow className="border-b-2">
            <TableHead className="text-center font-semibold bg-muted border">
              Date
            </TableHead>
            {caliper_measurements_dates.map((date) => (
              <TableHead
                key={date}
                className="text-center font-semibold bg-muted border min-w-48"
              >
                {formatDate(date)}
              </TableHead>
            ))}
          </TableRow>
          <TableRow className="border-b-2">
            <TableHead className="text-center font-medium bg-muted border sticky left-0 z-30 min-w-48">
              Mouse ID
            </TableHead>
            {daysDifference.map((days, idx) => (
              <TableHead
                key={`${days}-${idx}`}
                className="text-center font-bold bg-blue-50 text-blue-700 border"
              >
                {days}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {mouseData.map(({ deliveryId, mouseId }) => (
            <TableRow
              key={deliveryId}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-bold bg-background border sticky left-0 z-10 text-center">
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md font-semibold">
                  {mouseId}
                </div>
              </TableCell>

              {caliper_measurements_dates.map((date) => {
                const measurement = caliper_measurements[deliveryId]?.[date];
                const value = measurement?.value ?? null;
                const colorClass =
                  value === null ? "" : getCellColorClass(value);

                return (
                  <TableCell
                    key={`${deliveryId}-${date}`}
                    className={cn("text-center border font-medium", colorClass)}
                  >
                    {value === null ? (
                      <span className="text-muted-foreground text-lg">—</span>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg">
                          {value.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          mm³
                        </span>
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
