import { ORGAN_KEYS } from "@/lib/constants";
import type {
  BioDOrganData,
  BioDOrganRow,
  ExperimentDataForBioDOrganSheetResponse,
} from "@/types/organ-sheet";

/* ---------------------------------- utils --------------------------------- */

const formatDateTime = (value: string | number | null): string => {
  if (!value || typeof value !== "string") return "";

  try {
    const date = new Date(value);
    const datePart = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const timePart = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${datePart} ${timePart}`;
  } catch {
    return value.toString();
  }
};

const buildMouseDataMap = (
  mouseList: string[],
  resolver: (mouseCode: string) => string
): Record<string, string> =>
  mouseList.reduce(
    (acc, mouseCode) => {
      acc[mouseCode] = resolver(mouseCode);
      return acc;
    },
    {} as Record<string, string>
  );

/* ------------------------------ main function ------------------------------ */

export const generateBioDOrganData = (
  uploadedData: ExperimentDataForBioDOrganSheetResponse["uploaded_data"]
): BioDOrganData => {
  const { groups, organs, mice, organ_weights } = uploadedData;

  const mouseList = Object.keys(mice).sort();

  /* ---------------------------- group data helper --------------------------- */

  const createGroupedData = (
    getValueByGroup: (groupCode: string) => string
  ) => {
    const groupedData: Record<
      string,
      {
        value: string;
        colspan: number;
        startColumn: string;
        endColumn: string;
      }
    > = {};

    const regularData: Record<string, string> = {};
    const miceByGroup: Record<string, string[]> = {};

    mouseList.forEach((mouseCode) => {
      const groupCode = mouseCode.charAt(0);
      miceByGroup[groupCode] ??= [];
      miceByGroup[groupCode].push(mouseCode);
    });

    Object.entries(miceByGroup).forEach(([groupCode, groupMice]) => {
      groupedData[groupCode] = {
        value: getValueByGroup(groupCode),
        colspan: groupMice.length,
        startColumn: groupMice[0],
        endColumn: groupMice[groupMice.length - 1],
      };
    });

    mouseList.forEach((mouseCode) => {
      regularData[mouseCode] = getValueByGroup(mouseCode.charAt(0));
    });

    return { groupedData, regularData };
  };

  /* ------------------------------ fixed rows -------------------------------- */

  const longGroupData = createGroupedData(
    (groupCode) => groups[groupCode]?.group_name ?? ""
  );

  const shortGroupData = createGroupedData(
    (groupCode) => groups[groupCode]?.short_group_name ?? ""
  );

  const cellLineData = createGroupedData(
    (groupCode) => groups[groupCode]?.cell_line.cell_line_name ?? ""
  );

  const drugNameData = createGroupedData(
    (groupCode) => groups[groupCode]?.experiment_drug.drug_name ?? ""
  );

  const fixedRows: BioDOrganRow[] = [
    {
      id: "longGroupName",
      label: "Long Group Name",
      isRequired: true,
      data: longGroupData.regularData,
      groupedData: longGroupData.groupedData,
    },
    {
      id: "shortGroupName",
      label: "Short Group Name",
      isRequired: true,
      data: shortGroupData.regularData,
      groupedData: shortGroupData.groupedData,
    },
    {
      id: "cellLine",
      label: "Cell line",
      isRequired: true,
      data: cellLineData.regularData,
      groupedData: cellLineData.groupedData,
    },
    {
      id: "drugName",
      label: "Drug Name",
      isRequired: true,
      data: drugNameData.regularData,
      groupedData: drugNameData.groupedData,
    },
  ];

  /* ------------------------------ time rows --------------------------------- */

  const timeRows: BioDOrganRow[] = [
    {
      id: "injection_time",
      label: "212Pb injection time",
      data: buildMouseDataMap(mouseList, (mouseCode) =>
        formatDateTime(
          organ_weights[ORGAN_KEYS.INJECTION_TIME]?.[mouseCode]?.value ?? null
        )
      ),
    },
    {
      id: "necropsy_time",
      label: "Necropsy time",
      data: buildMouseDataMap(mouseList, (mouseCode) =>
        formatDateTime(
          organ_weights[ORGAN_KEYS.NECROPSY_TIME]?.[mouseCode]?.value ?? null
        )
      ),
    },
  ];

  /* ------------------------------ organ rows -------------------------------- */

  const organRows: BioDOrganRow[] = Object.values(organs).map((organ) => ({
    id: organ.organ_name.toLowerCase().replace(/\s+/g, ""),
    label: organ.organ_name,
    data: buildMouseDataMap(
      mouseList,
      (mouseCode) =>
        organ_weights[organ.organ_name]?.[mouseCode]?.value?.toString() ?? ""
    ),
  }));

  /* -------------------------------- result --------------------------------- */

  return {
    mouse: mouseList,
    rows: [...fixedRows, ...timeRows, ...organRows],
  };
};
