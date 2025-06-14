import { useScrollLock } from '../../hooks/useScrollLock';
import { useKeyboardEvent } from '../../hooks/useKeyboardEvent';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  widthClassName?: string;
}

export function Modal({ open, onClose, children, widthClassName = "max-w-xl" }: ModalProps) {
  useScrollLock(open);
  useKeyboardEvent('Escape', onClose, open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className={`bg-white dark:bg-[#232946] rounded-2xl shadow-2xl w-full ${widthClassName} mx-2 relative flex flex-col max-h-[95vh]`}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-2xl text-[#65676B] dark:text-[#A3BCF9] hover:text-[#1877F2] z-10"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
} 