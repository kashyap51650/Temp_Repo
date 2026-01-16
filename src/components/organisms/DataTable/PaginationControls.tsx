import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";

import { Button } from "@/components/atoms";
import type { PaginationState } from "@/types/pagination";

type PaginationControlsProps = {
  pagination: PaginationState;
};

export function PaginationControls({
  pagination,
}: Readonly<PaginationControlsProps>) {
  const {
    page,
    totalPages,
    canNext,
    canPrev,
    onFirst,
    onPrev,
    onNext,
    onLast,
  } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex w-full items-center gap-8 lg:w-fit">
      <div className="text-sm font-medium">
        Page {page} of {totalPages}
      </div>

      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={onFirst}
          disabled={!canPrev}
        >
          <IconChevronsLeft />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onPrev}
          disabled={!canPrev}
        >
          <IconChevronLeft />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onNext}
          disabled={!canNext}
        >
          <IconChevronRight />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="hidden size-8 lg:flex"
          onClick={onLast}
          disabled={!canNext}
        >
          <IconChevronsRight />
        </Button>
      </div>
    </div>
  );
}
