import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "center";

export type ToastVariant = "error" | "success" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "danger";
  disabled?: boolean;
}

const variantConfig: Record<
  ToastVariant,
  {
    icon: typeof CircleAlert;
    headerBg: string;
    iconBg: string;
    textColor: string;
    contentBg: string;
  }
> = {
  error: {
    icon: CircleAlert,
    headerBg: "bg-destructive",
    iconBg: "bg-white/20",
    textColor: "text-white",
    contentBg: "bg-red-50",
  },
  success: {
    icon: CircleCheck,
    headerBg: "bg-accent",
    iconBg: "bg-white/20",
    textColor: "text-accent-foreground",
    contentBg: "bg-white",
  },
  warning: {
    icon: TriangleAlert,
    headerBg: "bg-orange-500",
    iconBg: "bg-white/20",
    textColor: "text-white",
    contentBg: "bg-white",
  },
  info: {
    icon: Info,
    headerBg: "bg-secondary",
    iconBg: "bg-white/20",
    textColor: "text-secondary-foreground",
    contentBg: "bg-white",
  },
};

const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

export interface CustomToastProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
  errors?: string[];
  position?: ToastPosition;
  className?: string;
  onDismiss?: () => void;
  blurBackground?: boolean;
  blockInteraction?: boolean;
}

export function CustomToast({
  variant = "error",
  title,
  description,
  errors = [],
  position = "center",
  className,
  onDismiss,
  blurBackground = true,
  blockInteraction = true,
}: CustomToastProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onDismiss) {
        onDismiss();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onDismiss]);

  // Prevent all pointer/click events from propagating to underlying dialogs
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const stopPropagation = (e: Event) => {
      const target = e.target as HTMLElement;

      // Check if click is on the toast dismiss button or its children
      const dismissButton = target.closest("[data-toast-dismiss]");
      if (dismissButton) {
        onDismiss?.();
      }

      // Click is on overlay (outside toast) - stop propagation to prevent closing Dialog
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    overlay.addEventListener("pointerdown", stopPropagation, true);
    overlay.addEventListener("mousedown", stopPropagation, true);
    overlay.addEventListener("click", stopPropagation, true);

    return () => {
      overlay.removeEventListener("pointerdown", stopPropagation, true);
      overlay.removeEventListener("mousedown", stopPropagation, true);
      overlay.removeEventListener("click", stopPropagation, true);
    };
  }, []);

  // Prevent wheel events from propagating to prevent Radix Dialog scroll lock issues
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow scrolling inside the toast content
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest("[data-toast-scrollable]");

      if (scrollableParent) {
        // Let the scroll happen inside the scrollable area
        e.stopPropagation();
      }
    };

    content.addEventListener("wheel", handleWheel, { passive: false });
    return () => content.removeEventListener("wheel", handleWheel);
  }, []);

  const toastContent = (
    <div
      ref={overlayRef}
      className={cn(
        "fixed inset-0 z-[9999]",
        blurBackground && "backdrop-blur-xs bg-black/10",
        blockInteraction ? "pointer-events-auto" : "pointer-events-none",
        "animate-in fade-in duration-200"
      )}
      data-toast-overlay="true"
      data-remove-scroll-bar="false"
      aria-modal="true"
      role="dialog"
      aria-labelledby="toast-title"
      aria-describedby={description ? "toast-description" : undefined}
    >
      {/* Toast container (positioned) */}
      <div
        ref={contentRef}
        className={cn(
          "fixed",
          positionClasses[position],
          "max-w-lg w-full max-h-[80vh]",
          "bg-card rounded-lg shadow-2xl ",
          "pointer-events-auto",
          "animate-in slide-in-from-top-4 duration-300",
          className
        )}
        // Mark as scrollable for our wheel handler
        data-toast-content="true"
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-t-lg",
            config.headerBg,
            config.textColor
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0",
              config.iconBg
            )}
          >
            <Icon className="w-5 h-5" />
          </div>

          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <h3
              id="toast-title"
              className="text-lg font-semibold leading-tight"
            >
              {title}
            </h3>
            {description && (
              <p
                id="toast-description"
                className="mt-1 text-sm opacity-90 leading-snug"
              >
                {description}
              </p>
            )}
          </div>

          {/* Close button */}
          {onDismiss && (
            <Button
              variant={"ghost"}
              type="button"
              data-toast-dismiss
              className={cn(
                "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 transition-colors",
                config.textColor
              )}
              aria-label="Close notification"
            >
              <X className={cn(config.textColor)} />
            </Button>
          )}
        </div>

        {/* Error Details (Scrollable) */}
        {errors.length > 0 && (
          <div
            className={cn(
              "max-h-80 overflow-y-auto px-4 py-3 border-t border-border/50 rounded-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-500",
              config.contentBg
            )}
            data-toast-scrollable="true"
          >
            <ul className="space-y-4">
              {errors.map((error, index) => (
                <li key={`${error}-${index}`} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
}
