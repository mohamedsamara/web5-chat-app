import { getAvatarUrl } from "@/lib/utils";
import {
  Avatar as AvatarUI,
  AvatarFallback,
  AvatarImage,
} from "components/ui/avatar";

type Props = {
  src: string;
  alias?: string;
};

const UserAvatar = ({ src, alias }: Props) => {
  return (
    <AvatarUI className="relative flex items-center justify-center w-8 h-8">
      <AvatarImage className="w-8 h-8 aspect-1" src={getAvatarUrl(src) ?? ""} />
      <AvatarFallback className="aspect-1 w-8 h-8 text-base text-center inline-flex items-center pl-px justify-center">
        {alias ? (alias.length > 0 && alias?.[0].toUpperCase()) ?? "?" : "?"}
      </AvatarFallback>
    </AvatarUI>
  );
};

export default UserAvatar;
