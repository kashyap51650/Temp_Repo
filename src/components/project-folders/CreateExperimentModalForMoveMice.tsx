import { useEffect, useState } from "react";

import { Button, Dialog, Label } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";
import { useStudyTypes } from "@/hooks/useStudyTypes";

interface CreateExperimentModalForMoveMiceProps {
  isOpen: boolean;
  onClose: () => void;
  onStudyTypeSelected: (studyTypeId: string, studyTypeName: string) => void;
}

export function CreateExperimentModalForMoveMice({
  isOpen,
  onClose,
  onStudyTypeSelected,
}: CreateExperimentModalForMoveMiceProps) {
  const [selectedStudyType, setSelectedStudyType] = useState<string>("");

  const { studyTypes, loading, error } = useStudyTypes({
    enabled: isOpen,
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedStudyType("");
    }
  }, [isOpen]);

  const handleStudyTypeChange = (value: string) => {
    setSelectedStudyType(value);

    const selectedStudyTypeData = studyTypes.find(
      (st) => st.id.toString() === value
    );

    if (selectedStudyTypeData) {
      onStudyTypeSelected(value, selectedStudyTypeData.study_type_name);
    }
  };

  const handleClose = () => {
    setSelectedStudyType("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleClose();
      }}
      showClose={false}
      className="max-w-lg"
      trigger={null}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between flex-col">
          <h2 className="text-xl font-semibold">Create New Experiment</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a study type to create a new experiment
          </p>
        </div>

        {/* Study Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Study Type</Label>

          {/* ✅ Show loading state while fetching */}
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading study types...
            </div>
          ) : error ? (
            <div className="text-center py-4 text-destructive">{error}</div>
          ) : (
            <Select
              value={selectedStudyType}
              onValueChange={handleStudyTypeChange}
              disabled={!!error}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select study type" />
              </SelectTrigger>
              <SelectContent>
                {studyTypes.map((studyType) => (
                  <SelectItem
                    key={studyType.id}
                    value={studyType.id.toString()}
                  >
                    {studyType.study_type_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Actions - Only Cancel button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
