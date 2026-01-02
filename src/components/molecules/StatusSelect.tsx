import { Label } from "../atoms/Label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select/Select";

interface StatusOption {
  value: string;
  label: string;
}

interface StatusSelectProps {
  value: string;
  onValueChange: (status: string) => void;
  options: StatusOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  showLabel?: boolean;
}

/**
 * StatusSelect - A reusable dropdown component for selecting status
 *
 * Features:
 * - Configurable status options
 * - Optional label with conditional rendering
 * - Flexible styling
 *
 * @param value - Currently selected status value
 * @param onValueChange - Callback when status selection changes
 * @param options - Array of status options with value and label
 * @param placeholder - Placeholder text for the select
 * @param className - Additional CSS classes
 * @param disabled - Whether the select is disabled
 * @param label - Optional label text
 * @param showLabel - Whether to show the label (default: true)
 */
export function StatusSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select Status",
  className,
  disabled = false,
  label,
  showLabel = true,
}: StatusSelectProps) {
  return (
    <>
      {showLabel && label && (
        <Label className="text-sm font-medium mb-2 inline-block">{label}</Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
