import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

interface PostActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function PostActions({ onEdit, onDelete, onClose }: PostActionsProps) {
  return (
    <div className="absolute right-0 top-full mt-1 w-48 rounded-md bg-white dark:bg-[#232946] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-sm"
          onClick={() => {
            onEdit();
            onClose();
          }}
        >
          <Icon name="edit" className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-sm text-red-500 hover:text-red-600"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          <Icon name="trash" className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
} 