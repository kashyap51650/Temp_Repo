import { UploadCloud } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/atoms/Label/Label";

interface FileUploadAreaProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  isProjectSelected: boolean;
  isHotlabSelected: boolean;
  isPreclinicSelected: boolean;
  isSpecialisationSelected: boolean;
  isDataTypeSelected: boolean;
}

export function FileUploadArea({
  formData,
  setFormData,
  isProjectSelected,
  isHotlabSelected,
  isPreclinicSelected,
  isSpecialisationSelected,
  isDataTypeSelected,
}: FileUploadAreaProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (isUploading) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isUploading]);

  const isUploadDisabled =
    !isProjectSelected ||
    (isHotlabSelected && !isSpecialisationSelected) ||
    (isPreclinicSelected && !isDataTypeSelected) ||
    isUploading;

  return (
    <div className="space-y-2">
      <Label
        className={`${isPreclinicSelected && !isDataTypeSelected ? "text-muted-foreground" : ""}`}
      >
        {formData.dataType ? `Upload ${formData.dataType}` : "Upload File"}
      </Label>
      <div
        className={`border-dashed border-2 rounded-xl p-0 flex flex-col items-center justify-center min-h-56 ${
          isUploadDisabled
            ? "opacity-50 cursor-not-allowed border-gray-300"
            : "border-primary/20 hover:border-primary/40"
        }`}
      >
        <div className="flex flex-col items-center justify-center w-full h-full p-10">
          <UploadCloud size={50} className="text-dark mb-3" />
          <Input
            type="file"
            id="file-upload"
            multiple
            disabled={isUploadDisabled}
            className="hidden"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              if (files.length > 0) {
                setFormData((prev: any) => ({
                  ...prev,
                  uploadedFiles: [...(prev.uploadedFiles || []), ...files],
                }));
                setIsUploading(true);
              }
            }}
          />
          <Button
            variant="outline"
            size="lg"
            disabled={isUploadDisabled}
            className={
              isUploadDisabled ? "opacity-50 cursor-not-allowed py-2" : ""
            }
            onClick={() => {
              if (!isUploadDisabled) {
                document.getElementById("file-upload")?.click();
              }
            }}
          >
            {formData.uploadedFiles && formData.uploadedFiles.length > 0
              ? isUploading
                ? `Uploading ${formData.uploadedFiles.length} file(s)...`
                : `${formData.uploadedFiles.length} file(s) selected`
              : formData.dataType
                ? `Upload file`
                : "Upload File"}
          </Button>

          {isUploading && (
            <div className="w-10/12 mx-auto mt-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-2 bg-primary rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-center">
                Uploading... {uploadProgress}%
              </div>
            </div>
          )}
          <span className="text-sm text-muted-foreground mt-3">
            Click or drag file to this area to upload
          </span>
        </div>
      </div>
      {!isProjectSelected && (
        <span className="text-xs text-muted-foreground">
          Please select a project to continue
        </span>
      )}
      {isProjectSelected && isHotlabSelected && !isSpecialisationSelected && (
        <span className="text-xs text-muted-foreground">
          Please complete specialisation selection to continue
        </span>
      )}
      {isPreclinicSelected && !isDataTypeSelected && (
        <span className="text-xs text-muted-foreground">
          Please select data type to continue
        </span>
      )}
    </div>
  );
}
