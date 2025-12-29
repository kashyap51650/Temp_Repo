import { useExperimentsDrugsDropdown } from "@/hooks";

import { Input } from "../../atoms";
import { ExperimentDrugSelect } from "../../molecules/ExperimentDrugSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Table/Table";
import type { BioDOrganData } from "./tableData";

interface BioDOrganTableProps {
  data: BioDOrganData;
  editable?: boolean;
  onCellChange?: (
    rowId: string,
    mouseId: string,
    value: string,
    groupCode?: string
  ) => void;
  onDrugChange?: (groupCode: string, drugId: string) => void;
  fixedTopRowsEditable?: boolean;
}

export function BioDOrganTable({
  data,
  editable = false,
  onCellChange,
  onDrugChange,
  fixedTopRowsEditable = false,
}: BioDOrganTableProps) {
  const { mouse, rows } = data;
  const fixedRows = rows.slice(0, 4);
  const dataRows = rows.slice(4);

  const { experimentDrugs } = useExperimentsDrugsDropdown();

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[1200px] border">
        <TableHeader>
          <TableRow>
            <TableHead className="border px-4 py-2 text-left bg-muted min-w-[180px]">
              Parameter
            </TableHead>
            {mouse.map((m) => (
              <TableHead
                key={m}
                className="border px-4 py-2 text-center bg-muted min-w-[140px]"
              >
                {m}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {fixedRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="border px-4 py-2 font-medium min-w-[180px]">
                {row.label}
              </TableCell>
              {row.groupedData
                ? Object.entries(row.groupedData).map(([group, groupInfo]) => (
                    <TableCell
                      key={group}
                      colSpan={groupInfo.colspan}
                      className="border px-4 py-2 text-center font-semibold bg-accent min-w-[140px]"
                    >
                      {row.id === "drugName" &&
                      (editable || fixedTopRowsEditable) &&
                      onDrugChange ? (
                        <ExperimentDrugSelect
                          value={String(
                            experimentDrugs.find(
                              (val) =>
                                val.drug_name === groupInfo.value ||
                                val.id.toString() === groupInfo.value
                            )?.id || ""
                          )}
                          onValueChange={(drugId) =>
                            onDrugChange(group, drugId)
                          }
                          placeholder="Select Drug"
                          className="w-full"
                        />
                      ) : (editable || fixedTopRowsEditable) && onCellChange ? (
                        <Input
                          className="w-full text-center font-semibold"
                          value={groupInfo.value || ""}
                          readOnly={true}
                        />
                      ) : (
                        groupInfo.value
                      )}
                    </TableCell>
                  ))
                : mouse.map((m) => (
                    <TableCell
                      key={m}
                      className="border px-4 py-2 text-center min-w-[140px]"
                    >
                      {editable || fixedTopRowsEditable ? (
                        <Input
                          className="w-full"
                          value={row.data[m] || ""}
                          onChange={(e) =>
                            onCellChange &&
                            onCellChange(row.id, m, e.target.value)
                          }
                        />
                      ) : (
                        row.data[m] || ""
                      )}
                    </TableCell>
                  ))}
            </TableRow>
          ))}
          {dataRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="border px-4 py-2 min-w-[180px]">
                {row.label}
              </TableCell>
              {mouse.map((m) => (
                <TableCell
                  key={m}
                  className="border px-4 py-2 text-center min-w-[140px]"
                >
                  {editable ? (
                    <Input
                      className="w-full"
                      value={row.data[m] || ""}
                      onChange={(e) =>
                        onCellChange && onCellChange(row.id, m, e.target.value)
                      }
                    />
                  ) : (
                    row.data[m] || ""
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
