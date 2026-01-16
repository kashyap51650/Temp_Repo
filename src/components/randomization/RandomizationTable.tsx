import { Fragment, type ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/Table/Table";
import {
  getGroupColorBody,
  getGroupColorHeader,
  TABLE_COLUMNS,
} from "@/lib/randomization-result-table-utils";
import type { RandomizationGroupUI } from "@/types/randomization";

interface RandomizationTableProps {
  groups: RandomizationGroupUI[];
  micePerGroup: number;
  renderGroupHeader?: (group: RandomizationGroupUI, index: number) => ReactNode;
  className?: string;
}

export const RandomizationTable = ({
  groups,
  micePerGroup,
  renderGroupHeader,
  className = "",
}: RandomizationTableProps) => {
  return (
    <div
      className={`bg-white p-2 border border-gray-200 rounded-md text-right ${className}`}
    >
      <Table className="min-w-full border border-gray-200">
        <TableHeader>
          <TableRow>
            {groups.map((g, idx) => (
              <TableHead
                key={`${g.key}`}
                colSpan={TABLE_COLUMNS.length}
                className={`text-center font-semibold text-md ${getGroupColorHeader(idx)} border border-gray-200 p-3`}
              >
                {g.label}
              </TableHead>
            ))}
          </TableRow>

          {renderGroupHeader && (
            <TableRow>
              {groups.map((g, idx) => (
                <TableHead
                  key={`${g.key}-select`}
                  colSpan={TABLE_COLUMNS.length}
                  className={`border border-gray-200 ${getGroupColorBody(idx)} p-3`}
                >
                  {renderGroupHeader(g, idx)}
                </TableHead>
              ))}
            </TableRow>
          )}

          <TableRow>
            {groups.map((g, idx) => (
              <Fragment key={`${g.key}-headers`}>
                {TABLE_COLUMNS.map((col) => (
                  <TableHead
                    key={`${g.key}-${col.key}`}
                    className={`text-left font-semibold border border-gray-200 ${getGroupColorBody(idx)} p-3`}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </Fragment>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: micePerGroup }).map((_, i) => (
            <TableRow key={`row-${i}`}>
              {groups.map((g, idx) => (
                <Fragment key={`${g.key}-row-${i}`}>
                  {TABLE_COLUMNS.map((col) => (
                    <TableCell
                      key={`${g.key}-${col.key}-${i}`}
                      className={`${getGroupColorBody(idx)} border border-gray-200 p-3 text-left`}
                    >
                      {(g.data[i] as Record<string, string | number>)?.[
                        col.key
                      ] ?? ""}
                    </TableCell>
                  ))}
                </Fragment>
              ))}
            </TableRow>
          ))}

          <TableRow>
            {groups.map((g, idx) => (
              <Fragment key={`${g.key}-avg`}>
                <TableCell
                  key={`${g.key}-avg-label`}
                  className={`${getGroupColorHeader(idx)} border border-gray-200 font-bold text-left p-3`}
                >
                  AVERAGE
                </TableCell>
                <TableCell
                  key={`${g.key}-avg-value`}
                  className={`${getGroupColorHeader(idx)} border border-gray-200 font-bold text-left p-3`}
                >
                  {g.average_measurement}
                </TableCell>
              </Fragment>
            ))}
          </TableRow>

          <TableRow>
            {groups.map((g) => (
              <Fragment key={`${g.key}-stdev`}>
                <TableCell
                  key={`${g.key}-stdev-label`}
                  className="border border-gray-200 font-bold text-left px-3 py-2"
                >
                  STDEV
                </TableCell>
                <TableCell
                  key={`${g.key}-stdev-value`}
                  className="border border-gray-200 font-bold text-left px-3 py-2"
                >
                  {g.std_deviation}
                </TableCell>
              </Fragment>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
