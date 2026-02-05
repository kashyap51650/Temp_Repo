import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Label } from "@/components/atoms/Label/Label";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import { CustomSelect } from "@/components/data-upload/CustomSelect";
import { useExperimentData } from "@/hooks/useExperimentData";
import type { MasterDataItem } from "@/hooks/useMasterData";
import type { MasterDataSource } from "@/hooks/useMasterDataSources";
import { formatFieldLabel } from "@/lib/utils";

interface DynamicMasterDataFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => Promise<void>;
  masterDataSource: MasterDataSource;
  initialData?: MasterDataItem | null;
  mode: "add" | "edit";
  sampleData?: MasterDataItem[];
}

export function DynamicMasterDataFormModal({
  isOpen,
  onClose,
  onSave,
  masterDataSource,
  initialData,
  mode,
  sampleData = [],
}: Readonly<DynamicMasterDataFormModalProps>): ReactElement {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load mouse strains for cell lines
  const {
    mouseStrains,
    loading: experimentDataLoading,
    loadExperimentData,
  } = useExperimentData();

  const isCellLines = masterDataSource.slug === "cell-lines";

  const generateFormFields = () => {
    if (sampleData.length > 0 || initialData) {
      const sampleItem = initialData || sampleData[0] || {};
      const excludedKeys = new Set([
        "id",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
        "creator", // Exclude creator object
        "updator", // Exclude updator object
        "createdBy", // Exclude extracted email
        "updatedBy", // Exclude extracted email
      ]);

      return Object.keys(sampleItem)
        .filter((key) => !excludedKeys.has(key))
        .map((key) => {
          const value = sampleItem[key];

          let fieldType: "text" | "number" | "textarea" = "text";
          if (typeof value === "number") {
            fieldType = "number";
          } else if (key.includes("description")) {
            fieldType = "textarea";
          }

          return {
            key,
            label: formatFieldLabel(key),
            type: fieldType,
            required: true,
            placeholder: `Enter ${formatFieldLabel(key).toLowerCase()}`,
          };
        });
    }

    return getDefaultFieldsForSlug(masterDataSource.slug);
  };

  const getDefaultFieldsForSlug = (slug: string) => {
    const defaultConfigs: Record<
      string,
      Array<{
        key: string;
        label: string;
        type: "text" | "number" | "textarea";
        required: boolean;
        placeholder: string;
      }>
    > = {
      isotopes: [
        {
          key: "isotope_name",
          label: "Isotope Name",
          type: "text",
          required: true,
          placeholder: "Enter isotope name (e.g., Iodine-131)",
        },
        {
          key: "half_life_hours",
          label: "Half Life Hours",
          type: "number",
          required: true,
          placeholder: "Enter half life in hours",
        },
      ],
      organs: [
        {
          key: "organ_name",
          label: "Organ Name",
          type: "text",
          required: true,
          placeholder: "Enter organ name (e.g., Liver)",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter organ description",
        },
      ],
      "cell-lines": [
        {
          key: "cell_line_name",
          label: "Cell Line Name",
          type: "text",
          required: true,
          placeholder: "Enter cell line name (e.g., HeLa)",
        },
        {
          key: "vendor_name",
          label: "Vendor Name",
          type: "text",
          required: true,
          placeholder: "Enter vendor name (e.g., ATCC)",
        },
        {
          key: "mouse_strain",
          label: "Mouse Strain",
          type: "text",
          required: true,
          placeholder: "Select mouse strain",
        },
      ],
      analytes: [
        {
          key: "analyte_name",
          label: "Analyte Name",
          type: "text",
          required: true,
          placeholder: "Enter analyte name",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter analyte description",
        },
      ],
      "mouse-strains": [
        {
          key: "strain_name",
          label: "Strain Name",
          type: "text",
          required: true,
          placeholder: "Enter mouse strain name",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter strain description",
        },
      ],
      "experiment-drugs": [
        {
          key: "drug_name",
          label: "Drug Name",
          type: "text",
          required: true,
          placeholder: "Enter drug name",
        },
        {
          key: "om_number",
          label: "Om Number",
          type: "text",
          required: true,
          placeholder: "Enter Om number",
        },
        {
          key: "drug_description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter drug description",
        },
      ],
      vehicles: [
        {
          key: "vehicle_name",
          label: "Vehicle Name",
          type: "text",
          required: true,
          placeholder: "Enter vehicle name",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter description",
        },
      ],
      "cell-injection-counts": [
        {
          key: "value",
          label: "Value",
          type: "text",
          required: true,
          placeholder: "Enter cell count",
        },
      ],
      "dose-values": [
        {
          key: "dose",
          label: "Dose",
          type: "number",
          required: true,
          placeholder: "Enter dose",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter description",
        },
      ],
      "dose-units": [
        {
          key: "unit_name",
          label: "Unit Name",
          type: "text",
          required: true,
          placeholder: "Enter unit name",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter description",
        },
      ],
      "dose-frequencies": [
        {
          key: "frequency_code",
          label: "Frequency Code",
          type: "text",
          required: true,
          placeholder: "Enter frequency code",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter description",
        },
      ],
    };

    return (
      defaultConfigs[slug] || [
        {
          key: "name",
          label: "Name",
          type: "text" as const,
          required: true,
          placeholder: "Enter name",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea" as const,
          required: false,
          placeholder: "Enter description (optional)",
        },
      ]
    );
  };

  const formFields = generateFormFields();

  const buildEditableData = (): Record<string, string | number> => {
    const editableData: Record<string, string | number> = {};

    for (const field of formFields) {
      if (field.key === "mouse_strain" && isCellLines) {
        editableData[field.key] =
          mouseStrains.find(
            (strain) => strain.mouse_strain_name === initialData?.[field.key]
          )?.id || "";
        continue;
      }

      editableData[field.key] = initialData?.[field.key] || "";
    }

    return editableData;
  };

  const buildEmptyData = (): Record<string, string> => {
    const emptyData: Record<string, string> = {};
    for (const field of formFields) {
      emptyData[field.key] = "";
    }
    return emptyData;
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Load mouse strains if it's cell lines master data
    if (isCellLines && mouseStrains.length === 0) {
      loadExperimentData();
    }

    if (mode === "edit" && initialData) {
      setFormData(buildEditableData());
    } else {
      setFormData(buildEmptyData());
    }

    setErrors({});
  }, [
    isOpen,
    mode,
    initialData,
    formFields.length,
    isCellLines,
    mouseStrains.length,
    loadExperimentData,
  ]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of formFields) {
      if (
        field.required &&
        (!formData[field.key] || formData[field.key] === "")
      ) {
        newErrors[field.key] = `${field.label} is required`;
      }

      if (field.type === "number" && formData[field.key] !== "") {
        const numValue = Number(formData[field.key]);
        if (Number.isNaN(numValue)) {
          newErrors[field.key] = `${field.label} must be a valid number`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const processedData = { ...formData };

      for (const field of formFields) {
        if (field.type === "number" && processedData[field.key] !== "") {
          processedData[field.key] = Number(processedData[field.key]);
        }
      }
      // Convert mouse_strain_id to number for cell lines
      if (isCellLines && processedData.mouse_strain) {
        processedData.mouse_strain_id = Number(processedData.mouse_strain);
        delete processedData.mouse_strain;
      }

      await onSave(processedData);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      setErrors({ general: "Failed to save. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  const renderTextareaField = (field: (typeof formFields)[0]) => (
    <Textarea
      id={field.key}
      value={String(formData[field.key] ?? "")}
      onChange={(e) => handleInputChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      rows={3}
      className={errors[field.key] ? "border-destructive" : ""}
    />
  );

  const renderMouseStrainSelect = (field: (typeof formFields)[0]) => (
    <CustomSelect
      options={mouseStrains.map((strain) => ({
        value: String(strain.id),
        label: strain.mouse_strain_name,
      }))}
      placeholder={field.placeholder}
      value={String(formData[field.key] ?? "")}
      onValueChange={(value) => handleInputChange(field.key, value as string)}
      disabled={experimentDataLoading.mouseStrains}
      className={errors[field.key] ? "border-destructive w-full" : "w-full"}
    />
  );

  const renderInputField = (field: (typeof formFields)[0]) => (
    <Input
      id={field.key}
      size="lg"
      type={field.type === "number" ? "number" : "text"}
      value={String(formData[field.key] ?? "")}
      onChange={(e) => handleInputChange(field.key, e.target.value)}
      placeholder={field.placeholder}
      className={errors[field.key] ? "border-destructive" : ""}
      min={field.type === "number" ? 0 : undefined}
      step={field.type === "number" ? "any" : undefined}
    />
  );

  const renderFieldInput = (field: (typeof formFields)[0]) => {
    if (field.type === "textarea") {
      return renderTextareaField(field);
    }

    if (isCellLines && field.key === "mouse_strain") {
      return renderMouseStrainSelect(field);
    }

    return renderInputField(field);
  };

  const getSubmitButtonText = () => {
    if (loading) {
      return "Saving...";
    }
    return mode === "add" ? "Add" : "Save";
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      trigger={null}
      title={
        mode === "add"
          ? `Add New ${masterDataSource.title}`
          : `Edit ${masterDataSource.title}`
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-sm text-destructive">{errors.general}</p>
          </div>
        )}

        {formFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {renderFieldInput(field)}
            {errors[field.key] && (
              <p className="text-sm text-destructive">{errors[field.key]}</p>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            type="button"
          >
            Cancel
          </Button>
          <Button size="lg" disabled={loading} type="submit">
            {getSubmitButtonText()}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
