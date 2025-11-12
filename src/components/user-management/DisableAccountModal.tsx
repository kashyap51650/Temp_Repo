import { CheckCircle, LucideTrash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";

export interface DisableAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleStatus: () => void;
  username?: string;
  userStatus: "Active" | "Inactive";
  isLoading?: boolean;
}

export const DisableAccountModal: React.FC<DisableAccountModalProps> = ({
  open,
  onOpenChange,
  onToggleStatus,
  username,
  userStatus,
  isLoading = false,
}) => {
  const isDisabling = userStatus === "Active";

  const ACTIONS = {
    disabling: {
      actionText: "disable",
      buttonVariant: "danger" as const,
      iconBgColor: "bg-red-100",
      IconComponent: LucideTrash2,
      iconColor: "text-destructive",
    },
    enabling: {
      actionText: "enable",
      buttonVariant: "default" as const,
      iconBgColor: "bg-green-100",
      IconComponent: CheckCircle,
      iconColor: "text-green-600",
    },
  };

  const { actionText, buttonVariant, iconBgColor, IconComponent, iconColor } =
    isDisabling ? ACTIONS.disabling : ACTIONS.enabling;

  const actionTextCapitalized =
    actionText.charAt(0).toUpperCase() + actionText.slice(1);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      showClose={false}
      className="max-w-md"
      title={
        <div className="flex flex-col items-center gap-2">
          <div
            className={`flex-shrink-0 flex items-center justify-center p-2 w-12 h-12 ${iconBgColor} rounded-full`}
          >
            <IconComponent className={`mx-auto ${iconColor}`} size={24} />
          </div>
          <span className="w-full block text-center text-lg font-semibold">
            Are you sure you want to {actionText} this User?
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
                {isDisabling ? (
                  <>
                    The user will not be able to access the platform until the
                    account is reactivated.
                  </>
                ) : (
                  <>
                    The user will be able to access the platform and log in
                    again.
                  </>
                )}
              </>
            ) : (
              <>
                {isDisabling ? (
                  <>
                    This account is now disabled. The user will not be able to
                    log in or access the platform until re-enabled.
                  </>
                ) : (
                  <>
                    This account will be enabled. The user will be able to log
                    in and access the platform.
                  </>
                )}
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            variant={buttonVariant}
            className="flex-1 default"
            onClick={() => {
              onToggleStatus();
              onOpenChange(false);
            }}
            disabled={isLoading}
          >
            {isLoading
              ? `${actionTextCapitalized}ing...`
              : `${actionTextCapitalized} Account`}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
