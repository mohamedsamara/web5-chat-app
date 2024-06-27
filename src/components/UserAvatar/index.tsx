import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";

type Props = {
  src: string;
  alias: string;
};

const UserAvatar = ({ src, alias }: Props) => {
  return (
    <Avatar className="relative flex items-center justify-center w-8 h-8">
      <AvatarImage className="w-8 h-8 aspect-1" src={src ?? ""} />
      <AvatarFallback className="aspect-1 w-8 h-8 text-base text-center inline-flex items-center pl-px justify-center">
        {(alias.length > 0 && alias?.[0].toUpperCase()) ?? "?"}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
