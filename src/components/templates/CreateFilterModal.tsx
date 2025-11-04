import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Button, Dialog, Input, Label } from "../atoms";
import { Badge } from "../atoms/Badge/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select/Select";

interface CreateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFilter: (filterData: {
    filterTitle: string;
    filterType: string;
    filterOptions: string[];
  }) => void;
  existingFilters?: string[];
}

export function CreateFilterModal({
  isOpen,
  onClose,
  onCreateFilter,
  existingFilters = [],
}: CreateFilterModalProps) {
  const [filterTitle, setFilterTitle] = useState("");
  const [filterType, setFilterType] = useState("");
  const [optionValue, setOptionValue] = useState("");
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    options: "",
  });

  const filterTypes = ["Text Box", "Dropdown", "Radio Button"];

  const validateForm = () => {
    const newErrors = { title: "", options: "" };
    let isValid = true;

    if (!filterTitle.trim()) {
      newErrors.title = "Filter title is required";
      isValid = false;
    } else if (existingFilters.includes(filterTitle.trim())) {
      newErrors.title = "A filter with this title already exists";
      isValid = false;
    }

    if (
      (filterType === "Dropdown" || filterType === "Radio Button") &&
      filterOptions.length === 0
    ) {
      newErrors.options =
        "At least one option is required for this filter type";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddOption = () => {
    if (optionValue.trim() && !filterOptions.includes(optionValue.trim())) {
      setFilterOptions([...filterOptions, optionValue.trim()]);
      setOptionValue("");
      setErrors({ ...errors, options: "" });
    }
  };

  const handleRemoveOption = (option: string) => {
    setFilterOptions(filterOptions.filter((opt) => opt !== option));
  };

  const handleCreate = () => {
    if (validateForm()) {
      onCreateFilter({
        filterTitle: filterTitle.trim(),
        filterType,
        filterOptions,
      });
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setFilterTitle("");
    setFilterType("");
    setOptionValue("");
    setFilterOptions([]);
    setErrors({ title: "", options: "" });
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const showOptionsField =
    filterType === "Dropdown" || filterType === "Radio Button";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleCancel();
      }}
      title="Create New Visual Filter"
      description="Define a new visual data filter"
      showClose={true}
      className="max-w-xl"
      trigger={null}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="filter-title">Filter Title</Label>
          <Input
            id="filter-title"
            size="lg"
            value={filterTitle}
            onChange={(e) => {
              setFilterTitle(e.target.value);
              setErrors({ ...errors, title: "" });
            }}
            placeholder="Enter filter title"
            className="w-full"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-type">Filter Type</Label>
          <Select
            value={filterType}
            onValueChange={(value) => {
              setFilterType(value);
              if (value === "Text Box") {
                setFilterOptions([]);
                setErrors({ ...errors, options: "" });
              }
            }}
          >
            <SelectTrigger className="w-full" size="lg">
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              {filterTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Options */}
        {showOptionsField && (
          <div className="space-y-2">
            <Label htmlFor="filter-options">Filter Options</Label>
            <div className="flex gap-2">
              <Input
                id="filter-options"
                size="lg"
                value={optionValue}
                onChange={(e) => setOptionValue(e.target.value)}
                placeholder="Enter option value"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
              <Button
                variant="secondary"
                size="lg"
                onClick={handleAddOption}
                disabled={!optionValue.trim()}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {errors.options && (
              <p className="text-sm text-destructive">{errors.options}</p>
            )}

            {/* Option Tags */}
            {filterOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {filterOptions.map((option) => (
                  <Badge
                    key={option}
                    variant="secondary"
                    className="pl-3 pr-2 py-1.5 text-sm flex items-center gap-2"
                  >
                    {option}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(option)}
                      className="hover:bg-muted rounded-full p-0.5"
                      aria-label={`Remove ${option}`}
                    >
                      <X className="size-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Preview Section */}
        {filterTitle && filterType && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="text-sm font-medium mb-3">Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>Filter Name:</span>
                <span className="text-sm">{filterTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Type:</span>
                <span className="text-sm">{filterType}</span>
              </div>
              {filterOptions.length > 0 && (
                <div className="flex items-start gap-2">
                  <span>Options:</span>
                  <div className="flex flex-wrap gap-1">
                    {filterOptions.map((option) => (
                      <Badge key={option} variant="outline" className="text-xs">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" size="lg" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={handleCreate}
            disabled={!filterTitle || !filterType}
          >
            Create
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
