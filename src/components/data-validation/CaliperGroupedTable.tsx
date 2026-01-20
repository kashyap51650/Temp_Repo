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

export interface GroupedMouseData {
  mouse_id: number;
  group: string;
  mouse_code: string;
}

export interface GroupedMeasurement {
  id: number;
  value: number;
  type: string;
  key: string;
  mouse_id: number;
}

export interface GroupedCaliperData {
  caliper_measurements_dates: string[];
  mouse_data_by_delivery_id: Record<string, GroupedMouseData>;
  caliper_measurements: Record<
    string,
    Record<string, Record<string, GroupedMeasurement>>
  >;
}

export interface CaliperGroupedTableProps {
  data: GroupedCaliperData;
}

export function CaliperGroupedTable({
  data,
}: Readonly<CaliperGroupedTableProps>) {
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
    return `${day}-${months[Number.parseInt(month) - 1]}-${year}`;
  };

  const daysDifference = useMemo(() => {
    if (caliper_measurements_dates.length === 0) return [];

    const [firstDay, firstMonth, firstYear] =
      caliper_measurements_dates[0].split("/");
    const firstMeasurementDate = new Date(
      `${firstYear}-${firstMonth.padStart(2, "0")}-${firstDay.padStart(2, "0")}`
    );

    return caliper_measurements_dates.map((dateStr) => {
      const [day, month, year] = dateStr.split("/");
      const measurementDate = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
      const diffTime =
        measurementDate.getTime() - firstMeasurementDate.getTime();
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

    const entries = Object.entries(mouse_data_by_delivery_id) as Array<
      [string, (typeof mouse_data_by_delivery_id)[string]]
    >;

    entries.forEach(([deliveryId, mouseData]) => {
      if (!groups[mouseData.group]) {
        groups[mouseData.group] = [];
      }
      groups[mouseData.group].push({ deliveryId, mouseData });
    });
    return groups;
  }, [mouse_data_by_delivery_id]);

  return (
    <div className="w-full overflow-auto max-h-screen rounded-lg border">
      <Table className="min-w-5xl border-collapse text-sm">
        <TableHeader className="sticky top-0 z-20 bg-muted">
          <TableRow className="border-b-2">
            <TableHead
              colSpan={3}
              className="text-center font-semibold bg-muted border sticky left-0 z-30 h-9!"
            >
              Date
            </TableHead>
            {caliper_measurements_dates.map((date) => (
              <TableHead
                key={date}
                className="text-center font-semibold bg-muted border min-w-28 h-9!"
              >
                {formatDate(date)}
              </TableHead>
            ))}
          </TableRow>
          <TableRow className="border-b-2">
            <TableHead className="text-center font-medium bg-muted border sticky left-0 z-30 min-w-28 h-9!">
              Group
            </TableHead>
            <TableHead className="text-center font-medium bg-muted border sticky left-28 z-30 min-w-36 h-9!">
              Mouse
            </TableHead>
            <TableHead className="text-center font-medium bg-muted border sticky left-64 z-30 min-w-24 h-9!">
              Mouse Code
            </TableHead>
            {daysDifference.map((days, idx) => (
              <TableHead
                key={`${days}-${idx}`}
                className="text-center h-9! border"
              >
                {days}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedMice).map(([groupName, mice]) =>
            mice.map(({ deliveryId, mouseData }, index) => (
              <TableRow
                key={deliveryId}
                className="hover:bg-muted/30 transition-colors"
              >
                {index === 0 && (
                  <TableCell
                    rowSpan={mice.length}
                    className="bg-background border sticky left-0 z-10 text-center align-middle h-9!"
                  >
                    <div className="px-3 py-2 rounded-md font-semibold">
                      {groupName}
                    </div>
                  </TableCell>
                )}

                <TableCell className="font-medium bg-background border sticky left-28 z-10 text-center h-9!">
                  <span className="font-semibold text-gray-700">
                    {deliveryId}
                  </span>
                </TableCell>

                <TableCell className="font-medium bg-background border sticky left-64 z-10 text-center h-9!">
                  {mouseData.mouse_code}
                </TableCell>

                {caliper_measurements_dates.map((date) => {
                  const measurement =
                    caliper_measurements[groupName]?.[deliveryId]?.[date];
                  const value = measurement?.value ?? null;
                  const colorClass =
                    value !== null ? getCellColorClass(value) : "";

                  return (
                    <TableCell
                      key={`${deliveryId}-${date}`}
                      className={cn(
                        "text-center border font-medium h-9!",
                        colorClass
                      )}
                    >
                      {value !== null ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {value.toFixed(0)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
