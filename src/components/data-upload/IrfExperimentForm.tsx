import type { ExperimentDropdownItem } from "@/api";
import { useIrfExperimentForm } from "@/hooks/useIrfExperimentForm";

import { Button } from "../atoms";
import { Form } from "../organisms";
import { ExperimentNameField } from "./FormFields";

interface IrfExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export default function IrfExperimentForm({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: Readonly<IrfExperimentFormProps>) {
  const { form, isCreating, handleCancel, handleSubmit } = useIrfExperimentForm(
    {
      projectId,
      studyTypeId,
      specialization,
      onSuccess,
      onCancel,
    }
  );

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <ExperimentNameField control={form.control} name="experimentName" />
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size="lg"
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
