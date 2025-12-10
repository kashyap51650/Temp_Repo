import { ArrowLeft } from "lucide-react";
import React from "react";

import { Label } from "@/components";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";
import { DEFAULT_GROUPS } from "@/components/organisms/DataTable/tableData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/Table/Table";

export interface RandomizationResultsProps {
  results?: Record<string, Array<{ mouse: string; tumorVol: number }>>;
}

export interface TableColumn {
  key: string;
  label: string;
}

export const TABLE_COLUMNS: TableColumn[] = [
  { key: "mouse", label: "Mouse #" },
  { key: "tumorVol", label: "Tumor Vol" },
];

const GROUP_COLORS_HEADER = [
  "bg-green-300",
  "bg-yellow-300",
  "bg-orange-300",
  "bg-red-300",
  "bg-pink-300",
  "bg-purple-300",
  "bg-blue-300",
  "bg-cyan-300",
  "bg-teal-300",
  "bg-lime-300",
];
const GROUP_COLORS_BODY = [
  "bg-green-100",
  "bg-yellow-100",
  "bg-orange-100",
  "bg-red-100",
  "bg-pink-100",
  "bg-purple-100",
  "bg-blue-100",
  "bg-cyan-100",
  "bg-teal-100",
  "bg-lime-100",
];
const getGroupColorHeader = (idx: number) =>
  GROUP_COLORS_HEADER[idx % GROUP_COLORS_HEADER.length];
const getGroupColorBody = (idx: number) =>
  GROUP_COLORS_BODY[idx % GROUP_COLORS_BODY.length];

export default function RandomizationResults({
  results,
}: RandomizationResultsProps) {
  const groups = React.useMemo(() => {
    if (!results) return DEFAULT_GROUPS;
    return DEFAULT_GROUPS.map((g) => ({
      ...g,
      data: results[g.key] ?? g.data,
    }));
  }, [results]);

  const [selections, setSelections] = React.useState<string[]>(() =>
    groups.map((g) => g.options[0])
  );
  const [nameFilter, setNameFilter] = React.useState("");

  const numRows = Math.max(...groups.map((g) => g.data.length));
  const average = (arr: number[]) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "-";
  const stdev = (arr: number[]) => {
    if (!arr.length) return "-";
    const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance =
      arr.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / arr.length;
    return Math.sqrt(variance).toFixed(6);
  };

  const applyFilters = () => {
    console.log("Applying filters:", { nameFilter });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center ">
          <Button
            variant="link"
            size={"icon-lg"}
            onClick={() => (window.location.href = "/data-validate")}
          >
            <ArrowLeft className="size-6" />
          </Button>
          <h1 className="text-3xl font-bold">Randomization Results</h1>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col gap-2">
          <Label>Name Filter</Label>
          <Input
            placeholder="Enter name filter..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-64"
          />
        </div>
        <Button onClick={applyFilters} className="mt-6">
          Apply
        </Button>
      </div>

      <div className="bg-white  shadow-sm border ">
        {/* table is unique per group so we can't use data table here  */}
        <Table className="min-w-full border border-gray-200">
          <TableHeader>
            <TableRow>
              {groups.map((g, idx) => (
                <TableHead
                  key={g.key}
                  colSpan={TABLE_COLUMNS.length}
                  className={`text-center font-semibold text-md ${getGroupColorHeader(idx)} border border-gray-200 p-3`}
                >
                  {g.label}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {groups.map((g, idx) => (
                <TableHead
                  key={g.key + "-select"}
                  colSpan={TABLE_COLUMNS.length}
                  className={`border border-gray-200 ${getGroupColorBody(idx)} p-3`}
                >
                  <div className="flex justify-center">
                    <Select
                      value={selections[idx]}
                      onValueChange={(v) =>
                        setSelections((s) =>
                          s.map((x, i) => (i === idx ? v : x))
                        )
                      }
                    >
                      <SelectTrigger className="w-44 bg-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {g.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {groups.map((g, idx) => (
                <React.Fragment key={g.key + "-headers"}>
                  {TABLE_COLUMNS.map((col) => (
                    <TableHead
                      key={g.key + "-" + col.key}
                      className={`text-left font-semibold border border-gray-200 ${getGroupColorBody(idx)} p-3`}
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </React.Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: numRows }).map((_, i) => (
              <TableRow key={i}>
                {groups.map((g, idx) => (
                  <React.Fragment key={g.key + "-row-" + i}>
                    {TABLE_COLUMNS.map((col) => (
                      <TableCell
                        key={g.key + "-" + col.key + "-" + i}
                        className={`${getGroupColorBody(idx)} border border-gray-200 p-3`}
                      >
                        {(g.data[i] as Record<string, string | number>)?.[
                          col.key
                        ] ?? ""}
                      </TableCell>
                    ))}
                  </React.Fragment>
                ))}
              </TableRow>
            ))}
            <TableRow>
              {groups.map((g, idx) => (
                <React.Fragment key={g.key + "-avg"}>
                  {TABLE_COLUMNS.map((col, colIdx) => (
                    <TableCell
                      key={g.key + "-avg-" + col.key}
                      className={`${getGroupColorHeader(idx)} border border-gray-200 font-bold text-left p-3`}
                    >
                      {colIdx === 0
                        ? "AVERAGE"
                        : col.key === "tumorVol"
                          ? average(g.data.map((x) => x.tumorVol))
                          : "-"}
                    </TableCell>
                  ))}
                </React.Fragment>
              ))}
            </TableRow>
            <TableRow>
              {groups.map((g) => (
                <React.Fragment key={g.key + "-stdev"}>
                  {TABLE_COLUMNS.map((col, colIdx) => (
                    <TableCell
                      key={g.key + "-stdev-" + col.key}
                      className="border border-gray-200 p-3"
                    >
                      {colIdx === 0
                        ? "Stdev"
                        : col.key === "tumorVol"
                          ? stdev(g.data.map((x) => x.tumorVol))
                          : "-"}
                    </TableCell>
                  ))}
                </React.Fragment>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
