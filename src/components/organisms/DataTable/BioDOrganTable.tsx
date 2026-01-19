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

interface GroupCellProps {
  rowId: string;
  group: string;
  groupInfo: { value: string; colspan: number };
  editable: boolean;
  fixedTopRowsEditable: boolean;
  experimentDrugs: Array<{ id: number; drug_name: string }>;
  onCellChange?: (
    rowId: string,
    mouseId: string,
    value: string,
    groupCode?: string
  ) => void;
  onDrugChange?: (groupCode: string, drugId: string) => void;
}

function GroupCell({
  rowId,
  group,
  groupInfo,
  editable,
  fixedTopRowsEditable,
  experimentDrugs,
  onCellChange,
  onDrugChange,
}: GroupCellProps) {
  const isEditable = editable || fixedTopRowsEditable;

  if (rowId === "drugName" && isEditable && onDrugChange) {
    const drugValue = String(
      experimentDrugs.find(
        (val) =>
          val.drug_name === groupInfo.value ||
          val.id.toString() === groupInfo.value
      )?.id || ""
    );

    return (
      <ExperimentDrugSelect
        value={drugValue}
        onValueChange={(drugId) => onDrugChange(group, drugId)}
        placeholder="Select Drug"
        className="w-full"
      />
    );
  }

  if (isEditable && onCellChange) {
    return (
      <Input
        className="w-full text-center font-semibold"
        value={groupInfo.value || ""}
        readOnly={true}
      />
    );
  }

  return groupInfo.value;
}

interface DataCellProps {
  rowId: string;
  mouseId: string;
  value: string | number;
  editable: boolean;
  fixedTopRowsEditable?: boolean;
  onCellChange?: (
    rowId: string,
    mouseId: string,
    value: string,
    groupCode?: string
  ) => void;
}

function DataCell({
  rowId,
  mouseId,
  value,
  editable,
  fixedTopRowsEditable = false,
  onCellChange,
}: DataCellProps) {
  const isEditable = editable || fixedTopRowsEditable;
  const stringValue = value || "";

  if (isEditable) {
    return (
      <Input
        className="w-full"
        value={stringValue}
        onChange={(e) => onCellChange?.(rowId, mouseId, e.target.value)}
      />
    );
  }

  return stringValue;
}

export function BioDOrganTable({
  data,
  editable = false,
  onCellChange,
  onDrugChange,
  fixedTopRowsEditable = false,
}: Readonly<BioDOrganTableProps>) {
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
                      <GroupCell
                        rowId={row.id}
                        group={group}
                        groupInfo={groupInfo}
                        editable={editable}
                        fixedTopRowsEditable={fixedTopRowsEditable}
                        experimentDrugs={experimentDrugs}
                        onCellChange={onCellChange}
                        onDrugChange={onDrugChange}
                      />
                    </TableCell>
                  ))
                : mouse.map((m) => (
                    <TableCell
                      key={m}
                      className="border px-4 py-2 text-center min-w-[140px]"
                    >
                      <DataCell
                        rowId={row.id}
                        mouseId={m}
                        value={row.data[m]}
                        editable={editable}
                        fixedTopRowsEditable={fixedTopRowsEditable}
                        onCellChange={onCellChange}
                      />
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
                  <DataCell
                    rowId={row.id}
                    mouseId={m}
                    value={row.data[m]}
                    editable={editable}
                    fixedTopRowsEditable={false}
                    onCellChange={onCellChange}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
