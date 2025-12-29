import { Dialog } from "../atoms";

const GraphViewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title="Graph View"
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <div className="py-4">
        {/* Graph content goes here */}
        <p>Graph view content will be displayed here.</p>
      </div>
    </Dialog>
  );
};

export default GraphViewModal;
