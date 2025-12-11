import { type ColumnDef } from "@tanstack/react-table";

import { Dialog } from "../atoms/Dialog/Dialog";
import { DataTable } from "../organisms/DataTable/DataTable";
import { bioDOrganData } from "../organisms/DataTable/tableData";

interface BioDOrganViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
}

export function BioDOrganViewModal({
  isOpen,
  onClose,
}: BioDOrganViewModalProps) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "label",
      header: "Parameter",
      cell: ({ row }: { row: any }) => (
        <span className="font-medium text-sm">{row.original.label}</span>
      ),
    },
    ...bioDOrganData.mouse.map((mouseId) => ({
      accessorKey: mouseId,
      header: mouseId,
      cell: ({ row }: { row: any }) => (
        <span className="text-sm">{row.original.data[mouseId] || ""}</span>
      ),
    })),
  ];

  const tableRows = bioDOrganData.rows.map((row) => ({
    id: row.id,
    label: row.label,
    data: row.data,
    ...row.data,
  }));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title={`BioD Organ Data - View Only`}
      showClose={true}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
      trigger={null}
    >
      <div className="flex-1 overflow-auto mt-4">
        <DataTable columns={columns} data={tableRows} />
      </div>
    </Dialog>
  );
}
