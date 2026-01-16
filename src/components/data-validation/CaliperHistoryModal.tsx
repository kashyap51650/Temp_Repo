import { useState } from "react";

import { Dialog } from "@/components/atoms/Dialog/Dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules/Tabs/Tabs";
import { sampleCaliperHistoryResponse } from "@/data/caliperSampleData";

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

function ExperimentHeader(header: ExperimentHeaderProps) {
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
        <div className="space-y-3 grid grid-cols-2 w-10/12" key={groupIdx}>
          {group.map(({ key, label }) => {
            const value = header[key as keyof ExperimentHeaderProps];
            if (typeof value !== "string" && typeof value !== "undefined")
              return null;
            return (
              <div className="flex items-center gap-3" key={key}>
                <Label className="font-semibold text-sm w-56">{label}</Label>
                <span className="flex-1">{value || "—"}</span>
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
}

export default function CaliperHistoryModal({
  isOpen,
  onClose,
}: CaliperHistoryModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const apiData = sampleCaliperHistoryResponse.data;

  const convertToLegacyFormat = (
    tabData: (typeof apiData.tabs)[0]
  ): CaliperData => {
    const convertedMeasurements: Record<
      string,
      Record<string, Record<string, Measurement>>
    > = {};

    Object.entries(tabData.caliper_measurements).forEach(
      ([deliveryId, measurements]) => {
        const mouseInfo = (
          tabData.mouse_data_by_delivery_id as Record<string, any>
        )[deliveryId];
        const groupKey = mouseInfo?.mouse_code || deliveryId;

        if (!convertedMeasurements[groupKey]) {
          convertedMeasurements[groupKey] = {};
        }

        convertedMeasurements[groupKey][deliveryId] = {};

        Object.entries(measurements as Record<string, any>).forEach(
          ([date, measurementData]: [string, any]) => {
            const measurement: Measurement = {
              width_mm: measurementData.width_mm,
              length_mm: measurementData.length_mm,
              volume_mm3: measurementData.volume_mm3,
            };
            convertedMeasurements[groupKey][deliveryId][date] = measurement;
          }
        );
      }
    );

    const updatedMouseData: Record<string, any> = {};
    Object.entries(tabData.mouse_data_by_delivery_id).forEach(
      ([deliveryId, mouseInfo]: [string, any]) => {
        updatedMouseData[deliveryId] = {
          mouse_id: mouseInfo.id,
          group: mouseInfo.mouse_code,
          mouse_code: mouseInfo.mouse_code,
        };
      }
    );

    const caliperData: CaliperData = {
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
      title="Caliper History"
      description="View the history of individual mouse caliper measurements across different experimental conditions."
      className="h-dvh max-w-dvw flex flex-col overflow-y-auto rounded-none"
      showClose={true}
      trigger={null}
    >
      <div className="py-4 flex-1 overflow-auto">
        <div className="mb-6">
          <Tabs
            value={activeTab.toString()}
            onValueChange={(value) => setActiveTab(parseInt(value))}
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

                <CaliperDataTable data={convertToLegacyFormat(tab)} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </Dialog>
  );
}
