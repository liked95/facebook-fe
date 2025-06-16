import { Button } from "../ui/Button";
import { PencilIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";

interface PostActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function PostActions({ onEdit, onDelete, onClose }: PostActionsProps) {
  return (
    <div className="absolute right-0 top-full mt-1 rounded-md bg-white dark:bg-[#242526] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <div className="py-1">
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-sm"
          onClick={() => {
            onEdit();
            onClose();
          }}
        >
          <div className="flex items-center gap-2">
            <PencilIcon className="size-4" />
            <span>Edit</span>
          </div>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-sm text-red-500 hover:text-red-600"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          <div className="flex items-center gap-2">
            <TrashIcon className="size-4" />
            <span>Delete</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
