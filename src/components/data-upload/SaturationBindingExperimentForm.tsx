import type { ExperimentDropdownItem } from "@/api";
import { useSaturationBindingExperimentForm } from "@/hooks/useSaturationBindingExperimentForm";

import { Button } from "../atoms";
import { Form } from "../organisms";
import { ExperimentNameField } from "./FormFields";

interface SaturationBindingExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export default function SaturationBindingExperimentForm({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: SaturationBindingExperimentFormProps) {
  const { form, isCreating, handleCancel, handleSubmit } =
    useSaturationBindingExperimentForm({
      projectId,
      studyTypeId,
      specialization,
      onSuccess,
      onCancel,
    });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <ExperimentNameField control={form.control} name="experimentName" />
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size="lg"
            type="button"
            onClick={handleCancel}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button size="lg" type="submit" disabled={isCreating}>
            {isCreating ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
