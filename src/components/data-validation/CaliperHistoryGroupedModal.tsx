import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules/Tabs/Tabs";
import { sampleCaliperApiResponse } from "@/data/caliperSampleData";

import { Dialog, Label } from "../atoms";
import type {
  GroupedCaliperData,
  GroupedMeasurement,
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
            if (typeof value !== "string" && typeof value !== "undefined")
              return null;
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

const CaliperHistoryGroupModal: React.FC<
  Readonly<{
    isOpen: boolean;
    onClose: () => void;
  }>
> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const apiData = sampleCaliperApiResponse.data;

  const convertToLegacyFormat = (
    tabData: (typeof apiData.tabs)[0]
  ): GroupedCaliperData => {
    const convertedMeasurements: Record<
      string,
      Record<string, Record<string, GroupedMeasurement>>
    > = {};

    const processMouseData = (
      groupName: string,
      deliveryId: string,
      mouseData: Record<string, any>
    ) => {
      convertedMeasurements[groupName][deliveryId] = {};
      Object.entries(mouseData).forEach(
        ([date, measurements]: [string, any]) => {
          const measurement: GroupedMeasurement = {
            id: 0,
            value: measurements.volume_mm3,
            type: "float",
            key: "volume_mm3",
            mouse_id: 0,
          };
          convertedMeasurements[groupName][deliveryId][date] = measurement;
        }
      );
    };

    Object.entries(tabData.caliper_measurements).forEach(
      ([groupId, groupData]) => {
        const groupInfo = (
          tabData.group_data_by_group_id as Record<string, any>
        )[groupId];
        const groupName = groupInfo?.group_name || `Group ${groupId}`;

        convertedMeasurements[groupName] = {};

        Object.entries(groupData).forEach(([deliveryId, mouseData]) => {
          processMouseData(
            groupName,
            deliveryId,
            mouseData as Record<string, any>
          );
        });
      }
    );

    // Update mouse_data_by_delivery_id to include group names
    const updatedMouseData: Record<string, any> = {};
    Object.entries(tabData.mouse_data_by_delivery_id).forEach(
      ([deliveryId, mouseInfo]: [string, any]) => {
        // Find which group this mouse belongs to by looking at the measurements
        let groupName = "Unknown";
        for (const [groupId, groupData] of Object.entries(
          tabData.caliper_measurements
        )) {
          if ((groupData as Record<string, any>)[deliveryId]) {
            const groupInfo = (
              tabData.group_data_by_group_id as Record<string, any>
            )[groupId];
            groupName = groupInfo?.group_name || `Group ${groupId}`;
            break;
          }
        }

        updatedMouseData[deliveryId] = {
          mouse_id: mouseInfo.id,
          group: groupName,
          mouse_code: mouseInfo.mouse_code,
        };
      }
    );

    const caliperData: GroupedCaliperData = {
      caliper_measurements_dates: tabData.caliper_measurements_dates,
      mouse_data_by_delivery_id: updatedMouseData,
      caliper_measurements: convertedMeasurements,
    };
    return caliperData;
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
        <div className="mb-6">
          <Tabs
            value={activeTab.toString()}
            onValueChange={(value) => setActiveTab(Number.parseInt(value))}
          >
            <TabsList>
              {apiData.tabs.map((tab, index) => (
                <TabsTrigger
                  key={tab.tab_id}
                  value={index.toString()}
                  className="text-sm"
                >
                  {tab.tab_label}
                </TabsTrigger>
              ))}
            </TabsList>

            {apiData.tabs.map((tab, index) => (
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

                <CaliperGroupedTable data={convertToLegacyFormat(tab)} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Dialog>
  );
};

export default CaliperHistoryGroupModal;
