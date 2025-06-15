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
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 