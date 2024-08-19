import { cn, getAvatarUrl } from "lib/utils";
import {
  Avatar as AvatarUI,
  AvatarFallback,
  AvatarImage,
} from "components/ui/avatar";

type Props = {
  src: string;
  alias?: string;
  size?: "3xl" | "2xl" | "xl" | "lg" | "md" | "sm";
};

const Size = {
  "3xl": "w-16 h-16",
  "2xl": "w-14 h-14",
  xl: "w-12 h-12",
  lg: "w-10 h-10",
  md: "w-8 h-8",
  sm: "w-6 h-6",
};

const UserAvatar = ({ src, alias, size = "md" }: Props) => {
  const s = Size[size];

  return (
    <AvatarUI
      className={cn(
        "relative flex items-center justify-center border b-slate-400",
        s
      )}
    >
      <AvatarImage
        className={cn("aspect-1", s)}
        src={getAvatarUrl(src) ?? ""}
        draggable={false}
      />
      <AvatarFallback
        className={cn(
          "aspect-1 text-base text-center inline-flex items-center pl-px justify-center",
          s
        )}
      >
        {alias ? (alias.length > 0 && alias?.[0].toUpperCase()) ?? "?" : "?"}
      </AvatarFallback>
    </AvatarUI>
  );
};

export default UserAvatar;
