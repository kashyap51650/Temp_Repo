export interface TableColumn {
  key: string;
  label: string;
}

export const TABLE_COLUMNS: TableColumn[] = [
  { key: "mouse", label: "Mouse #" },
  { key: "tumorVol", label: "Tumor Vol" },
];

const GROUP_COLORS_HEADER = [
  "bg-green-300",
  "bg-yellow-300",
  "bg-orange-300",
  "bg-red-300",
  "bg-pink-300",
  "bg-purple-300",
  "bg-blue-300",
  "bg-cyan-300",
  "bg-teal-300",
  "bg-lime-300",
];
const GROUP_COLORS_BODY = [
  "bg-green-100",
  "bg-yellow-100",
  "bg-orange-100",
  "bg-red-100",
  "bg-pink-100",
  "bg-purple-100",
  "bg-blue-100",
  "bg-cyan-100",
  "bg-teal-100",
  "bg-lime-100",
];
export const getGroupColorHeader = (idx: number) =>
  GROUP_COLORS_HEADER[idx % GROUP_COLORS_HEADER.length];

export const getGroupColorBody = (idx: number) =>
  GROUP_COLORS_BODY[idx % GROUP_COLORS_BODY.length];
