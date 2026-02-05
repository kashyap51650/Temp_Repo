import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules/Tabs/Tabs";
import { useCaliperHistoryByGroup } from "@/hooks/useCaliperHistoryByGroup";
import type { CaliperHistoryMeasurement } from "@/lib/api";
import { getSortedDeliveryIds } from "@/utils/calliperHistoryGroupedUtils";

import { Dialog, Label } from "../atoms";
import type {
  GroupedCaliperData,
  GroupedMeasurement,
  GroupedMouseData,
} from "./CaliperGroupedTable";
import { CaliperGroupedTable } from "./CaliperGroupedTable";

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
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
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
            if (typeof value !== "string" && value !== undefined) return null;
            return (
              <div className="flex items-center gap-3" key={key}>
                <Label className="text-sm text-gray-600 w-56">{label}</Label>
                <span className="flex-1 text-sm font-medium">
                  {value || "—"}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface CaliperHistoryGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId: number;
  experimentName: string;
}

const CaliperHistoryGroupModal: React.FC<
  Readonly<CaliperHistoryGroupModalProps>
> = ({ isOpen, onClose, experimentId, experimentName }) => {
  const [activeTab, setActiveTab] = useState(0);
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useCaliperHistoryByGroup(experimentId, isOpen);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load caliper history by group", {
        description:
          error.message || "Unable to fetch grouped caliper measurement data",
      });
    }
  }, [error]);

  function getSortedGroupIds(
    tabData: NonNullable<typeof apiResponse>["data"]["tabs"][0]
  ): string[] {
    return Object.keys(tabData.group_data_by_group_id).sort(
      (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)
    );
  }

  function convertMouseData(
    mouseData: Record<string, CaliperHistoryMeasurement>,
    deliveryId: string,
    tabData: NonNullable<typeof apiResponse>["data"]["tabs"][0]
  ): Record<string, GroupedMeasurement> {
    const result: Record<string, GroupedMeasurement> = {};
    for (const [date, measurements] of Object.entries(mouseData)) {
      result[date] = {
        id: 0,
        value: measurements.volume_mm3,
        type: "float",
        key: "volume_mm3",
        mouse_id: tabData.mouse_data_by_delivery_id[deliveryId]?.id || 0,
      };
    }
    return result;
  }

  function updateMouseDataForGroup(
    groupMeasurements: Record<
      string,
      Record<string, CaliperHistoryMeasurement>
    >,
    groupName: string,
    tabData: NonNullable<typeof apiResponse>["data"]["tabs"][0],
    updatedMouseData: Record<string, GroupedMouseData>
  ) {
    const deliveryIds = getSortedDeliveryIds(groupMeasurements);
    for (const deliveryId of deliveryIds) {
      const mouseInfo = tabData.mouse_data_by_delivery_id[deliveryId];
      if (mouseInfo) {
        updatedMouseData[deliveryId] = {
          mouse_id: mouseInfo.id,
          group: groupName,
          mouse_code: mouseInfo.mouse_code,
        };
      }
    }
  }

  const convertToLegacyFormat = (
    tabData: NonNullable<typeof apiResponse>["data"]["tabs"][0]
  ): GroupedCaliperData => {
    const convertedMeasurements: Record<
      string,
      Record<string, Record<string, GroupedMeasurement>>
    > = {};

    const groupIds = getSortedGroupIds(tabData);

    for (const groupId of groupIds) {
      const groupInfo = tabData.group_data_by_group_id[groupId];
      const groupName = groupInfo?.group_name || `Group ${groupId}`;
      convertedMeasurements[groupName] = {};
      const groupMeasurements = tabData.caliper_measurements[groupId];
      if (groupMeasurements) {
        const deliveryIds = getSortedDeliveryIds(groupMeasurements);
        for (const deliveryId of deliveryIds) {
          const mouseData = groupMeasurements[deliveryId];
          convertedMeasurements[groupName][deliveryId] = convertMouseData(
            mouseData,
            deliveryId,
            tabData
          );
        }
      }
    }

    const updatedMouseData: Record<string, GroupedMouseData> = {};
    for (const groupId of groupIds) {
      const groupInfo = tabData.group_data_by_group_id[groupId];
      const groupName = groupInfo?.group_name || `Group ${groupId}`;
      const groupMeasurements = tabData.caliper_measurements[groupId];
      if (groupMeasurements) {
        updateMouseDataForGroup(
          groupMeasurements,
          groupName,
          tabData,
          updatedMouseData
        );
      }
    }

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
      title="Caliper History Grouped"
      description="View the history of caliper grouped measurements across different experimental conditions."
      className="h-dvh max-w-dvw flex flex-col overflow-y-auto rounded-none"
      showClose={true}
      trigger={null}
    >
      <div className="py-4 flex-1 overflow-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">
              Loading caliper history...
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-destructive">
              Unable to load caliper history. Please try again later.
            </div>
          </div>
        )}

        {!isLoading && !error && !apiResponse?.data?.tabs?.length && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">
              No caliper history data available for this experiment.
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
                    title={experimentName}
                    sex={tab.metadata.sex}
                    strain={tab.metadata.strain}
                    dob={tab.metadata.date_of_birth}
                    cellInjDate={tab.metadata.cell_injection_date}
                    cellLine={tab.metadata.cell_line}
                  />

                  <CaliperGroupedTable data={convertToLegacyFormat(tab)} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default CaliperHistoryGroupModal;
