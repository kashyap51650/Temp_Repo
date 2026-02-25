import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { doseFrequencyApi } from "@/api";
import { queryClient } from "@/lib";

import { Button, Dialog, Input, Label } from "../atoms";

interface CreateFrequencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const frequencySchema = z.object({
  frequencyName: z.string().trim().min(1, "Frequency name is required"),
  frequencyCode: z.string().trim().min(1, "Frequency code is required"),
});

type FrequencyFormData = z.infer<typeof frequencySchema>;

export function CreateFrequencyModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateFrequencyModalProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { description: string; frequency_code: string }) =>
      doseFrequencyApi.createDoseFrequency(payload),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FrequencyFormData>({
    resolver: zodResolver(frequencySchema),
    defaultValues: {
      frequencyName: "",
      frequencyCode: "",
    },
  });

  const onSubmit = async (data: FrequencyFormData) => {
    mutate(
      {
        description: data.frequencyName,
        frequency_code: data.frequencyCode,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || "Dose frequency created successfully");
          queryClient.invalidateQueries({
            queryKey: ["dose-frequencies-dropdown"],
          });
          reset();
          onSuccess?.();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Failed to create dose frequency", {
            description:
              error instanceof Error ? error.message : "An error occurred",
          });
        },
      }
    );
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Dose Frequency"
      description="Enter the details for the new dose frequency"
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="frequencyName">Frequency Name</Label>
          <Input
            id="frequencyName"
            placeholder="Enter frequency name"
            {...register("frequencyName")}
            disabled={isPending}
          />
          {errors.frequencyName && (
            <p className="text-sm text-red-500">
              {errors.frequencyName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequencyCode">Frequency Code</Label>
          <Input
            id="frequencyCode"
            placeholder="Enter frequency code"
            {...register("frequencyCode")}
            disabled={isPending}
          />
          {errors.frequencyCode && (
            <p className="text-sm text-red-500">
              {errors.frequencyCode.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
