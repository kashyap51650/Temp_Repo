import { Dialog } from "../atoms/Dialog/Dialog";
import {
  bioDOrganData,
  getBioDOrganTableColumns,
} from "../organisms/DataTable/tableData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../organisms/Table/Table";

interface BioDOrganViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
}

export function BioDOrganViewModal({
  isOpen,
  onClose,
}: BioDOrganViewModalProps) {
  const columns = getBioDOrganTableColumns(bioDOrganData);

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
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, idx) => (
                <TableHead
                  key={column.id || idx}
                  className="text-sm sticky left-0 z-10 bg-white min-w-28 px-2 h-14"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {bioDOrganData.rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-sm font-medium sticky bg-white left-0 z-10 px-2 h-14">
                  {row.label}
                </TableCell>
                {bioDOrganData.mouse.map((mouse, idx) => (
                  <TableCell key={idx} className="text-sm px-2 h-14">
                    {row.data[mouse] || ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Dialog>
  );
}
