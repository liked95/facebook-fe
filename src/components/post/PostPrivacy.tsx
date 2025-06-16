import { Icon } from "../ui/Icon";
import type { PrivacyType } from "../../types/api";

interface PostPrivacyProps {
  privacy: PrivacyType;
}

export function PostPrivacy({ privacy }: PostPrivacyProps) {
  switch (privacy) {
    case 0:
      return (
        <span className="flex items-center gap-1">
          <Icon name="globe" className="h-4 w-4" />
          Public
        </span>
      );
    case 1:
      return (
        <span className="flex items-center gap-1">
          <Icon name="users" className="h-4 w-4" />
          Friends
        </span>
      );
    case 2:
      return (
        <span className="flex items-center gap-1">
          <Icon name="lock" className="h-4 w-4" />
          Private
        </span>
      );
    default:
      return null;
  }
} 