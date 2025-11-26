import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Label } from "@/components/atoms/Label/Label";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
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
}: DynamicMasterDataFormModalProps): ReactElement {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateFormFields = () => {
    if (sampleData.length > 0 || initialData) {
      const sampleItem = initialData || sampleData[0] || {};
      const excludedKeys = [
        "id",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
        "creator", // Exclude creator object
        "updator", // Exclude updator object
        "createdBy", // Exclude extracted email
        "updatedBy", // Exclude extracted email
      ];

      return Object.keys(sampleItem)
        .filter((key) => !excludedKeys.includes(key))
        .map((key) => {
          const value = sampleItem[key];
          const fieldType =
            typeof value === "number"
              ? "number"
              : key.includes("description")
                ? "textarea"
                : "text";

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
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
          placeholder: "Enter drug description",
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

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        const editableData: Record<string, any> = {};
        formFields.forEach((field) => {
          editableData[field.key] = initialData[field.key] || "";
        });
        setFormData(editableData);
      } else {
        const emptyData: Record<string, any> = {};
        formFields.forEach((field) => {
          emptyData[field.key] = field.type === "number" ? "" : "";
        });
        setFormData(emptyData);
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData, formFields.length]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    formFields.forEach((field) => {
      if (
        field.required &&
        (!formData[field.key] || formData[field.key] === "")
      ) {
        newErrors[field.key] = `${field.label} is required`;
      }

      if (field.type === "number" && formData[field.key] !== "") {
        const numValue = Number(formData[field.key]);
        if (isNaN(numValue)) {
          newErrors[field.key] = `${field.label} must be a valid number`;
        }
      }
    });

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

      formFields.forEach((field) => {
        if (field.type === "number" && processedData[field.key] !== "") {
          processedData[field.key] = Number(processedData[field.key]);
        }
      });

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

            {field.type === "textarea" ? (
              <Textarea
                id={field.key}
                value={String(formData[field.key] ?? "")}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className={errors[field.key] ? "border-destructive" : ""}
              />
            ) : (
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
            )}

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
            {loading ? "Saving..." : mode === "add" ? "Add" : "Save"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
