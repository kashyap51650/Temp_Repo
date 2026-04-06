import { Fragment } from "react";

import { Card, CardContent, CardHeader } from "@/components/atoms/Card/Card";
import { Skeleton } from "@/components/atoms/Skeleton/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/Table/Table";

const SUBGROUP_PLACEHOLDERS = ["subgroup-1", "subgroup-2"];
const ROW_PLACEHOLDERS = ["row-1", "row-2", "row-3", "row-4", "row-5"];

export function EfficacyRandomizationResultSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-10 w-28" />
      </CardHeader>

      <CardContent className="m-4 rounded-md border border-gray-200 bg-white p-2">
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-gray-200">
            <TableHeader>
              <TableRow>
                {SUBGROUP_PLACEHOLDERS.map((subgroupKey) => (
                  <TableHead
                    key={`header-${subgroupKey}`}
                    colSpan={2}
                    className="border border-gray-200 p-3"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-5 w-44" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>

              <TableRow>
                {SUBGROUP_PLACEHOLDERS.map((subgroupKey) => (
                  <Fragment key={`columns-${subgroupKey}`}>
                    <TableHead className="border border-gray-200 p-3">
                      <Skeleton className="h-4 w-28" />
                    </TableHead>
                    <TableHead className="border border-gray-200 p-3">
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                  </Fragment>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {ROW_PLACEHOLDERS.map((rowKey) => (
                <TableRow key={rowKey}>
                  {SUBGROUP_PLACEHOLDERS.map((subgroupKey) => (
                    <Fragment key={`${subgroupKey}-${rowKey}`}>
                      <TableCell className="border border-gray-200 p-3">
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell className="border border-gray-200 p-3">
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                    </Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
