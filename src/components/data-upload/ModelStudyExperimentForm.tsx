import { PlusIcon, Trash2Icon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { useModelStudyForm } from "@/hooks/useModelStudyForm";

import { Button, Label } from "../atoms";
import { Form } from "../organisms";
import { CellLineStrainOrderModal } from "./CellLineStrainOrderModal";
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
  onSuccess?: (data: { id: number; experiment_name: string }) => void;
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

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderItems, setOrderItems] = useState<
    { id: string; cellLine: string; strain: string }[]
  >([]);

  const getOrderItems = () =>
    fields.map((field, idx) => ({
      id: field.id,
      cellLine: String(
        form.getValues(`cellLineStrainPairs.${idx}.cell_line_id`)
      ),
      strain: String(
        form.getValues(`cellLineStrainPairs.${idx}.mouse_strain_id`)
      ),
    }));

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOrderItems(getOrderItems());
    setShowOrderModal(true);
  };

  const handleOrderSave = () => {
    setShowOrderModal(false);
    handleSubmit();
  };

  return (
    <>
      {!showOrderModal && (
        <Form {...form}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <ExperimentNameField control={form.control} name="experimentName" />

            <div className="space-y-3">
              <Label className="mb-3">Cell Line & Strain Pairs</Label>

              {form.formState.errors.cellLineStrainPairs && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.cellLineStrainPairs.message}
                </p>
              )}

              <div className="border border-gray-200 p-3 rounded-md max-h-56 overflow-y-auto">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-end gap-3 w-full mb-2"
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
                    <div className="flex items-end">
                      {index === fields.length - 1 ? (
                        <Button
                          variant="outline"
                          type="button"
                          size="sm"
                          onClick={handleAddPair}
                          className="h-10 px-3"
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
                ))}
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
              <Button
                size="lg"
                type="button"
                disabled={isCreating}
                onClick={handleSaveClick}
              >
                {isCreating ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}

      <CellLineStrainOrderModal
        open={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        items={orderItems}
        onSave={handleOrderSave}
      />
    </>
  );
};

export default ModelStudyExperimentForm;
