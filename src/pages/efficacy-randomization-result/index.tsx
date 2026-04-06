import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { EfficacyRandomizationResultView } from "@/components/randomization/EfficacyRandomizationResultView";
import { useEfficacyGroupRandomization } from "@/hooks/useEfficacyGroupRandomization";
import { useEfficacyRandomizationGroups } from "@/hooks/useEfficacyRandomizationGroups";
import type {
  EfficacyRandomizationPreviewData,
  EfficacyRandomizationPreviewGroup,
  EfficacyRandomizationSubgroup,
} from "@/types/efficacy-randomization";

interface EfficacyRandomizationResultPageProps {
  experimentId: number;
}

export default function EfficacyRandomizationResultPage({
  experimentId,
}: Readonly<EfficacyRandomizationResultPageProps>) {
  const navigate = useNavigate();

  const [previewData, setPreviewData] =
    useState<EfficacyRandomizationPreviewData | null>(null);

  const { data, isLoading, isError, error, isFetching } =
    useEfficacyRandomizationGroups(experimentId);

  const groups = useMemo(() => data?.data?.groups ?? [], [data]);

  const toSubgroup = (
    subgroup: EfficacyRandomizationPreviewGroup
  ): EfficacyRandomizationSubgroup => ({
    ...subgroup,
    average_measurement: Number(subgroup.average_measurement),
    std_deviation: Number(subgroup.std_deviation),
  });

  const mergedGroups = useMemo(() => {
    if (!previewData) {
      return groups;
    }

    const staySubgroup = toSubgroup(previewData.stay_group);
    const moveSubgroup = toSubgroup(previewData.move_group);

    return groups.map((group) => {
      if (group.group_id !== previewData.parent_group_id) {
        return group;
      }

      const subgroupById = new Map<number, EfficacyRandomizationSubgroup>([
        [staySubgroup.group_id, staySubgroup],
        [moveSubgroup.group_id, moveSubgroup],
      ]);

      const updatedSubgroups = group.subgroups.map(
        (subgroup) => subgroupById.get(subgroup.group_id) ?? subgroup
      );

      if (
        !updatedSubgroups.some(
          (subgroup) => subgroup.group_id === moveSubgroup.group_id
        )
      ) {
        updatedSubgroups.push(moveSubgroup);
      }

      return {
        ...group,
        subgroups: updatedSubgroups,
        mice_count: updatedSubgroups.reduce(
          (totalMice, subgroup) => totalMice + subgroup.mice.length,
          0
        ),
      };
    });
  }, [groups, previewData]);

  const {
    handleGroupAction,
    getGroupActionLabel,
    isGroupActionPending,
    getGroupPendingLabel,
  } = useEfficacyGroupRandomization({
    experimentId: experimentId,
    onPreviewSuccess: (previewData) => {
      setPreviewData(previewData);
    },
    onPreviewCleared: () => {
      setPreviewData(null);
    },
    onConfirmSuccess: () => {
      navigate({ to: "/data-validate" });
    },
  });

  return (
    <EfficacyRandomizationResultView
      groups={mergedGroups}
      isLoading={isLoading || isFetching}
      isError={isError}
      errorMessage={error instanceof Error ? error.message : undefined}
      onGroupAction={handleGroupAction}
      getGroupActionLabel={getGroupActionLabel}
      isGroupActionPending={isGroupActionPending}
      getGroupPendingLabel={getGroupPendingLabel}
    />
  );
}
