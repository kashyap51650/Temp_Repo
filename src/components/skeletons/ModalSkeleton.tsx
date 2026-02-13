export function ModalSkeleton() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] mx-4 flex flex-col animate-pulse">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-muted rounded" />
              <div className="h-9 w-20 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden"></div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded" />
            <div className="h-9 w-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SimpleModalFallback() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-lg w-full h-full max-w-xl max-h-96 mx-4 flex flex-col animate-pulse">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-muted rounded" />
              <div className="h-9 w-20 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden"></div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded" />
            <div className="h-9 w-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
