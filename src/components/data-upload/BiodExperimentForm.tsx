import type { ExperimentDropdownItem } from "@/api";
import { Button } from "@/components/atoms";
import { Form } from "@/components/organisms";
import { useBiodExperimentForm } from "@/hooks/useBiodExperimentForm";

import { CellLineField, ExperimentNameField, IsotopeField } from "./FormFields";

interface BiodExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  preselectedCellLineIds?: number[];
  isCellLineDisabled?: boolean;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export const BiodExperimentForm = ({
  projectId,
  studyTypeId,
  specialization,
  isCellLineDisabled = false,
  preselectedCellLineIds = [],
  onSuccess,
  onCancel,
}: BiodExperimentFormProps) => {
  const { form, isCreating, handleSubmit, handleCancel } =
    useBiodExperimentForm({
      projectId,
      studyTypeId,
      specialization,
      preselectedCellLineIds,
      onSuccess,
      onCancel,
    });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <ExperimentNameField control={form.control} name="experimentName" />

        <IsotopeField control={form.control} name="isotopeId" valueAsNumber />

        <CellLineField
          control={form.control}
          name="cellLineIds"
          multiple={true}
          disabled={isCellLineDisabled}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCancel}
            disabled={isCreating}
            type="button"
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
};
