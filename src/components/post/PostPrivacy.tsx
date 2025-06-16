import type { PrivacyType } from "../../types/api";
import {
  GlobeAltIcon,
  LockClosedIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

interface PostPrivacyProps {
  privacy: PrivacyType;
}

export function PostPrivacy({ privacy }: PostPrivacyProps) {
  switch (privacy) {
    case 0:
      return (
        <div className="flex items-center gap-1">
          <GlobeAltIcon className="size-4" />
          {/* <span>Public</span> */}
        </div>
      );
    case 1:
      return (
        <div className="flex items-center gap-1">
          <UsersIcon className="size-4" />
          {/* <span>Friends</span> */}
        </div>
      );
    case 2:
      return (
        <div className="flex items-center gap-1">
          <LockClosedIcon className="size-4" />
          {/* <span>Private</span> */}
        </div>
      );
    default:
      return null;
  }
}
