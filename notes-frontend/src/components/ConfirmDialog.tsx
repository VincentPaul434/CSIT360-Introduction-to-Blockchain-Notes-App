import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative z-[101] w-full max-w-md rounded-xl border bg-white p-6 shadow-xl">
        <div className="flex gap-4">
          <div className="bg-amber-100 p-2 rounded-full text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>

          <Button onClick={onConfirm} className="bg-red-500 text-white">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};