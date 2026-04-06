import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft } from "lucide-react";

import type { EfficacyRandomizationGroup } from "@/types/efficacy-randomization";

import { Button } from "../atoms";
import { EfficacyRandomizationResultSkeleton } from "../skeletons/EfficacyRandomizationResultSkeleton";
import { EfficacyMainGroupCard } from "./EfficacyMainGroupCard";

interface EfficacyRandomizationResultViewProps {
  groups: EfficacyRandomizationGroup[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onGroupAction: (group: EfficacyRandomizationGroup) => void;
  getGroupActionLabel: (groupId: number) => string;
  isGroupActionPending: (groupId: number) => boolean;
  getGroupPendingLabel: (groupId: number) => string | null;
}

export function EfficacyRandomizationResultView({
  groups,
  isLoading,
  isError,
  errorMessage,
  onGroupAction,
  getGroupActionLabel,
  isGroupActionPending,
  getGroupPendingLabel,
}: Readonly<EfficacyRandomizationResultViewProps>) {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/data-validate" })}
            className="flex items-center gap-2"
            aria-label="Back to data validation"
            title="Back to data validation"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-3xl font-bold">Efficacy Randomization Result</h1>
        </div>
      </div>

      {isLoading && <EfficacyRandomizationResultSkeleton />}

      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-10 py-10 text-center max-w-md w-full shadow-sm">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-7 text-destructive" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-destructive">
                Failed to load efficacy randomization groups
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {errorMessage || "Something went wrong while fetching data."}
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {groups.length === 0 ? (
            <p className="text-muted-foreground">
              No groups found for this experiment.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {groups.map((group) => (
                <EfficacyMainGroupCard
                  key={group.group_id}
                  group={group}
                  actionLabel={getGroupActionLabel(group.group_id)}
                  pendingLabel={getGroupPendingLabel(group.group_id)}
                  isActionPending={isGroupActionPending(group.group_id)}
                  onAction={onGroupAction}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
