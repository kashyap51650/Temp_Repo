import { LucideTrash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";

export interface DisableAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisable: () => void;
  username?: string;
}

export const DisableAccountModal: React.FC<DisableAccountModalProps> = ({
  open,
  onOpenChange,
  onDisable,
  username,
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      showClose={false}
      className="max-w-md"
      title={
        <div className="flex flex-col items-center gap-2">
          <div className="flex-shrink-0 flex items-center justify-center p-2 w-12 h-12 bg-red-100 rounded-full">
            <LucideTrash2 className="mx-auto text-destructive" size={24} />
          </div>
          <span className="w-full block text-center text-lg font-semibold">
            Are you sure you want to disable this User?
          </span>
        </div>
      }
      description=""
      trigger={null}
    >
      <div className="disable-modal-no-close">
        <style>{`.disable-modal-no-close [data-radix-dialog-close]{display:none!important;}`}</style>
        <div className="pb-4 pt-3 flex flex-col items-center justify-center text-center">
          <p className="text-base text-muted-foreground">
            {username ? (
              <>
                The user will not be able to access the platform until the
                account is reactivated.
              </>
            ) : (
              <>
                This account is now disabled. The user will not be able to log
                in or access the platform until re-enabled.
              </>
            )}
          </p>
        </div>
        <div className="flex flex-row gap-4 pt-2 w-full">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            variant="danger"
            className="flex-1 default"
            onClick={() => {
              onDisable();
              onOpenChange(false);
            }}
          >
            Disable Account
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
