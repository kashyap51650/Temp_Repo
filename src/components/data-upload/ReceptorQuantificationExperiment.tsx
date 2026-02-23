import { useEffect } from "react";

import type { ExperimentDropdownItem } from "@/api";
import { useReceptorQuantificationForm } from "@/hooks/useReceptorQuantificationForm";

import { Button, Input } from "../atoms";
import { Form } from "../organisms";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../organisms/Form/Form";
import { CellLineField, ExperimentNameField } from "./FormFields";
import { AntiBodyField } from "./FormFields/AntiBodyField";

interface ReceptorQuantificationExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export default function ReceptorQuantificationExperimentForm({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: Readonly<ReceptorQuantificationExperimentFormProps>) {
  const { form, isCreating, handleCancel, handleSubmit } =
    useReceptorQuantificationForm({
      projectId,
      studyTypeId,
      specialization,
      onSuccess,
      onCancel,
    });

  const primaryAntibody = form.watch("primaryAntibody");

  useEffect(() => {
    if (form.getValues("secondaryAntibody") !== undefined) {
      form.trigger("secondaryAntibody");
    }
  }, [primaryAntibody, form]);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <ExperimentNameField control={form.control} name="experimentName" />
        <div>
          <CellLineField
            control={form.control}
            name="cellLine"
            multiple={true}
          />
        </div>
        <AntiBodyField
          label="Primary Antibody"
          control={form.control}
          name="primaryAntibody"
        />
        <AntiBodyField
          label="Secondary Antibody (Optional)"
          control={form.control}
          name="secondaryAntibody"
        />
        <FormField
          control={form.control}
          name="noOfReceptors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. of Receptors</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Enter No. of Receptors"
                  className="w-full"
                  size="lg"
                  min={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
