"use client";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-current border-t-transparent" />
    </div>
  );
}
