import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Dialog } from "@/components/atoms/Dialog/Dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules/Tabs/Tabs";
import { useCaliperHistoryByMouse } from "@/hooks/useCaliperHistoryByMouse";

import { Label } from "../atoms";
import type { CaliperData, Measurement } from "./CaliperDataTable";
import { CaliperDataTable } from "./CaliperDataTable";

interface ExperimentHeaderProps {
  title: string;
  sex: string;
  strain: string;
  dob: string;
  cellInjDate: string;
  cellLine: string;
  treatmentDate?: string;
  miceAge?: string;
  measurementDate?: string;
}

function ExperimentHeader(header: Readonly<ExperimentHeaderProps>) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      {[
        [
          { key: "sex", label: "Sex:" },
          { key: "strain", label: "Strain:" },
          { key: "dob", label: "DOB:" },
          { key: "cellInjDate", label: "Cell Injection Date:" },
          { key: "cellLine", label: "Cell Line:" },
        ],
      ].map((group, groupIdx) => (
        <div
          className="space-y-3 grid grid-cols-2 w-10/12"
          key={`${group.map((field) => field.key).join("-")}-${groupIdx}`}
        >
          {group.map(({ key, label }) => {
            const value = header[key as keyof ExperimentHeaderProps];
            return (
              <div className="flex items-center gap-3" key={key}>
                <Label className="font-semibold text-sm w-56">{label}</Label>
                <span className="flex-1">
                  {value === null || value === undefined || value === ""
                    ? "—"
                    : value}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface CaliperHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId: number;
}

export default function CaliperHistoryModal({
  isOpen,
  onClose,
  experimentId,
}: Readonly<CaliperHistoryModalProps>) {
  const [activeTab, setActiveTab] = useState(0);

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useCaliperHistoryByMouse(experimentId, isOpen);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load calliper history", {
        description:
          error.message || "Unable to fetch calliper measurement data",
      });
    }
  }, [error]);

  const convertToLegacyFormat = (
    tabData: NonNullable<typeof apiResponse>["data"]["tabs"][0]
  ): CaliperData => {
    const deliveryIds = Object.keys(tabData.mouse_data_by_delivery_id).sort(
      (a, b) => {
        const numA = parseInt(a.split("-").pop() || "0", 10);
        const numB = parseInt(b.split("-").pop() || "0", 10);
        return numA - numB;
      }
    );

    const convertedMeasurements: Record<
      string,
      Record<string, Record<string, Measurement>>
    > = {};

    deliveryIds.forEach((deliveryId) => {
      const mouseInfo = tabData.mouse_data_by_delivery_id[deliveryId];
      const groupKey = mouseInfo?.mouse_code || deliveryId;

      if (!convertedMeasurements[groupKey]) {
        convertedMeasurements[groupKey] = {};
      }

      convertedMeasurements[groupKey][deliveryId] = {};

      const measurements = tabData.caliper_measurements[deliveryId];
      if (measurements) {
        Object.keys(measurements).forEach((date) => {
          const measurementData = measurements[date];
          convertedMeasurements[groupKey][deliveryId][date] = {
            width_mm: measurementData.width_mm,
            length_mm: measurementData.length_mm,
            volume_mm3: measurementData.volume_mm3,
          };
        });
      }
    });

    const updatedMouseData: Record<string, any> = {};
    deliveryIds.forEach((deliveryId) => {
      const mouseInfo = tabData.mouse_data_by_delivery_id[deliveryId];
      updatedMouseData[deliveryId] = {
        mouse_id: mouseInfo.id,
        group: mouseInfo.mouse_code,
        mouse_code: mouseInfo.mouse_code,
      };
    });

    return {
      caliper_measurements_dates: [...tabData.caliper_measurements_dates],
      mouse_data_by_delivery_id: updatedMouseData,
      caliper_measurements: convertedMeasurements,
    };
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title="Calliper History"
      description="View the history of individual mouse calliper measurements across different experimental conditions."
      className="h-dvh max-w-dvw flex flex-col overflow-y-auto rounded-none"
      showClose={true}
      trigger={null}
    >
      <div className="py-4 flex-1 overflow-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">
              Loading calliper history...
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-destructive">
              Unable to load calliper history. Please try again later.
            </div>
          </div>
        )}

        {!isLoading && !error && !apiResponse?.data?.tabs?.length && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">
              No calliper history data available for this experiment.
            </div>
          </div>
        )}

        {apiResponse?.data?.tabs && apiResponse.data.tabs.length > 0 && (
          <div className="mb-6">
            <Tabs
              value={activeTab.toString()}
              onValueChange={(value) => setActiveTab(Number.parseInt(value))}
            >
              <TabsList>
                {apiResponse.data.tabs.map((tab, index) => (
                  <TabsTrigger
                    key={tab.tab_id}
                    value={index.toString()}
                    className="text-sm"
                  >
                    {tab.tab_label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {apiResponse.data.tabs.map((tab, index) => (
                <TabsContent
                  key={tab.tab_id}
                  value={index.toString()}
                  className="mt-4"
                >
                  <ExperimentHeader
                    title="Prot458_Ma"
                    sex={tab.metadata.sex}
                    strain={tab.metadata.strain}
                    dob={tab.metadata.date_of_birth}
                    cellInjDate={tab.metadata.cell_injection_date}
                    cellLine={tab.metadata.cell_line}
                  />

                  <CaliperDataTable data={convertToLegacyFormat(tab)} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </Dialog>
  );
}
