import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface DialogProps extends DialogPrimitive.DialogProps {
  trigger: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  showClose?: boolean; // Controls cross icon visibility
  className?: string; // Custom class for Dialog content
  preventOutsideClose?: boolean; // Prevents closing when clicking outside
}

export function Dialog({
  trigger,
  title,
  description,
  children,
  showClose = true,
  className,
  preventOutsideClose = false,
  ...props
}: DialogProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none",
            !className?.includes("max-w") && "max-w-lg",
            className
          )}
          onPointerDownOutside={
            preventOutsideClose ? (e) => e.preventDefault() : undefined
          }
          onEscapeKeyDown={
            preventOutsideClose ? (e) => e.preventDefault() : undefined
          }
        >
          {title && (
            <DialogPrimitive.Title className="text-lg font-semibold mb-0">
              {title}
            </DialogPrimitive.Title>
          )}
          {description && (
            <DialogPrimitive.Description className="mb-4 text-sm text-gray-500">
              {description}
            </DialogPrimitive.Description>
          )}
          {children}
          {showClose && (
            <DialogPrimitive.Close className="absolute right-4 top-4 text-gray-400 cursor-pointer hover:text-gray-600 focus:outline-none">
              <X className="size-5" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
