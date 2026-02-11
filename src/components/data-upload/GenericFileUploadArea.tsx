import { UploadCloud } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { ExperimentDropdownItem, Project } from "@/api";
import { Button, Input } from "@/components/atoms";
import { Label } from "@/components/atoms/Label/Label";
import {
  FILE_SIZE_LIMITS,
  FILE_TYPES,
  type FileTypeConfig,
} from "@/lib/constants";

interface FormData {
  project: Project | null;
  specialisation: string;
  studyType: string;
  experiment: ExperimentDropdownItem | null;
  dataType: string;
  dataTypeId: number | null;
  uploadedFile: File | null;
  newExperimentName?: string;
  uploadAGCFile?: File | null;
}

interface GenericFileUploadAreaProps {
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
  isDisabled?: boolean;
  fileType?: FileTypeConfig | FileTypeConfig[];
  maxFileSize?: number;
  customValidation?: (file: File) => {
    isValid: boolean;
    errorMessage?: string;
  };
  fileFieldName?: "uploadedFile" | "uploadAGCFile";
  labelText?: string;
  bottomText?: string;
}

export function GenericFileUploadArea({
  formData,
  setFormData,
  isDisabled,
  fileType = FILE_TYPES.EXCEL,
  maxFileSize = FILE_SIZE_LIMITS.EXCEL_FILE,
  customValidation,
  fileFieldName = "uploadedFile",
  labelText,
  bottomText,
}: Readonly<GenericFileUploadAreaProps>) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));

  const fileTypes = Array.isArray(fileType) ? fileType : [fileType];

  const getAllExtensions = (): string[] => {
    return fileTypes.flatMap((ft) => ft.EXTENSIONS);
  };

  const getAllMimeTypes = (): string[] => {
    return fileTypes.flatMap((ft) => ft.MIME_TYPES);
  };

  const getAllAcceptValues = (): string => {
    return fileTypes.map((ft) => ft.ACCEPT).join(",");
  };

  const getDisplayNames = (): string => {
    if (fileTypes.length === 1) {
      return fileTypes[0].DISPLAY_NAME;
    }
    return fileTypes.map((ft) => ft.DISPLAY_NAME).join(" or ");
  };

  const getDisplayExtensions = (): string => {
    const extensions = getAllExtensions();
    return extensions.join(", ");
  };

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

  const validateFile = (file: File): boolean => {
    if (customValidation) {
      const result = customValidation(file);
      if (!result.isValid) {
        toast.error(result.errorMessage || "File validation failed.");
        return false;
      }
      return true;
    }

    const validExtensions = getAllExtensions();
    const validMimeTypes = getAllMimeTypes();

    const isValidExtension = validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    const isValidMimeType = validMimeTypes.includes(file.type);

    if (!isValidExtension && !isValidMimeType) {
      toast.error(
        `Invalid file type. Please upload a ${getDisplayNames()} file (${getDisplayExtensions()}).`
      );
      return false;
    }

    if (file.size > maxFileSize) {
      toast.error(
        `File size too large. Please upload a file smaller than ${maxSizeMB}MB.`
      );
      return false;
    }

    return true;
  };

  const handleFileSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!validateFile(file)) {
      return;
    }

    setFormData((prev: FormData) => ({
      ...prev,
      [fileFieldName]: file,
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

  const isUploadDisabled = isDisabled || isUploading;

  const generateLabelText = () => {
    if (labelText) return labelText;

    const extensions = getDisplayExtensions();

    if (formData.dataType) {
      return `Upload ${formData.dataType} (${extensions})`;
    }
    return `Upload ${getDisplayNames()} File (${extensions})`;
  };

  const generateButtonText = () => {
    const extensions = getDisplayExtensions();
    const selectedFile = formData[fileFieldName];

    if (selectedFile) {
      if (isUploading) {
        return `Processing ${selectedFile.name}...`;
      }
      return `Selected: ${selectedFile.name}`;
    }

    if (formData.dataType) {
      return `Upload ${formData.dataType} file (${extensions})`;
    }

    return `Upload ${getDisplayNames()} File (${extensions})`;
  };

  const getDropZoneClasses = () => {
    const baseClasses =
      "border-dashed border-2 rounded-xl p-0 flex flex-col items-center justify-center min-h-56 transition-colors w-full";

    if (isUploadDisabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed border-gray-300`;
    }

    if (isDragging) {
      return `${baseClasses} border-primary bg-primary/5`;
    }

    return `${baseClasses} border-primary/20 hover:border-primary/40`;
  };

  return (
    <div className="space-y-2">
      <Label className={`${isUploadDisabled ? "text-muted-foreground" : ""}`}>
        {generateLabelText()}
      </Label>
      <div // NOSONAR - Using semantic <div> with ARIA attributes instead of role="button" because actual button element exists inside for keyboard interaction
        aria-label="File upload drop zone"
        aria-describedby="upload-instruction"
        className={getDropZoneClasses()}
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
            id={`file-upload-${fileFieldName}`}
            accept={getAllAcceptValues()}
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
                <div // NOSONAR - Using div with ARIA progressbar for custom styling; native <progress> doesn't support rounded styling
                  className="h-2 bg-primary rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="File upload progress"
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-center">
                Processing... {uploadProgress}%
              </div>
            </div>
          )}
          <span
            id="upload-instruction"
            className="text-sm text-muted-foreground mt-3"
          >
            {isDragging
              ? `Drop your ${getDisplayNames()} file here`
              : `Click or drag & drop your ${getDisplayNames()} file (${getDisplayExtensions()}) here`}
          </span>
        </div>
      </div>
      {bottomText && (
        <span className="text-xs text-muted-foreground">{bottomText}</span>
      )}
    </div>
  );
}
