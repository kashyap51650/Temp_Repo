import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";

import { moveMiceApi } from "@/api";
import type {
  BloodChemistryReportData,
  BloodChemistryReportParameters,
} from "@/types/bloodChemistry";

import { Input } from "../atoms";
import { CalendarDatePicker, DataTable } from "../organisms";
import { AsyncSelect } from "./AsyncSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs/Tabs";

interface ViewBloodChemistryDataProps {
  data: BloodChemistryReportData[];
  mode?: "view" | "edit";
  reportCallbacks?: Array<
    (
      index: number,
      field: keyof BloodChemistryReportParameters,
      value: string
    ) => void
  >;
  mouseChangeCallbacks?: Array<(mouseId: number) => void>;
  reportDateTimeChangeCallbacks?: Array<(dateTime: string) => void>;
  experimentId: number;
}

type ParameterWithId = BloodChemistryReportParameters & {
  id: string | number;
};

const getBloodChemistryColumns = (
  mode: "view" | "edit",
  onChange?: (
    index: number,
    field: keyof BloodChemistryReportParameters,
    value: string
  ) => void
): ColumnDef<ParameterWithId>[] => [
  {
    accessorKey: "parameter_name",
    header: () => <span className="flex">Parameter Name</span>,
    cell: ({ row }) =>
      mode === "edit" && onChange ? (
        <Input
          type="text"
          value={row.original.parameter_name}
          onChange={(e) =>
            onChange(row.index, "parameter_name", e.target.value)
          }
          className="w-full"
        />
      ) : (
        <span className="font-medium">{row.original.parameter_name}</span>
      ),
  },
  {
    accessorKey: "parameter_value",
    header: () => <span className="flex">Parameter Value</span>,
    cell: ({ row }) =>
      mode === "edit" && onChange ? (
        <Input
          type="text"
          value={row.original.parameter_value}
          onChange={(e) =>
            onChange(row.index, "parameter_value", e.target.value)
          }
          className="w-full"
        />
      ) : (
        <span>{row.original.parameter_value}</span>
      ),
  },
  {
    accessorKey: "reference_range",
    header: () => <span className="flex">Reference Range</span>,
    cell: ({ row }) =>
      mode === "edit" && onChange ? (
        <Input
          type="text"
          value={row.original.reference_range}
          onChange={(e) =>
            onChange(row.index, "reference_range", e.target.value)
          }
          className="w-full"
        />
      ) : (
        <span>{row.original.reference_range || "—"}</span>
      ),
  },
];

interface ReportHeaderProps {
  report: BloodChemistryReportData;
  mode: "view" | "edit";
  onMouseChange?: (mouseId: number) => void;
  onDateTimeChange?: (dateTime: string) => void;
  experimentId: number;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  report,
  mode,
  onMouseChange,
  onDateTimeChange,
  experimentId,
}) => {
  const mouseDropdownQuery = useCallback(async () => {
    const response = await moveMiceApi.getMiceFromExperiment(experimentId);
    return response.data;
  }, [experimentId]);

  return (
    <div className="mb-6 space-y-3 p-4 bg-muted/30 rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Patient Name
          </p>
          <p className="text-base font-medium text-foreground">
            {report.patient_name}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Report Date/Time
          </p>
          {mode === "view" ? (
            <p className="text-base font-medium text-foreground">
              {format(new Date(report.report_datetime), "MM/dd/yy h:mm a")}
            </p>
          ) : (
            <CalendarDatePicker
              value={new Date(report.report_datetime)}
              onChange={(date) => onDateTimeChange?.(date?.toISOString() || "")}
            />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Mouse Delivery ID
          </p>
          <AsyncSelect
            query={mouseDropdownQuery}
            mapConfig={{
              labelKey: "mouse_delivery_id",
              valueKey: "id",
            }}
            value={report.mouse_id?.toString()}
            onChange={(value) => {
              if (onMouseChange && value && !Array.isArray(value)) {
                onMouseChange(Number(value));
              }
            }}
            disabled={mode === "view"}
            placeholder="Select a mouse"
            queryKey={["mice-dropdown"]}
            optionWithAll={false}
            searchable={true}
            size="default"
            triggerClassName="bg-white"
          />
        </div>
      </div>
    </div>
  );
};

interface ReportTableProps {
  report: BloodChemistryReportData;
  mode: "view" | "edit";
  onParameterChange?: (
    index: number,
    field: keyof BloodChemistryReportParameters,
    value: string
  ) => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
  report,
  mode,
  onParameterChange,
}) => {
  const parametersWithIds: ParameterWithId[] = useMemo(
    () =>
      report.parameters.map((param, index) => ({
        ...param,
        id: param.id || index,
      })),
    [report.parameters]
  );

  const columns = useMemo(
    () => getBloodChemistryColumns(mode, onParameterChange),
    [mode, onParameterChange]
  );

  return <DataTable columns={columns} data={parametersWithIds} />;
};

export default function ViewBloodChemistryData({
  data,
  mode = "view",
  reportCallbacks = [],
  mouseChangeCallbacks = [],
  reportDateTimeChangeCallbacks = [],
  experimentId,
}: Readonly<ViewBloodChemistryDataProps>) {
  const [activeTab, setActiveTab] = useState<string>("0");

  const reports = data;

  if (!reports || reports.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">
          No report data available.
        </div>
      </div>
    );
  }

  if (reports.length === 1) {
    const report = reports[0];
    return (
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-5%)]">
        <ReportHeader
          report={report}
          mode={mode}
          onMouseChange={mouseChangeCallbacks[0]}
          onDateTimeChange={reportDateTimeChangeCallbacks[0]}
          experimentId={experimentId}
        />
        <ReportTable
          report={report}
          mode={mode}
          onParameterChange={reportCallbacks[0]}
        />
      </div>
    );
  }

  // Multi-report view (with tabs)
  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-5%)]">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="justify-start overflow-x-auto flex-nowrap">
          {reports.map((report, index) => (
            <TabsTrigger
              key={`${report?.blood_chemistry_report_id}-${index}`}
              value={index.toString()}
              className="whitespace-nowrap"
            >
              Report {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {reports.map((report, index) => (
          <TabsContent
            key={`${report?.blood_chemistry_report_id}-${index}`}
            value={index.toString()}
          >
            <ReportHeader
              report={report}
              mode={mode}
              onMouseChange={mouseChangeCallbacks[index]}
              onDateTimeChange={reportDateTimeChangeCallbacks[index]}
              experimentId={experimentId}
            />
            <ReportTable
              report={report}
              mode={mode}
              onParameterChange={reportCallbacks[index]}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
