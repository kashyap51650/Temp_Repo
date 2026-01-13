import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useRef } from "react";

import { useModelStudyForm } from "@/hooks/useModelStudyForm";
import type { ExperimentDropdownItem } from "@/lib/api";

import { Button, Label } from "../atoms";
import { Form } from "../organisms";
import {
  CellLineField,
  CellsInjectedField,
  ExperimentNameField,
  InjectionDateField,
  StrainField,
  VehicleField,
} from "./FormFields";

interface ModelStudyExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

const ModelStudyExperimentForm = ({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: ModelStudyExperimentFormProps) => {
  const {
    form,
    fields,
    isCreating,
    handleAddPair,
    handleRemovePair,
    handleCancel,
    handleSubmit,
  } = useModelStudyForm({
    projectId,
    studyTypeId,
    specialization,
    onSuccess,
    onCancel,
  });

  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && fields.length === 0) {
      initializedRef.current = true;
      handleAddPair();
    }
  }, [fields.length, handleAddPair]);

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <ExperimentNameField control={form.control} name="experimentName" />

          <div className="space-y-3">
            <Label className="mb-3">Cell Line & Strain Pairs</Label>

            {form.formState.errors.cellLineStrainPairs && (
              <p className="text-sm text-red-500">
                {form.formState.errors.cellLineStrainPairs.message}
              </p>
            )}

            <div className="border border-gray-200 p-3 rounded-md max-h-56 overflow-y-auto">
              {fields.map((field, index) => {
                const currentPair = form.watch(`cellLineStrainPairs.${index}`);
                const isBothFieldsFilled =
                  currentPair?.cell_line_id !== undefined &&
                  currentPair?.mouse_strain_id !== undefined;

                return (
                  <div
                    key={field.id}
                    className="flex items-start gap-3 w-full mb-2"
                  >
                    <div className="flex-1">
                      <CellLineField
                        control={form.control}
                        name={`cellLineStrainPairs.${index}.cell_line_id`}
                      />
                    </div>
                    <div className="flex-1">
                      <StrainField
                        control={form.control}
                        name={`cellLineStrainPairs.${index}.mouse_strain_id`}
                      />
                    </div>
                    <div className="flex items-start pt-5.5">
                      {index === fields.length - 1 ? (
                        <Button
                          variant="outline"
                          type="button"
                          size="sm"
                          onClick={handleAddPair}
                          className="h-10 px-3"
                          disabled={!isBothFieldsFilled}
                        >
                          <PlusIcon className="size-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          type="button"
                          size="sm"
                          onClick={() => handleRemovePair(index)}
                          className="h-10 px-3"
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <CellsInjectedField
            control={form.control}
            name="cellInjectionCounts"
            multiple={true}
          />
          <VehicleField
            control={form.control}
            name="vehicles"
            multiple={true}
          />
          <InjectionDateField control={form.control} name="injectionDate" />
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
    </>
  );
};

export default ModelStudyExperimentForm;
