import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, Label, Textarea } from "@/components/atoms";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/molecules/Dialog/Dialog";
import {
  type TerminateMouseFormData,
  terminateMouseSchema,
} from "@/schemas/terminateMouseSchema";

interface TerminateMouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  selectedMouseIds: string[];
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

/**
 * TerminateMouseModal Component
 *
 * Confirmation modal for terminating mice with optional reason input.
 *
 * @param open - Controls modal visibility
 * @param onOpenChange - Callback when modal visibility changes
 * @param selectedCount - Number of mice selected for termination
 * @param selectedMouseIds - Array of mouse delivery IDs to terminate
 * @param onConfirm - Callback with termination reason when confirmed
 * @param isLoading - Loading state for termination mutation
 */
export function TerminateMouseModal({
  open,
  onOpenChange,
  selectedCount,
  selectedMouseIds,
  onConfirm,
  isLoading = false,
}: Readonly<TerminateMouseModalProps>) {
  const form = useForm<TerminateMouseFormData>({
    resolver: zodResolver(terminateMouseSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Reset reason when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleFormSubmit = (data: TerminateMouseFormData) => {
    onConfirm(data.reason ?? "");
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-[500px]">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <DialogTitle className="text-lg font-semibold text-destructive">
                Terminate {selectedCount}{" "}
                {selectedCount === 1 ? "Mouse" : "Mice"}
              </DialogTitle>
            </div>

            <p className="text-sm text-muted-foreground">
              You are about to terminate {selectedCount}{" "}
              {selectedCount === 1 ? "mouse" : "mice"}. This action cannot be
              undone. You may optionally provide a reason for termination.
            </p>

            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              {/* Selected Mice Display */}
              <div className="bg-muted rounded-md p-3 max-h-32 overflow-y-auto">
                <p className="text-sm font-medium mb-2">Selected Mice:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMouseIds.map((id) => (
                    <span
                      key={id}
                      className="text-xs bg-background px-2 py-1 rounded border"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>

              {/* Termination Reason Input */}
              <div className="space-y-2">
                <Label htmlFor="termination_reason">
                  Termination Reason (Optional)
                </Label>
                <Textarea
                  id="termination_reason"
                  placeholder="Enter reason for termination (optional)"
                  className="resize-none"
                  rows={4}
                  {...form.register("reason")}
                  disabled={isLoading}
                />
                {form.formState.errors.reason && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.reason.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isLoading}
                >
                  {isLoading ? "Terminating..." : "Terminate"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
