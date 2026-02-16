import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { API_CONFIG, apiClient } from "@/lib/api";
import { ORGAN_KEYS } from "@/lib/constants";
import queryClient from "@/lib/queryClient";
import type {
  BioDOrganData,
  BulkUpdatePayload,
  BulkUpdateResponse,
  ExperimentDataForBioDOrganSheetResponse,
} from "@/types/organ-sheet";

interface UseBioDOrganEditModalProps {
  experimentData: BioDOrganData;
  rawUploadedData: ExperimentDataForBioDOrganSheetResponse["uploaded_data"];
  experimentId: number;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

interface ChangedCell {
  rowId: string;
  mouseId: string;
  value: string;
  originalValue: string | number;
}

const updateBioDOrganData = async (
  experimentId: number,
  data: BulkUpdatePayload
) => {
  const response = await apiClient.patch<BulkUpdateResponse>(
    API_CONFIG.ENDPOINTS.ORGAN_WEIGHTS.BULK_UPDATE(experimentId),
    data
  );
  return response;
};

export const useBioDOrganEditModal = ({
  experimentData,
  rawUploadedData,
  experimentId,
  isOpen,
  onClose,
  onSaveSuccess,
}: UseBioDOrganEditModalProps) => {
  const [editableData, setEditableData] =
    useState<BioDOrganData>(experimentData);
  const [changedCells, setChangedCells] = useState<Map<string, ChangedCell>>(
    new Map()
  );
  const [changedGroupDrugs, setChangedGroupDrugs] = useState<
    Map<string, { groupId: number; drugId: number }>
  >(new Map());

  // Keep a ref to the latest experimentData to avoid stale closure issues
  const experimentDataRef = useRef(experimentData);

  // Update ref when experimentData changes
  useEffect(() => {
    experimentDataRef.current = experimentData;
  }, [experimentData]);

  // Reset editable data and changed cells when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditableData(experimentData);
      setChangedCells(new Map());
      setChangedGroupDrugs(new Map());
    }
  }, [isOpen, experimentData]);

  // Get mouse codes for a specific group
  const getMouseCodesForGroup = (groupCode: string) =>
    editableData.mouse.filter((m) => m.startsWith(groupCode));

  // Handle drug selection change for a group
  const handleDrugChange = (groupCode: string, drugId: string) => {
    const { groups } = rawUploadedData;
    const group = groups[groupCode];
    const originalDrugId = group?.experiment_drug.id;

    if (!group) return;

    const newDrugId = Number(drugId);

    if (Number.isNaN(newDrugId)) {
      return;
    }

    // Update editable data
    setEditableData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => {
        if (row.id === "drugName" && row.groupedData?.[groupCode]) {
          return {
            ...row,
            groupedData: {
              ...row.groupedData,
              [groupCode]: {
                ...row.groupedData[groupCode],
                value: drugId,
              },
            },
          };
        }
        return row;
      }),
    }));

    // Track changed drugs
    if (originalDrugId === newDrugId) {
      // Remove from changed if reverted to original
      setChangedGroupDrugs((prev) => {
        const newChanges = new Map(prev);
        newChanges.delete(groupCode);
        return newChanges;
      });
    } else {
      setChangedGroupDrugs((prev) => {
        const newChanges = new Map(prev);
        newChanges.set(groupCode, {
          groupId: group.id,
          drugId: newDrugId,
        });
        return newChanges;
      });
    }
  };

  // Get organ measurement ID and mouse ID from raw data
  const getOrganMeasurementIds = (rowId: string, mouseCode: string) => {
    const { organ_weights, mice, organs } = rawUploadedData;

    // Map rowId to organKey with fallback to special keys
    let organKey: string | undefined;

    if (rowId === "injection_time") {
      organKey = ORGAN_KEYS.INJECTION_TIME;
    } else if (rowId === "necropsy_time") {
      organKey = ORGAN_KEYS.NECROPSY_TIME;
    } else {
      const normalizedRowId = rowId.toLowerCase().replaceAll(/\s+/g, "");
      const organ = Object.values(organs).find(
        (o) =>
          o.organ_name.toLowerCase().replaceAll(/\s+/g, "") === normalizedRowId
      );
      organKey = organ?.organ_name;
    }

    if (!organKey) {
      return { measurementId: 0, mouseId: 0 };
    }

    const measurementId = organ_weights[organKey]?.[mouseCode]?.id ?? 0;
    const mouseId = mice[mouseCode]?.id ?? 0;

    return { measurementId, mouseId };
  };

  const trackCellChange = (
    rowId: string,
    mouseCode: string,
    value: string,
    newChangedCells: Map<string, ChangedCell>
  ) => {
    const originalValue = experimentDataRef.current.rows.find(
      (r) => r.id === rowId
    )?.data[mouseCode];
    const cellKey = `${rowId}-${mouseCode}`;

    if (originalValue === value) {
      newChangedCells.delete(cellKey);
    } else {
      newChangedCells.set(cellKey, {
        rowId,
        mouseId: mouseCode,
        value,
        originalValue: originalValue ?? "",
      });
    }
  };

  const updateRowForGroup = (
    row: BioDOrganData["rows"][0],
    rowId: string,
    groupCode: string,
    value: string,
    newChangedCells: Map<string, ChangedCell>
  ): BioDOrganData["rows"][0] => {
    const updatedData = { ...row.data };
    const mouseCodes = getMouseCodesForGroup(groupCode);

    for (const m of mouseCodes) {
      trackCellChange(rowId, m, value, newChangedCells);
      updatedData[m] = value;
    }

    const updatedGroupedData = row.groupedData
      ? { ...row.groupedData }
      : undefined;

    if (updatedGroupedData?.[groupCode]) {
      updatedGroupedData[groupCode] = {
        ...updatedGroupedData[groupCode],
        value: value,
      };
    }

    return {
      ...row,
      data: updatedData,
      groupedData: updatedGroupedData,
    };
  };

  const updateRowForIndividualCell = (
    row: BioDOrganData["rows"][0],
    rowId: string,
    mouseId: string,
    value: string,
    newChangedCells: Map<string, ChangedCell>
  ): BioDOrganData["rows"][0] => {
    trackCellChange(rowId, mouseId, value, newChangedCells);
    return { ...row, data: { ...row.data, [mouseId]: value } };
  };

  // Handle cell changes with support for group-wide updates for merged cells
  const handleCellChange = (
    rowId: string,
    mouseId: string,
    value: string,
    groupCode?: string
  ) => {
    const newChangedCells = new Map(changedCells);

    setEditableData((prev) => {
      const updatedRows = prev.rows.map((row) => {
        if (row.id !== rowId) return row;

        if (groupCode) {
          return updateRowForGroup(
            row,
            rowId,
            groupCode,
            value,
            newChangedCells
          );
        }

        return updateRowForIndividualCell(
          row,
          rowId,
          mouseId,
          value,
          newChangedCells
        );
      });

      return {
        ...prev,
        rows: updatedRows,
      };
    });

    setChangedCells(newChangedCells);
  };

  // Transform only changed cells to BulkUpdatePayload format
  const buildBulkUpdatePayload = (): BulkUpdatePayload => {
    const organ_weights: BulkUpdatePayload["organ_weights"] = [];
    const groups: BulkUpdatePayload["groups"] = [];
    // Only include changed cells
    for (const change of changedCells.values()) {
      if (
        change.value !== "" &&
        change.value !== null &&
        change.value !== undefined
      ) {
        const { measurementId, mouseId } = getOrganMeasurementIds(
          change.rowId,
          change.mouseId
        );

        // don't include if measurementId or mouseId is invalid
        if (measurementId === 0 || mouseId === 0) continue;

        organ_weights.push({
          id: measurementId,
          key: "weight_g",
          value:
            typeof change.value === "number"
              ? change.value
              : Number.parseFloat(String(change.value)) || 0,
          mouse_id: mouseId,
        });
      }
    }

    // Include changed group drugs
    for (const [groupCode, change] of changedGroupDrugs.entries()) {
      const group = rawUploadedData.groups[groupCode];
      if (group) {
        groups.push({
          id: change.groupId,
          group_name: group.group_name,
          group_code: group.group_code,
          short_group_name: group.short_group_name,
          experiment_drug_id: change.drugId,
          cell_line_id: group.cell_line.id,
        });
      }
    }

    return {
      groups,
      organ_weights,
    };
  };

  // Bulk update mutation
  const { mutate: bulkUpdate, isPending: isUpdating } = useMutation<
    BulkUpdateResponse,
    Error,
    BulkUpdatePayload,
    unknown
  >({
    mutationFn: (payload) => updateBioDOrganData(experimentId, payload),
    onSuccess: (response) => {
      const data = response.data;

      let updatedMessage = "";

      const organWeightCount = data?.organ_weights.successful || 0;
      const groupCount = data?.groups.successful || 0;

      if (organWeightCount) {
        updatedMessage = `${organWeightCount} organ measurement${organWeightCount > 1 ? "s" : ""}`;
      }

      if (groupCount) {
        if (updatedMessage) updatedMessage += " and ";
        updatedMessage += `${groupCount} group${groupCount > 1 ? "s" : ""}`;
      }

      if (updatedMessage) {
        toast.success(`Successfully updated ${updatedMessage}`);
      }

      if (data?.organ_weights.failed && data.organ_weights.failed > 0) {
        toast.warning(
          `Failed to update ${data.organ_weights.failed} organ measurements`
        );
      }
      queryClient.invalidateQueries({
        queryKey: ["experimentData"],
      });
      onSaveSuccess?.();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Error updating BioDosimetry Organ data: ${error.message}`);
    },
  });

  // Handle save action
  const handleSave = () => {
    const payload = buildBulkUpdatePayload();
    bulkUpdate(payload);
  };

  return {
    editableData,
    changedCells,
    changedGroupDrugs,
    isUpdating,
    handleCellChange,
    handleDrugChange,
    handleSave,
  };
};
