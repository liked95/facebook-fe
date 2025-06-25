import { Modal } from "./Modal";
import { Button } from "../ui/Button";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
  isDisabled = false,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[#232946] dark:text-[#E4E6EB] mb-2">
          {title}
        </h2>
        <p className="text-[#65676B] dark:text-[#B0B3B8] mb-6">
          {description}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              if (!isLoading) onConfirm();
            }}
            disabled={isLoading || isDisabled}
          >
            {isLoading ? (
              <span className="flex items-center gap-2"><span className="loader size-4 border-2 border-t-transparent rounded-full animate-spin"></span>{confirmText}</span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 