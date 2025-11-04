import { UploadCloud, X } from "lucide-react";

import { Button } from "@/components/atoms";
import { Label } from "@/components/atoms/Label/Label";

interface UploadedFilesListProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
}

export function UploadedFilesList({
  formData,
  setFormData,
}: UploadedFilesListProps) {
  if (!formData.uploadedFiles || formData.uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-4">
      <Label>Uploaded Files</Label>
      <div className="space-y-2">
        {formData.uploadedFiles.map((file: File, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <UploadCloud size={20} className="text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFormData((prev: any) => ({
                  ...prev,
                  uploadedFiles: prev.uploadedFiles.filter(
                    (_: File, i: number) => i !== index
                  ),
                }));
              }}
              className="flex-shrink-0"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
