import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../atoms/Button/Button";
import { Dialog } from "../atoms/Dialog/Dialog";
import { Textarea } from "../atoms/Textarea/Textarea";
import type { DataViewItem } from "../organisms/DataTable/tableData";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../organisms/Form/Form";

const rejectSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(3, "Rejection reason must be at least 3 characters"),
});

type RejectFormData = z.infer<typeof rejectSchema>;

interface RejectExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  item: DataViewItem | null;
  isRejectLoading?: boolean;
}

export function RejectExperimentModal({
  isOpen,
  onClose,
  onReject,
  item,
  isRejectLoading = false,
}: Readonly<RejectExperimentModalProps>) {
  const form = useForm<RejectFormData>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const handleReject = (data: RejectFormData) => {
    onReject(data.rejectionReason);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleClose();
      }}
      title="Reject Experiment"
      description={
        item ? `Please provide a reason for rejecting "${item.name}"` : ""
      }
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(handleReject)}>
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>
                    Reason for Rejection <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter detailed reason for rejection..."
                      className="min-h-28 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                disabled={isSubmitting || isRejectLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isRejectLoading}
                variant={"danger"}
              >
                {isSubmitting || isRejectLoading
                  ? "Submitting..."
                  : "Submit Rejection"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Dialog>
  );
}
