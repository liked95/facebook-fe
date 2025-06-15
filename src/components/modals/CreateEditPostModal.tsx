import { Modal } from "./Modal";
import { CreatePost } from "../post/CreatePost";
import type { PostResponseDto, UserResponseDto } from "../../types/api";

interface CreateEditPostModalProps {
  open: boolean;
  onClose: () => void;
  post: PostResponseDto | null;
  currentUser: UserResponseDto;
}

export function CreateEditPostModal({ open, onClose, post, currentUser }: CreateEditPostModalProps) {
  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-2xl">
      <CreatePost post={post} onClose={onClose} currentUser={currentUser} />
    </Modal>
  );
} 