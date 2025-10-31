import { UploadCloud, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { ExperimentSelect, ProjectSelect } from "@/components/atoms/Selects";

import { Button, Input } from "../atoms";
import { Label } from "../atoms/Label/Label";
import { CustomSelect } from "./CustomSelect";

export default function UploadPanel(props: any) {
  const {
    formData,
    setFormData,
    isCreatingNewProject,
    errors,
    existingProjects,
    existingExperiments,
    specialisationOptions,
    studyTypeOptions,
    getDataTypeOptions,
    handleSubmit,
    onShowCreateProjectModal,
    onShowCreateExperimentModal,
    onProjectChange,
  } = props;

  const isProjectSelected = !!formData.project;
  const isSpecialisationSelected = !!formData.specialisation;
  const isStudyTypeSelected = !!formData.studyType;
  const isExperimentSelected =
    !!formData.experiment || formData.studyType === "Efficacy";
  const isDataTypeSelected = !!formData.dataType;

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

  return (
    <>
      <h2 className="text-xl font-semibold mb-0 text-foreground">
        Dataset Upload
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Follow the hierarchy to upload your research data
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project">Project</Label>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              {!isCreatingNewProject ? (
                <ProjectSelect
                  projects={existingProjects}
                  value={formData.project?.id || ""}
                  onValueChange={(val: string) => {
                    const project = existingProjects.find(
                      (p: any) => p.id === val
                    );
                    if (onProjectChange) {
                      onProjectChange(project || null);
                    } else {
                      setFormData((prev: any) => ({
                        ...prev,
                        project: project || null,
                      }));
                    }
                  }}
                  onCreateNew={() => onShowCreateProjectModal?.()}
                />
              ) : (
                <Input
                  placeholder="Enter new project name"
                  value={formData.newProjectName}
                  size={"default"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      newProjectName: e.target.value,
                    }))
                  }
                />
              )}
            </div>
          </div>
          {errors.project && (
            <span className="text-sm text-red-500">{errors.project}</span>
          )}
        </div>

        {/* Specialisation */}
        <div className="space-y-2">
          <Label
            htmlFor="specialisation"
            className={`${!isProjectSelected ? "text-muted-foreground" : ""}`}
          >
            Specialisation
          </Label>
          <CustomSelect
            options={specialisationOptions}
            placeholder="Select specialisation"
            value={formData.specialisation}
            onValueChange={(value: string | string[]) => {
              const selectedValue =
                typeof value === "string" ? value : value[0];
              setFormData((prev: any) => ({
                ...prev,
                specialisation: selectedValue,
              }));
            }}
            disabled={!isProjectSelected}
            className={
              !isProjectSelected
                ? "opacity-50 cursor-not-allowed w-full"
                : "w-full"
            }
          />
          {!isProjectSelected && (
            <span className="text-xs text-muted-foreground">
              Please select a project to continue
            </span>
          )}
          {errors.specialisation && (
            <span className="text-sm text-red-500">
              {errors.specialisation}
            </span>
          )}
        </div>

        {/* Study Type */}
        <div className="space-y-2">
          <Label
            htmlFor="studyType"
            className={`${!isSpecialisationSelected ? "text-muted-foreground" : ""}`}
          >
            Study Type
          </Label>
          <CustomSelect
            options={studyTypeOptions}
            placeholder="Select study type"
            value={formData.studyType}
            onValueChange={(value: string | string[]) => {
              const selectedValue =
                typeof value === "string" ? value : value[0];
              setFormData((prev: any) => ({
                ...prev,
                studyType: selectedValue,
              }));
            }}
            disabled={!isSpecialisationSelected}
            className={
              !isSpecialisationSelected
                ? "opacity-50 cursor-not-allowed w-full"
                : "w-full"
            }
          />
          {!isSpecialisationSelected && (
            <span className="text-xs text-muted-foreground">
              Please select specialisation to continue
            </span>
          )}
          {errors.studyType && (
            <span className="text-sm text-red-500">{errors.studyType}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Experiment */}
        <div className="space-y-2">
          <Label
            htmlFor="experiment"
            className={`${!isStudyTypeSelected ? "text-muted-foreground" : ""}`}
          >
            Experiment
          </Label>

          <ExperimentSelect
            experiments={existingExperiments.filter(
              (e: any) =>
                e.projectId === formData.project?.id &&
                e.studyType === formData.studyType
            )}
            value={formData.experiment?.id || ""}
            onValueChange={(val: string) => {
              const experiment = existingExperiments.find(
                (e: any) => e.id === val
              );
              setFormData((prev: any) => ({
                ...prev,
                experiment: experiment || null,
              }));
            }}
            onCreateNew={() => onShowCreateExperimentModal?.()}
            className={
              !isStudyTypeSelected
                ? "opacity-50 cursor-not-allowed w-full"
                : "w-full"
            }
          />

          {!isStudyTypeSelected && (
            <span className="text-xs text-muted-foreground">
              Please select study type to continue
            </span>
          )}
          {errors.experiment && (
            <span className="text-sm text-red-500">{errors.experiment}</span>
          )}
        </div>

        {/* Data Type */}
        <div className="space-y-2">
          <Label
            htmlFor="dataType"
            className={`${!isExperimentSelected ? "text-muted-foreground" : ""}`}
          >
            Data Type
          </Label>
          <CustomSelect
            options={getDataTypeOptions()}
            placeholder="Select data type"
            value={formData.dataType}
            onValueChange={(value: string | string[]) => {
              const selectedValue =
                typeof value === "string" ? value : value[0];
              setFormData((prev: any) => ({
                ...prev,
                dataType: selectedValue,
              }));
            }}
            disabled={!isExperimentSelected}
            className={
              !isExperimentSelected
                ? "opacity-50 cursor-not-allowed w-full"
                : "w-full"
            }
          />
          {!isExperimentSelected && (
            <span className="text-xs text-muted-foreground">
              Please select experiment to continue
            </span>
          )}
          {errors.dataType && (
            <span className="text-sm text-red-500">{errors.dataType}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          className={`${!isDataTypeSelected ? "text-muted-foreground" : ""}`}
        >
          {formData.dataType ? `Upload ${formData.dataType}` : "Upload File"}
        </Label>
        <div
          className={`border-dashed border-2 rounded-xl p-0 flex flex-col items-center justify-center min-h-56 ${
            !isDataTypeSelected
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
              disabled={!isDataTypeSelected || isUploading}
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
              disabled={!isDataTypeSelected || isUploading}
              className={
                !isDataTypeSelected || isUploading
                  ? "opacity-50 cursor-not-allowed py-2"
                  : ""
              }
              onClick={() => {
                if (isDataTypeSelected && !isUploading) {
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
        {!isDataTypeSelected && (
          <span className="text-xs text-muted-foreground">
            Please select data type to continue
          </span>
        )}
      </div>

      {formData.uploadedFiles && formData.uploadedFiles.length > 0 && (
        <div className="space-y-2 mt-4">
          <Label className="text-sm font-medium">Uploaded Files</Label>
          <div className="space-y-2">
            {formData.uploadedFiles.map((file: File, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <UploadCloud
                    size={20}
                    className="text-primary flex-shrink-0"
                  />
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
      )}

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={
            !formData.project ||
            !formData.specialisation ||
            !formData.studyType ||
            !formData.dataType
          }
        >
          Upload Data
        </Button>
      </div>
    </>
  );
}
