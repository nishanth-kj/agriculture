"use client";

interface ConfirmDialogProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-background p-6 shadow-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
