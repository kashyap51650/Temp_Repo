import { Fragment } from "react";

import { Button } from "@/components/atoms/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card/Card";
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
} from "@/lib/randomization-result-table-utils";
import { cn } from "@/lib/utils";
import type { EfficacyRandomizationGroup } from "@/types/efficacy-randomization";

interface EfficacyMainGroupCardProps {
  group: EfficacyRandomizationGroup;
  actionLabel: string;
  pendingLabel?: string | null;
  isActionPending: boolean;
  onAction: (group: EfficacyRandomizationGroup) => void;
}

export function EfficacyMainGroupCard({
  group,
  actionLabel,
  pendingLabel,
  isActionPending,
  onAction,
}: Readonly<EfficacyMainGroupCardProps>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-xl">
            {group.group_name} ({group.group_code})
          </CardTitle>
          <CardDescription>
            Mice: {group.mice_count} • Subgroups: {group.subgroups.length}
          </CardDescription>
        </div>
        <Button
          type="button"
          onClick={() => onAction(group)}
          disabled={isActionPending || !group.ready_for_randomization}
        >
          {isActionPending ? pendingLabel || "Processing..." : actionLabel}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-gray-200">
            <TableHeader>
              {/* Subgroup Names Row */}
              <TableRow>
                {group.subgroups.map((subgroup, idx) => (
                  <TableHead
                    key={`header-${subgroup.group_id}`}
                    colSpan={2}
                    className={cn(
                      "text-center font-semibold text-md border border-gray-200 p-3",
                      getGroupColorHeader(idx),
                      subgroup.is_locked && "opacity-40"
                    )}
                  >
                    <div className="flex justify-between items-center gap-1">
                      <p>{subgroup.group_name}</p>
                      <p className="text-xs font-normal text-gray-600">
                        Doses: {subgroup.no_of_completed_doses}/
                        {subgroup.no_of_doses}
                      </p>
                    </div>
                  </TableHead>
                ))}
              </TableRow>

              {/* Column Headers Row */}
              <TableRow>
                {group.subgroups.map((subgroup, idx) => (
                  <Fragment key={`columns-${subgroup.group_id}`}>
                    <TableHead
                      className={cn(
                        "text-left font-semibold border border-gray-200 p-3",
                        getGroupColorBody(idx),
                        subgroup.is_locked && "opacity-40"
                      )}
                    >
                      Mouse Delivery ID
                    </TableHead>
                    <TableHead
                      className={cn(
                        "text-left font-semibold border border-gray-200 p-3",
                        getGroupColorBody(idx),
                        subgroup.is_locked && "opacity-40"
                      )}
                    >
                      Tumor Volume
                    </TableHead>
                  </Fragment>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Data Rows */}
              {(() => {
                const maxMice = Math.max(
                  ...group.subgroups.map((s) => s.mice.length),
                  0
                );

                return Array.from({ length: maxMice }).map((_, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`}>
                    {group.subgroups.map((subgroup, idx) => {
                      const mouse = subgroup.mice[rowIndex];

                      return (
                        <Fragment key={`cell-${subgroup.group_id}-${rowIndex}`}>
                          <TableCell
                            className={cn(
                              "border border-gray-200 p-3 text-left",
                              getGroupColorBody(idx),
                              subgroup.is_locked && "opacity-40"
                            )}
                          >
                            {mouse?.mouse_delivery_id ?? ""}
                          </TableCell>
                          <TableCell
                            className={cn(
                              "border border-gray-200 p-3 text-left",
                              getGroupColorBody(idx),
                              subgroup.is_locked && "opacity-40"
                            )}
                          >
                            {mouse?.measurement_value ?? ""}
                          </TableCell>
                        </Fragment>
                      );
                    })}
                  </TableRow>
                ));
              })()}

              {/* Empty Row Check */}
              {group.subgroups.every((s) => s.mice.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={group.subgroups.length * 2}
                    className="text-center text-muted-foreground p-3 border border-gray-200"
                  >
                    No mice assigned
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
