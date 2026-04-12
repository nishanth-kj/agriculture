"use client";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No records available.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-muted-foreground">
      <div className="h-12 w-12 rounded-full bg-muted/60" />
      <p>{message}</p>
    </div>
  );
}
