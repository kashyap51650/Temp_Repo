import { UploadCloud } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/atoms/Label/Label";
import type { ExperimentDropdownItem, Project } from "@/lib/api";
import { FILE_SIZE_LIMITS, FILE_TYPES } from "@/lib/constants";

interface FormData {
  project: Project | null;
  specialisation: string;
  studyType: string;
  experiment: ExperimentDropdownItem | null;
  dataType: string;
  uploadedFile: File | null;
  newExperimentName?: string;
  uploadAGCFile?: File | null;
}

interface FileUploadAreaProps {
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
  isProjectSelected: boolean;
  isHotlabSelected: boolean;
  isPreclinicSelected: boolean;
  isSpecialisationSelected: boolean;
  isDataTypeSelected: boolean;
  isAgcUploadApplicable?: boolean;
}

export function FileUploadArea({
  formData,
  setFormData,
  isProjectSelected,
  isHotlabSelected,
  isPreclinicSelected,
  isSpecialisationSelected,
  isDataTypeSelected,
  isAgcUploadApplicable = false,
}: Readonly<FileUploadAreaProps>) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

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

  const validateXlsxFile = (file: File): boolean => {
    const isValidExtension = FILE_TYPES.EXCEL.EXTENSIONS.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    const isValidMimeType = (
      FILE_TYPES.EXCEL.MIME_TYPES as readonly string[]
    ).includes(file.type);

    if (!isValidExtension && !isValidMimeType) {
      toast.error("Invalid file type. Please upload an Excel file (.xlsx).");
      return false;
    }

    if (file.size > FILE_SIZE_LIMITS.EXCEL_FILE) {
      toast.error(
        "File size too large. Please upload a file smaller than 10MB."
      );
      return false;
    }

    return true;
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!validateXlsxFile(file)) {
      return;
    }

    setFormData((prev: FormData) => ({
      ...prev,
      uploadedFile: isAgcUploadApplicable ? null : file,
      uploadAGCFile: isAgcUploadApplicable ? file : null,
    }));
    setIsUploading(true);
    toast.success(`File "${file.name}" selected successfully!`);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (isUploadDisabled) {
      toast.error("Please complete the required selections before uploading.");
      return;
    }

    const files = e.dataTransfer.files;
    handleFileSelection(files);
  };

  const isUploadDisabled =
    !isProjectSelected ||
    (isHotlabSelected && !isSpecialisationSelected) ||
    (isPreclinicSelected && !isDataTypeSelected) ||
    isUploading;

  const generateLabelText = () => {
    if (isAgcUploadApplicable) {
      return "Upload AGC Data File (.xlsx)";
    }

    if (formData.dataType) {
      return `Upload ${formData.dataType} (.xlsx)`;
    }
    return "Upload Excel File (.xlsx)";
  };

  const generateButtonText = () => {
    if (isAgcUploadApplicable) {
      if (formData.uploadAGCFile) {
        if (isUploading) {
          return `Processing ${formData.uploadAGCFile.name}...`;
        } else {
          return `Selected: ${formData.uploadAGCFile.name}`;
        }
      }
      return "Upload AGC Data File (.xlsx)";
    }

    if (formData.uploadedFile) {
      if (isUploading) {
        return `Processing ${formData.uploadedFile.name}...`;
      } else {
        return `Selected: ${formData.uploadedFile.name}`;
      }
    }

    if (formData.dataType) {
      return `Upload ${formData.dataType} file (.xlsx)`;
    }

    return "Upload Excel File (.xlsx)";
  };
  return (
    <div className="space-y-2">
      <Label
        className={`${
          isPreclinicSelected && !isDataTypeSelected
            ? "text-muted-foreground"
            : ""
        }`}
      >
        {generateLabelText()}
      </Label>
      <div
        className={`border-dashed border-2 rounded-xl p-0 flex flex-col items-center justify-center min-h-56 transition-colors ${
          isUploadDisabled
            ? "opacity-50 cursor-not-allowed border-gray-300"
            : isDragging
              ? "border-primary bg-primary/5"
              : "border-primary/20 hover:border-primary/40"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center w-full h-full p-10">
          <UploadCloud size={50} className="text-dark mb-3" />
          <Input
            ref={fileInputRef}
            type="file"
            id="file-upload"
            accept={FILE_TYPES.EXCEL.ACCEPT}
            disabled={isUploadDisabled}
            className="hidden"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFileSelection(e.target.files);
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
                fileInputRef.current?.click();
              }
            }}
          >
            {generateButtonText()}
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
                Processing... {uploadProgress}%
              </div>
            </div>
          )}
          <span className="text-sm text-muted-foreground mt-3">
            {isDragging
              ? "Drop your Excel file here"
              : "Click or drag & drop your Excel file (.xlsx) here"}
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
