import { useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Label } from "@/components/atoms/Label/Label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/Dialog/Dialog";

interface AddGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupName: string) => void;
}

export function AddGroupDialog({
  isOpen,
  onClose,
  onSave,
}: AddGroupDialogProps) {
  const [groupName, setGroupName] = useState("");

  const handleSave = () => {
    if (groupName.trim()) {
      onSave(groupName.trim());
      setGroupName("");
      onClose();
    }
  };

  const handleClose = () => {
    setGroupName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && groupName.trim()) {
                  handleSave();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!groupName.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
