import { useEffect, useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { Label } from "@/components/atoms/Label/Label";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/Dialog/Dialog";
import {
  type MasterDataConfig,
  type MasterDataItem,
} from "@/components/organisms/DataTable/tableData";

interface MasterDataFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MasterDataItem>) => Promise<void>;
  config: MasterDataConfig;
  initialData?: MasterDataItem | null;
  mode: "add" | "edit";
}

export function MasterDataFormModal({
  isOpen,
  onClose,
  onSave,
  config,
  initialData,
  mode,
}: MasterDataFormModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData(initialData as unknown as Record<string, unknown>);
      } else {
        const emptyData: Record<string, unknown> = {};
        config.fields.forEach((field) => {
          emptyData[field.key] = field.type === "number" ? "" : "";
        });
        setFormData(emptyData);
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData, config.fields]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const idFields = [
      "isotopeId",
      "organId",
      "cellLineId",
      "doseId",
      "vehicleId",
    ];

    config.fields
      .filter((field) => {
        if (mode === "edit" && idFields.includes(field.key)) {
          return false;
        }
        return true;
      })
      .forEach((field) => {
        if (
          field.required &&
          (!formData[field.key] || formData[field.key] === "")
        ) {
          newErrors[field.key] = `${field.label} is required`;
        }

        if (field.type === "number" && formData[field.key]) {
          const numValue = Number(formData[field.key]);
          if (isNaN(numValue)) {
            newErrors[field.key] = `${field.label} must be a valid number`;
          } else if (numValue <= 0) {
            newErrors[field.key] = `${field.label} must be greater than 0`;
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
      config.fields.forEach((field) => {
        if (field.type === "number" && processedData[field.key]) {
          processedData[field.key] = Number(processedData[field.key]);
        }
      });

      await onSave(processedData);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      if (
        error instanceof Error &&
        error.message === "Record already exists."
      ) {
        setErrors({ general: "Record already exists." });
      } else {
        setErrors({ general: "Failed to save. Please try again." });
      }
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? `Add New ${config.label}`
              : `Edit ${config.label}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          {config.fields
            .filter((field) => {
              if (mode === "edit") {
                const idFields = [
                  "isotopeId",
                  "organId",
                  "cellLineId",
                  "doseId",
                  "vehicleId",
                ];
                return !idFields.includes(field.key);
              }
              return true;
            })
            .map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>

                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    value={String(formData[field.key] ?? "")}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    placeholder={field.placeholder}
                    className={errors[field.key] ? "border-destructive" : ""}
                    min={field.type === "number" ? 0 : undefined}
                    step={field.type === "number" ? "any" : undefined}
                  />
                )}

                {errors[field.key] && (
                  <p className="text-sm text-destructive">
                    {errors[field.key]}
                  </p>
                )}
              </div>
            ))}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              size={"lg"}
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button size={"lg"} disabled={loading}>
              {loading ? "Saving..." : mode === "add" ? "Add" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
