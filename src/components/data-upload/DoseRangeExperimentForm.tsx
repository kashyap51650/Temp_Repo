import { useDoseRangeStudyForm } from "@/hooks/useDoseRangeStudyForm";
import type { ExperimentDropdownItem } from "@/lib/api";

import { Button } from "../atoms";
import { Form } from "../organisms";
import {
  DoseTypeField,
  DrugTypeField,
  ExperimentNameField,
} from "./FormFields";

interface DoseRangeExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

const DoseRangeExperimentForm = ({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: DoseRangeExperimentFormProps) => {
  const { form, isCreating, handleCancel, handleSubmit } =
    useDoseRangeStudyForm({
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
        <DoseTypeField control={form.control} name="doses" multiple={true} />
        <DrugTypeField control={form.control} name="drugs" multiple={true} />
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
};

export default DoseRangeExperimentForm;
