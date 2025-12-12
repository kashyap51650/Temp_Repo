import { useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useMemo } from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/organisms/Table/Table";
import { useRendomizationResult } from "@/hooks/useRendomizationResult";
import {
  getGroupColorBody,
  getGroupColorHeader,
  TABLE_COLUMNS,
} from "@/lib/randomization-result-table-utils";
import type { Group } from "@/types/randomization";

const transformApiGroupsForUI = (apiGroups: Group[]) =>
  apiGroups.map((g) => ({
    key: g.group_code,
    label: g.group_name,
    avarage_measurement: g.average_measurement,
    std_deviation: g.std_deviation,
    data: g.mice.map((m) => ({
      mouse: m.mouse_delivery_id,
      tumorVol: m.measurement_value,
    })),
  }));

export default function RandomizationResults() {
  const {
    experimentDrugs,
    selectedGroupDrug,
    setSelectedGroupDrug,
    isPending,
    previewRandomizationfn,
    isConfirmationPending,
    handleConfirmClick,
    randomizationData,
    handleBack,
  } = useRendomizationResult();

  const groups = useMemo(() => {
    if (!randomizationData) return null;
    return transformApiGroupsForUI(randomizationData.groups);
  }, [randomizationData]);

  const state = useRouterState({ select: (s) => s.location.search }) as {
    experiment_id: number;
    mice_per_group: number;
    randomization_type: string;
  };

  const [nameFilter, setNameFilter] = React.useState("");

  useEffect(() => {
    previewRandomizationfn({
      experiment_id: state.experiment_id,
      mice_per_group: state.mice_per_group,
      randomization_type: state.randomization_type,
    });
  }, [previewRandomizationfn]);

  const applyFilters = () => {
    // clear all selections
    setSelectedGroupDrug({});
    previewRandomizationfn({
      experiment_id: 19,
      mice_per_group: nameFilter ? Number(nameFilter) : 5,
      randomization_type: "volume",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center ">
          <Button variant="link" size={"icon-lg"} onClick={handleBack}>
            <ArrowLeft className="size-6" />
          </Button>
          <h1 className="text-3xl font-bold">Randomization Results</h1>
        </div>
      </div>

      <div className="flex items-center mb-3 gap-3 py-2">
        <div className="flex flex-col gap-2">
          <Label>Number of Mouse in Group</Label>
          <Input
            placeholder="Enter mouse count"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-64"
            type="number"
          />
        </div>
        <Button onClick={applyFilters} className="mt-6" disabled={isPending}>
          Apply
        </Button>
      </div>

      {isPending ? (
        <p>Loading randomization results...</p>
      ) : (
        <div className="bg-white p-2 border border-gray-200 rounded-md text-right">
          <Table className="min-w-full border border-gray-200">
            <TableHeader>
              <TableRow>
                {groups?.map((g, idx) => (
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
                {groups?.map((g, idx) => (
                  <TableHead
                    key={g.key + "-select"}
                    colSpan={TABLE_COLUMNS.length}
                    className={`border border-gray-200 ${getGroupColorBody(idx)} p-3`}
                  >
                    <div className="flex justify-center">
                      <Select
                        value={selectedGroupDrug[g.key] ?? ""}
                        onValueChange={(v) => {
                          setSelectedGroupDrug((prev) => ({
                            ...prev,
                            [g.key]: v,
                          }));
                        }}
                      >
                        <SelectTrigger className="w-44 bg-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {experimentDrugs.map((drug) => (
                            <SelectItem
                              key={drug.id}
                              value={drug.id.toString()}
                            >
                              {drug.drug_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
              <TableRow>
                {groups?.map((g, idx) => (
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
              {Array.from({
                length: randomizationData?.mice_per_group || 0,
              }).map((_, i) => (
                <TableRow key={i}>
                  {groups?.map((g, idx) => (
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
                {groups?.map((g, idx) => (
                  <React.Fragment key={g.key + "-avg"}>
                    <TableCell
                      key={g.key + "-avg-label"}
                      className={`${getGroupColorHeader(idx)} border border-gray-200 font-bold text-left p-3`}
                    >
                      AVERAGE
                    </TableCell>
                    <TableCell
                      key={g.key + "-avg-value"}
                      className={`${getGroupColorHeader(idx)} border border-gray-200 font-bold text-left p-3`}
                    >
                      {g.avarage_measurement}
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>

              <TableRow>
                {groups?.map((g) => (
                  <React.Fragment key={g.key + "-stdev"}>
                    <TableCell
                      key={g.key + "-stdev-label"}
                      className=" border border-gray-200 font-bold text-left px-3 py-2"
                    >
                      STDEV
                    </TableCell>
                    <TableCell
                      key={g.key + "-stdev-value"}
                      className=" border border-gray-200 font-bold text-left px-3 py-2"
                    >
                      {g.std_deviation}
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableBody>
          </Table>
          <Button
            size="lg"
            className="mt-3 ml-auto"
            onClick={handleConfirmClick}
            disabled={isConfirmationPending}
          >
            {isConfirmationPending ? "Applying..." : "Apply"}
          </Button>
        </div>
      )}
    </div>
  );
}
