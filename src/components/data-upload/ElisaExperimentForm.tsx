import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect } from "react";

import type { ExperimentDropdownItem } from "@/api";
import { useElisaExperimentForm } from "@/hooks/useElisaExperimentForm";

import { Button, Input, Label } from "../atoms";
import { Form } from "../organisms";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../organisms/Form/Form";
import { ExperimentNameField } from "./FormFields";

interface ElisaExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export default function ElisaExperimentForm({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: Readonly<ElisaExperimentFormProps>) {
  const {
    form,
    fields,
    isCreating,
    handleAddPair,
    handleRemovePair,
    handleCancel,
    handleSubmit,
  } = useElisaExperimentForm({
    projectId,
    studyTypeId,
    specialization,
    onSuccess,
    onCancel,
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith("kd_values.")) {
        const match = name.match(/kd_values\.(\d+)\./);
        if (match) {
          const index = Number.parseInt(match[1], 10);
          const pair = value.kd_values?.[index];
          const hasKey =
            pair?.kd_key !== undefined && pair?.kd_key?.trim() !== "";
          const hasValue =
            pair?.kd_value !== undefined && pair?.kd_value?.trim() !== "";
          if (hasKey && hasValue) {
            form.trigger("kd_values");
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <ExperimentNameField control={form.control} name="experimentName" />

        <div className="space-y-3">
          <Label className="mb-3">Kd Values</Label>

          {form.formState.errors.kd_values && (
            <p className="text-sm text-red-500">
              {form.formState.errors.kd_values.message}
            </p>
          )}

          <div className="border border-gray-200 p-3 rounded-md max-h-56 overflow-y-auto">
            {fields.map((field, index) => {
              const currentPair = form.watch(`kd_values.${index}`);
              const isBothFieldsFilled =
                currentPair?.kd_key !== undefined &&
                currentPair?.kd_key?.trim() !== "" &&
                currentPair?.kd_value !== undefined &&
                currentPair?.kd_value?.trim() !== "";

              return (
                <div
                  key={field.id}
                  className="flex items-start gap-3 w-full mb-2"
                >
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`kd_values.${index}.kd_key`}
                      render={({ field: fieldProps }) => (
                        <FormItem className="w-full mb-0">
                          <FormLabel>Key</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter key"
                              className="min-h-10"
                              {...fieldProps}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name={`kd_values.${index}.kd_value`}
                      render={({ field: fieldProps }) => (
                        <FormItem className="w-full mb-0">
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter value"
                              className="min-h-10"
                              {...fieldProps}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
