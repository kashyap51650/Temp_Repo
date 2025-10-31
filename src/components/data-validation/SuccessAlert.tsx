import { Check, X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "../atoms";

interface SuccessAlertProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function SuccessAlert({
  isVisible,
  message,
  onClose,
  duration = 5000,
}: SuccessAlertProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[99] bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right-4 fade-in">
      <div className="flex items-center gap-2">
        <Check className="size-4 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <Button
          onClick={onClose}
          variant="ghost"
          className="ml-2 text-green-600 hover:text-green-800 focus:outline-none"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
